const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { OpenAI } = require('openai');

const app = express();
const port = process.env.PORT || 10000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // index.html などを public フォルダに入れる場合

// OpenAI 初期設定（環境変数 OPENAI_API_KEY を使用）
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post('/check', async (req, res) => {
  const { word, answer } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: "system",
          content: "あなたは英単語の意味を採点する先生です。"
        },
        {
          role: "user",
          content: `次の英単語の意味として、"${answer}" は正しいか判定し、簡単な解説もつけてください。単語: ${word}`
        }
      ]
    });

    const feedback = completion.choices[0].message.content.trim();
    res.json({ feedback });
  } catch (error) {
    console.error("OpenAIエラー:", error);
    res.status(500).json({ feedback: "AIの応答中にエラーが発生しました。" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
