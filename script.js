const imageUrlInput = document.getElementById("image-url");
const submitBtn = document.getElementById("submit-btn");
const resultTextarea = document.getElementById("result");

submitBtn.addEventListener("click", async () => {
  const imageUrl = imageUrlInput.value;

  const messages = [
    { role: "system", content: "답변은 항상 한국어로 해주세요." },
    {
      role: "user",
      content: [
        { type: "text", text: "어떤 사진이야?" },
        {
          type: "image_url",
          image_url: { url: `data:image/jpeg;base64,${imageUrl}` },
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

  const APIKEY = ""; // your openai api key

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
