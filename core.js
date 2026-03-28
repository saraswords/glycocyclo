let currentData = [];
let currentMode = "";
let currentPathway = "";

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

// =======================
// DATA
// =======================

const data = {
  glycolysis: [
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
  ],

  gluconeogenesis: [
    { product: "Pyruvate (2)", enzyme: "" },
    { product: "Oxaloacetate (2)", enzyme: "Pyruvate carboxylase" },
    { product: "Phosphoenolpyruvate (2)", enzyme: "PEP carboxykinase" },
    { product: "2-phosphoglycerate (2)", enzyme: "Enolase" },
    { product: "3-phosphoglycerate (2)", enzyme: "Phosphoglycerate mutase" },
    { product: "1,3-bisphosphoglycerate (2)", enzyme: "Phosphoglycerate kinase" },
    { product: "G3P (2)", enzyme: "G3P dehydrogenase" },
    { product: "Fructose-1,6-bisphosphate", enzyme: "Aldolase" },
    { product: "Fructose-6-phosphate", enzyme: "Fructose-1,6-bisphosphatase" },
    { product: "Glucose-6-phosphate", enzyme: "Phosphoglucose isomerase" },
    { product: "Glucose", enzyme: "Glucose-6-phosphatase" }
  ],

  cac: [
    { product: "Citrate", enzyme: "Citrate synthase" },
    { product: "Isocitrate", enzyme: "Aconitase" },
    { product: "α-Ketoglutarate", enzyme: "Isocitrate dehydrogenase" },
    { product: "Succinyl-CoA", enzyme: "α-Ketoglutarate dehydrogenase" },
    { product: "Succinate", enzyme: "Succinyl-CoA synthetase" },
    { product: "Fumarate", enzyme: "Succinate dehydrogenase" },
    { product: "Malate", enzyme: "Fumarase" },
    { product: "Oxaloacetate", enzyme: "Malate dehydrogenase" }
  ]
};

function getData(){
  return currentData;
}

// =======================
// NAV
// =======================

function startGame(pathway, mode){
  currentPathway = pathway;
  currentMode = mode;
  currentData = data[pathway];

  document.getElementById("home").style.display = "none";
  document.getElementById("game").style.display = "block";

  // ✅ FIX: always hide enzyme info when starting
  document.getElementById("enzyme-info").classList.add("hidden");

  if(mode === "enzymes"){
    startEnzymeGame();
  } else {
    startProductGame();
  }
}

function goHome(){
  document.getElementById("home").style.display = "block";
  document.getElementById("game").style.display = "none";

  // ✅ FIX: hide enzyme info on exit
  document.getElementById("enzyme-info").classList.add("hidden");
}

// =======================
// DRAG / TAP
// =======================

function setupChoice(el, value){
  el.draggable = true;
  el.ondragstart = () => draggedItem = value;

  el.onclick = () => {
    selectedItem = value;
    draggedItem = value;

    document.querySelectorAll(".choice")
      .forEach(c => c.classList.remove("selected"));

    el.classList.add("selected");
  };
}

// =======================
// ZONES
// =======================

function createZone(step, pos, type){
  const zone = document.createElement("div");
  zone.className = "zone";

  zone.style.left = (pos.x * 100) + "%";
  zone.style.top = (pos.y * 100) + "%";

  zone.dataset.answer = type === "enzyme" ? step.enzyme : step.product;

  zone.ondragover = e => e.preventDefault();
  zone.ondrop = () => handleDrop(step, zone, type);
  zone.onclick = () => handleDrop(step, zone, type);

  document.getElementById("overlay").appendChild(zone);
}

// 🔥 REQUIRED FOR DHAP/G3P
function createSplitZone(x, y, label){
  const zone = document.createElement("div");
  zone.className = "zone split-zone";

  zone.style.left = (x * 100) + "%";
  zone.style.top = (y * 100) + "%";

  zone.dataset.answer = label;

  zone.ondragover = e => e.preventDefault();

  zone.ondrop = () => {
    const item = draggedItem || selectedItem;
    if(item === label && !zone.innerText){
      zone.innerText = item;
      zone.classList.add("correct");

      correctSound.currentTime = 0;
      correctSound.play();
    } else {
      wrongSound.currentTime = 0;
      wrongSound.play();
    }
  };

  zone.onclick = () => {
    const item = draggedItem || selectedItem;
    if(item === label && !zone.innerText){
      zone.innerText = item;
      zone.classList.add("correct");

      correctSound.currentTime = 0;
      correctSound.play();
    } else {
      wrongSound.currentTime = 0;
      wrongSound.play();
    }
  };

  document.getElementById("overlay").appendChild(zone);
}

// =======================
// DROP LOGIC
// =======================

function handleDrop(step, zone, type){
  const item = draggedItem || selectedItem;
  if(!item || zone.innerText) return;

  const expected = zone.dataset.answer;
  const clean = str => str.replace(" (2)", "");

  let correct = false;

  if(type === "product"){
    correct = clean(item) === clean(expected);
  }

  if(type === "enzyme"){
    correct = item === expected;
  }

  if(correct){
    zone.innerText = item;
    zone.classList.add("correct");

    correctSound.currentTime = 0;
    correctSound.play();

    if(type==="enzyme") showEnzymeInfo(item);

  } else {
    wrongSound.currentTime = 0;
    wrongSound.play();
  }
}

// =======================
// ENZYME INFO
// =======================

function showEnzymeInfo(enzyme) {
  const enzymeInfo = {
    "Hexokinase": "Adds a phosphate to glucose using ATP.",
    "Phosphoglucose isomerase": "Rearranges glucose-6-phosphate.",
    "PFK-1": "Key regulatory step adding second phosphate.",
    "Aldolase": "Splits or combines sugars.",
    "G3P dehydrogenase": "Generates NADH.",
    "Phosphoglycerate kinase": "Generates ATP.",
    "Phosphoglycerate mutase": "Moves phosphate.",
    "Enolase": "Removes water.",
    "Pyruvate kinase": "Produces pyruvate + ATP.",

    "Pyruvate carboxylase": "Adds CO₂ to pyruvate.",
    "PEP carboxykinase": "Uses GTP to form PEP.",
    "Fructose-1,6-bisphosphatase": "Bypasses PFK-1.",
    "Glucose-6-phosphatase": "Releases glucose.",

    "Citrate synthase": "Combines acetyl-CoA with oxaloacetate.",
    "Aconitase": "Rearranges citrate to isocitrate.",
    "Isocitrate dehydrogenase": "Produces NADH and CO₂.",
    "α-Ketoglutarate dehydrogenase": "Produces NADH and CO₂.",
    "Succinyl-CoA synthetase": "Generates GTP.",
    "Succinate dehydrogenase": "Produces FADH₂.",
    "Fumarase": "Adds water.",
    "Malate dehydrogenase": "Produces NADH."
  };

  document.getElementById("enzyme-title").innerText = enzyme;
  document.getElementById("enzyme-desc").innerText = enzymeInfo[enzyme] || "";
  document.getElementById("enzyme-info").classList.remove("hidden");
}

// =======================
// UTIL
// =======================

function shuffleArray(arr){
  for(let i = arr.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
