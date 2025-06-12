let quiz = [];
let currentIndex = 0;

document.getElementById('startBtn').addEventListener('click', async () => {
  const wordsText = document.getElementById('wordInput').value.trim();
  if (!wordsText) {
    alert('単語を入力してください');
    return;
  }
  const words = wordsText.split(',').map(w => w.trim()).filter(w => w.length > 0);

  // API呼び出し
  const res = await fetch('/api/generateQuiz', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ words }),
  });
  const data = await res.json();

  if (data.error) {
    alert('クイズの生成に失敗しました: ' + data.error);
    return;
  }

  quiz = data.quiz;
  currentIndex = 0;
  if (quiz.length === 0) {
    alert('問題がありません');
    return;
  }

  document.getElementById('quizSection').style.display = 'block';
  showQuestion();
});

document.getElementById('submitAnswer').addEventListener('click', () => {
  const userAnswer = document.getElementById('answerInput').value.trim();
  const correctAnswer = quiz[currentIndex].answer;

  const resultDiv = document.getElementById('result');
  if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
    resultDiv.textContent = '正解！';
  } else {
    resultDiv.textContent = `不正解！ 正しい答えは「${correctAnswer}」です。`;
  }

  currentIndex++;
  if (currentIndex < quiz.length) {
    showQuestion();
  } else {
    alert('全問終了しました。新しい単語で再チャレンジしてください。');
    document.getElementById('quizSection').style.display = 'none';
    quiz = [];
  }
  document.getElementById('answerInput').value = '';
});

function showQuestion() {
  document.getElementById('question').textContent = quiz[currentIndex].question;
  document.getElementById('result').textContent = '';
}
