const imageUrlInput = document.getElementById("image-url");
const submitBtn = document.getElementById("submit-btn");
const resultTextarea = document.getElementById("result");
const categorySelect = document.getElementById("category");

submitBtn.addEventListener("click", async () => {
  const selectedCategory =
    categorySelect.options[categorySelect.selectedIndex].text;
  console.log("카테고리 >> " + selectedCategory);

  const contents = "";

  try {
    const response = await fetch(config.vectorDBUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": config.vectorDBKey,
      },
      body: JSON.stringify({
        command: "extream_search",
        index_name: "naverx-h-juris-dev",
        max_count: 1,
        question: `${selectedCategory}`,
      }),
    });

    const data = await response.json();
    const responseCode = data.code;
    contents = data.response.result[0].내용;

    console.log(responseCode);
    console.log(contents);
  } catch (error) {
    console.log(error);
  }

  const imageUrl = imageUrlInput.value;

  const messages = [
    { role: "system", content: "답변은 항상 한국어로 해주세요." },
    {
      role: "user",
      content: [
        {
          type: "text",
          text: contents + "위 내용 참고해서 위 사진을 분석해줘.",
        },
        {
          type: "image_url",
          image_url: { url: `${imageUrl}` },
        },
      ],
    },
  ];

  const gptInput = {
    model: "gpt-4o",
    temperature: 0.5,
    messages: messages,
    max_tokens: 1000,
  };

  const APIKEY = config.openAiKey;

  const CallGPT = async (gptInput) => {
    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${APIKEY}`,
          },
          body: JSON.stringify(gptInput),
        }
      );

      const resultJSON = await response.json();
      const resultContent = resultJSON.choices[0].message.content;
      return resultContent;
    } catch (error) {
      console.error("Error: ", error);
      return "";
    }
  };

  const result = await CallGPT(gptInput);
  resultTextarea.textContent = result;
});
