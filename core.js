let correctCount = 0;
let totalCount = 0;

let draggedItem = null;
let selectedItem = null;

const correctSound = new Audio("assets/correct.mp3");
const wrongSound = new Audio("assets/wrong.mp3");

// unlock audio
document.addEventListener("click", () => {
  correctSound.play().catch(()=>{});
  wrongSound.play().catch(()=>{});
  correctSound.pause();
  wrongSound.pause();
});

function setupChoice(el, value){
  el.draggable = true;
  el.ondragstart = () => draggedItem = value;
  el.onclick = () => {
    selectedItem = value;
    draggedItem = value;
  };
}

function createZone(step, pos, type){
  const overlay = document.getElementById("overlay");

  const div = document.createElement("div");
  div.className = "zone";

  div.style.left = pos.x * 100 + "%";
  div.style.top = pos.y * 100 + "%";

  div.onclick = () => handleDrop(step, div, type);
  div.ondrop = (e) => {
    e.preventDefault();
    handleDrop(step, div, type);
  };
  div.ondragover = (e) => e.preventDefault();

  overlay.appendChild(div);
}

function createSplitZone(x, y, expected){
  const overlay = document.getElementById("overlay");

  const div = document.createElement("div");
  div.className = "zone split-zone";

  div.style.left = x * 100 + "%";
  div.style.top = y * 100 + "%";

  div.onclick = () => handleSplit(div, expected);
  div.ondrop = (e) => {
    e.preventDefault();
    handleSplit(div, expected);
  };
  div.ondragover = (e) => e.preventDefault();

  overlay.appendChild(div);
}

function handleDrop(step, zone, type){
  const item = draggedItem || selectedItem;
  if(!item || zone.innerText) return;

  totalCount++;

  let correct = false;

  if (type === "product") {
    const cleanItem = item.replace(" (2)", "");
    const cleanStep = step.product.replace(" (2)", "");
    correct = cleanItem === cleanStep;
  }

  if (type === "enzyme") {
    correct = item === step.enzyme;
  }

  if(correct){
    correctCount++; // 🔥 ADD THIS

    zone.innerText = item;
    zone.classList.add("correct");

    correctSound.currentTime = 0;
    correctSound.play();

    if(type==="enzyme") showEnzymeInfo(step.enzyme);

  } else {
    wrongSound.currentTime = 0;
    wrongSound.play();
  }

  checkGameEnd(); // 🔥 ADD THIS
}

function handleSplit(zone, expected){
  const item = (draggedItem || selectedItem || "").replace(" (2)", "");
  if(!item || zone.innerText) return;

  if(item === expected){
    zone.innerText = item;
    zone.classList.add("correct");

    correctSound.currentTime = 0;
    correctSound.play();
  } else {
    wrongSound.currentTime = 0;
    wrongSound.play();
  }
}

function getData(){
  return [
    { product: "Glucose", enzyme: "" },
    { product: "Glucose-6-phosphate", enzyme: "Hexokinase" },
    { product: "Fructose-6-phosphate", enzyme: "Phosphoglucose isomerase" },
    { product: "Fructose-1,6-bisphosphate", enzyme: "PFK-1" },
    { product: "DHAP", enzyme: "Aldolase" },
    { product: "G3P (2)", enzyme: "Aldolase" },
    { product: "1,3-bisphosphoglycerate (2)", enzyme: "G3P dehydrogenase" },
    { product: "3-phosphoglycerate (2)", enzyme: "Phosphoglycerate kinase" },
    { product: "2-phosphoglycerate (2)", enzyme: "Phosphoglycerate mutase" },
    { product: "Phosphoenolpyruvate (2)", enzyme: "Enolase" },
    { product: "Pyruvate (2)", enzyme: "Pyruvate kinase" }
  ];
}

function goHome(){
  document.getElementById("home").style.display = "block";
  document.getElementById("game").style.display = "none";

  // ✅ HIDE SCORE POPUP
  document.getElementById("score-popup").classList.add("hidden");
}

// 🔥 enzyme info popup (RESTORED)
function showEnzymeInfo(enzyme) {
  const box = document.getElementById("enzyme-info");

  const enzymeInfo = {
    "Hexokinase": "Adds a phosphate to glucose using ATP.",
    "Phosphoglucose isomerase": "Rearranges glucose-6-phosphate.",
    "PFK-1": "Key regulatory step adding second phosphate.",
    "Aldolase": "Splits into DHAP and G3P.",
    "G3P dehydrogenase": "Generates NADH.",
    "Phosphoglycerate kinase": "Generates ATP.",
    "Phosphoglycerate mutase": "Moves phosphate.",
    "Enolase": "Removes water.",
    "Pyruvate kinase": "Produces pyruvate + ATP."
  };

  const rateLimiting = ["Hexokinase","PFK-1","Pyruvate kinase"];

  document.getElementById("enzyme-title").innerText = enzyme;
  document.getElementById("enzyme-desc").innerHTML =
    enzymeInfo[enzyme] +
    (rateLimiting.includes(enzyme)
      ? `<div class="rate-limit">Rate Limiting Step!</div>`
      : "");

  box.classList.remove("hidden");
}

function checkGameEnd(){
  const zones = document.querySelectorAll(".zone");

  const filled = [...zones].filter(z => z.innerText !== "").length;

  if(filled === zones.length){
    showScorePopup();
  }
}

function showScorePopup(){
  const accuracy = Math.round((correctCount / totalCount) * 100);

  document.getElementById("result-title").innerText =
    accuracy === 100 ? "Perfect!" : "Nice try";

  document.getElementById("score-text").innerText =
    `Correct: ${correctCount} / ${totalCount}`;

  document.getElementById("accuracy-text").innerText =
    `Accuracy: ${accuracy}%`;

  document.getElementById("score-popup").classList.remove("hidden");
}

function replayGame(){
  correctCount = 0;
  totalCount = 0;

  document.getElementById("score-popup").classList.add("hidden");

  startGame("glycolysis", currentMode);
}

function shuffleArray(arr){
  for(let i = arr.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}