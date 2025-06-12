async function generateQuiz() {
  const wordsText = document.getElementById("words").value;
  const words = wordsText
    .split(",")
    .map(w => w.trim())
    .filter(w => w.length > 0);

  if (words.length === 0) {
    alert("英単語を入力してください。");
    return;
  }

  try {
    const response = await fetch("/quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ words })
    });

    if (response.ok) {
      const data = await response.json();
      document.getElementById("quizOutput").textContent = data.quiz;
    } else {
      const errText = await response.text();
      document.getElementById("quizOutput").textContent = "クイズの生成に失敗しました。\n" + errText;
    }
  } catch (error) {
    document.getElementById("quizOutput").textContent = "サーバーへの接続に失敗しました。\n" + error;
  }
}
