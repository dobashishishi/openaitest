const express = require("express");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");
const path = require("path");

const app = express();
const port = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// HTMLファイルを返す
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// OpenAI設定（Renderの環境変数 OPENAI_API_KEY を使う）
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// AIに質問を送って返す
app.post("/api/ask", async (req, res) => {
  const { message } = req.body;

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo", // 必要に応じて変更
      messages: [{ role: "user", content: message }],
    });

    const reply = completion.data.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("OpenAIエラー:", error);
    res.status(500).json({ reply: "エラーが発生しました。" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
