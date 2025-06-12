const express = require("express");
const cors = require("cors");
const path = require("path");
const { OpenAI } = require("openai");

const app = express();
const port = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// 静的ファイルの場所を「現在のディレクトリ」に変更
app.use(express.static(__dirname));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/quiz", async (req, res) => {
  const { words } = req.body;

  if (!words || !Array.isArray(words) || words.length === 0) {
    return res.status(400).json({ error: "英単語リストが不正です。" });
  }

  const prompt = `次の英単語から5問の日本語訳問題を作ってください:\n${words.join(", ")}`;

  try {
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const quiz = chatResponse.choices[0].message.content;
    res.json({ quiz });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "OpenAIとの通信に失敗しました。" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
