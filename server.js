const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { OpenAIApi, Configuration } = require("openai");

const app = express();
const port = process.env.PORT || 10000;

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

app.use(cors());
app.use(bodyParser.json());

app.post("/quiz", async (req, res) => {
  const words = req.body.words;
  if (!words || words.length === 0) {
    return res.status(400).json({ error: "No words provided." });
  }

  const prompt = `次の英単語を使って、日本語訳を答えさせる4択クイズを作ってください。単語の順番はランダムにして。英単語: ${words.join(", ")}\n形式：\nQ1: 問題文\nA: a) ..., b) ..., c) ..., d) ...\n正解: ...`;

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    const quiz = completion.data.choices[0].message.content;
    res.json({ quiz });
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Failed to create quiz." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
