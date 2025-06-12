let wordList = [];
let currentWord = '';
let remainingWords = [];

async function startTest() {
  const input = document.getElementById('wordInput').value;
  wordList = input.split(',').map(w => w.trim()).filter(w => w.length > 0);
  if (wordList.length === 0) return alert("英単語を入力してください");

  remainingWords = [...wordList];
  document.getElementById('step1').style.display = 'none';
  nextQuestion();
}

function nextQuestion() {
  if (remainingWords.length === 0) {
    alert("テスト終了！最初からやり直してください。");
    location.reload();
    return;
  }

  currentWord = remainingWords.splice(Math.floor(Math.random() * remainingWords.length), 1)[0];
  document.getElementById('question').textContent = `「${currentWord}」の意味は？`;
  document.getElementById('answerInput').value = '';
  document.getElementById('step2').style.display = 'block';
  document.getElementById('result').style.display = 'none';
}

async function submitAnswer() {
  const userAnswer = document.getElementById('answerInput').value;

  const res = await fetch('/check', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ word: currentWord, answer: userAnswer })
  });

  const data = await res.json();
  document.getElementById('feedback').textContent = data.feedback;
  document.getElementById('step2').style.display = 'none';
  document.getElementById('result').style.display = 'block';
}
