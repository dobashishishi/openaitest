const express = require("express");
const cors = require("cors");
const path = require("path");
const { OpenAI } = require("openai"); // ← v4構文

const app = express();
const port = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// HTMLファイルを返す
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// OpenAI設定
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// APIエンドポイント
app.post("/api/ask", async (req, res) => {
  const { message } = req.body;

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    });

    const reply = chatCompletion.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("OpenAIエラー:", error);
    res.status(500).json({ reply: "エラーが発生しました。" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
