let questions = [];
let current = 0;

const opts = document.getElementById("options");
const result = document.getElementById("result");
const nextBtn = document.getElementById("NextButton");

let totalQuestions = 0;
let correctFirstTry = 0;
let firstTry = true;

fetch('../data/guess_capital_data.json')
  .then(res => res.json())
  .then(data => {
    questions = shuffleArray(data);
    loadQuestion();
  });


function shuffleArray(array) 
{
  return array.sort(() => Math.random() - 0.5);
}

function updateScore() 
{
  document.getElementById("score-ratio").textContent = `${correctFirstTry} / ${totalQuestions}`;
}

function loadQuestion() 
{
  if (!questions.length || current >= questions.length) {
    result.textContent = "Quiz finished!";
    opts.innerHTML = "";
    document.getElementById("question-text").textContent = ""; // Clear question
    nextBtn.disabled = true;
    return;
  }

  const q = questions[current];
  result.textContent = "";
  opts.innerHTML = "";
  nextBtn.disabled = true;

  // ✅ Show question text at the top
  document.getElementById("question-text").textContent = q.question;

  q.options.forEach(option => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.onclick = () => {
      if (option === q.answer) {
        if (firstTry) correctFirstTry++;
        btn.classList.add("correct");
        result.textContent = "✅ Correct!";
        Array.from(opts.children).forEach(b => b.disabled = true);
        nextBtn.disabled = false;
        updateScore();
      } else {
        btn.classList.add("incorrect");
        btn.disabled = true;
        result.textContent = "❌ Wrong! Try again.";
        firstTry = false;
      }
    };
    opts.appendChild(btn);
  });

  totalQuestions++;
  firstTry = true;
  updateScore();
}




function nextQuestion() 
{
  current++;
  loadQuestion();
}


document.getElementById("FinishButton").onclick = function () {
  const confirmQuit = confirm("Are you sure you want to quit the quiz?");
  if (confirmQuit) {
    // Save score to session storage
    sessionStorage.setItem("score", `${correctFirstTry}`);
    sessionStorage.setItem("total", `${totalQuestions}`);
    sessionStorage.setItem("quiz", "Capital City Quiz"); // Or change based on quiz type

    // Redirect to results page
    window.location.href = "../result.html";
  }
};