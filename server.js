const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const port = process.env.PORT || 10000;

// ミドルウェア設定
app.use(cors());
app.use(express.json());

// ✅ index.html を同じ階層から返す（public フォルダなし対応）
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// 例：OpenAI API 呼び出しルート（必要に応じて）
app.post("/api/ask", async (req, res) => {
  // ... OpenAI APIへのリクエスト処理 ...
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
