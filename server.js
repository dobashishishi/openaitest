const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai");

const app = express();
const port = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/quiz", async (req, res) => {
  const { words } = req.body;

  if (!words || !Array.isArray(words) || words.length === 0) {
    return res.status(400).json({ error: "英単語のリストが無効です。" });
  }

  const prompt = `次の英単語リストからランダムに5問の日本語訳問題を作成してください（形式：Q. 英単語 → 日本語訳）:\n${words.join(", ")}`;

  try {
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const quiz = chatResponse.choices[0].message.content;
    res.json({ quiz });
  } catch (error) {
    console.error("OpenAIエラー:", error);
    res.status(500).json({ error: "クイズの生成中にエラーが発生しました。" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
