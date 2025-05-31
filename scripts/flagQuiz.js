let questions = [];
let current = 0;
const img = document.getElementById("map-image");
const opts = document.getElementById("options");
const result = document.getElementById("result");
const nextBtn = document.getElementById("NextButton");

let totalQuestions = 0;
let correctFirstTry = 0;
let firstTry = true;

fetch('../data/map-quiz.json')
  .then(res => res.json())
  .then(data => {
    questions = shuffleArray(data);
    loadQuestion();
  });

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}
function updateScore() {
  document.getElementById("score-ratio").textContent = `${correctFirstTry} / ${totalQuestions}`;
}
function loadQuestion() {
  if (!questions.length || current >= questions.length) {
    result.textContent = "Quiz finished!";
    opts.innerHTML = "";
    img.style.display = "none";
    nextBtn.disabled = true; // Hide or disable Next at end
    return;
  }

  const q = questions[current];
  result.textContent = "";
  img.src = q.image;
  opts.innerHTML = "";

  nextBtn.disabled = true; // Disable Next button at start

 

  q.options.forEach(option => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.onclick = () => {
  if (option === q.answer) {
    if (firstTry) {
      correctFirstTry++;
    }
    btn.classList.add("correct");
    result.textContent = "✅ Correct!";
    Array.from(opts.children).forEach(b => b.disabled = true);
    nextBtn.disabled = false; // Enable Next button only after correct
    updateScore();
  } else {
    btn.classList.add("incorrect");
    btn.disabled = true;
    result.textContent = "❌ Wrong! Try again.";
    firstTry = false; // Mark that first try failed
  }
};
    opts.appendChild(btn);
  });
  totalQuestions++;
  firstTry = true;
  updateScore();
}



function nextQuestion() {
  current++;
  loadQuestion();
}


document.getElementById("FinishButton").onclick = function () {
  const confirmQuit = confirm("Are you sure you want to quit the quiz?");
  if (confirmQuit) {
    // Save score to session storage
    sessionStorage.setItem("score", `${correctFirstTry}`);
    sessionStorage.setItem("total", `${totalQuestions}`);
    sessionStorage.setItem("quiz", "Flag quiz"); // Or change based on quiz type

    // Redirect to results page
    window.location.href = "../result.html";
  }
};