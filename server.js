const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));  // 静的ファイルを配信

const PORT = process.env.PORT || 10000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');  // トップページ配信
});

app.post('/api/generateQuiz', async (req, res) => {
  const { words } = req.body; // ["apple", "banana", "cat"] など

  if (!words || words.length === 0) {
    return res.status(400).json({ error: '単語リストが空です。' });
  }

  const prompt = `
次の単語の英語テストの問題をランダムな順番で3問作ってください。  
単語リスト: ${words.join(', ')}  
問題文形式は「日本語で単語の意味を答えてください」としてください。  
答えも一緒に出力してください。JSON形式で以下のようにお願いします。  
[
  {"question": "appleの意味は？", "answer": "りんご"},
  ...
]
`;

  try {
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText',
      {
        prompt: { text: prompt },
        temperature: 0.7,
        maxOutputTokens: 500,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`,
        },
      }
    );

    const text = response.data?.candidates?.[0]?.output || '';

    let quiz = [];
    try {
      quiz = JSON.parse(text);
    } catch {
      return res.status(500).json({ error: 'クイズの解析に失敗しました。', raw: text });
    }

    res.json({ quiz });
  } catch (error) {
    console.error(error.response?.data || error.message || error);
    res.status(500).json({ error: 'クイズの生成に失敗しました。' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
