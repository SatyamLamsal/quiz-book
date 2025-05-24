let questions = [];
let current = 0;
const img = document.getElementById("map-image");
const opts = document.getElementById("options");
const result = document.getElementById("result");

fetch('../data/map-quiz.json')
  .then(res => res.json())
  .then(data => {
    questions = shuffleArray(data);
    loadQuestion();
  });

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

function loadQuestion() {
  if (!questions.length || current >= questions.length) {
    result.textContent = "Quiz finished!";
    opts.innerHTML = "";
    img.style.display = "none";
    return;
  }

  const q = questions[current];
  result.textContent = "";
  img.src = q.image;
  opts.innerHTML = "";


  q.options.forEach(option => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.onclick = () => {
      result.textContent = option === q.answer ? "✅ Correct!" : "❌ Wrong!";
    };
    opts.appendChild(btn);
  });
}



function nextQuestion() {
  current++;
  loadQuestion();
}