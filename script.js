let currentData = [];
let currentMode = "";

let score = 0;
let atp = 0;
let nadh = 0;
let mistakes = 0;

const correctSound = new Audio("assets/correct.mp3");
const wrongSound = new Audio("assets/wrong.mp3");

let draggedItem = null;
let selectedItem = null;

// NAVIGATION
function goHome() {
  document.getElementById("home").style.display = "block";
  document.getElementById("game").style.display = "none";
}

// DATA
const data = {
  glycolysis: [
    {
      product: "Glucose",
      enzyme: "",
      productPos: { x: 0.50, y: 0.12 }
    },
    {
      product: "Glucose-6-phosphate",
      enzyme: "Hexokinase",
      productPos: { x: 0.50, y: 0.20 },
      enzymePos: { x: 0.85, y: 0.18 }
    },
    {
      product: "Fructose-6-phosphate",
      enzyme: "Phosphoglucose isomerase",
      productPos: { x: 0.50, y: 0.28 },
      enzymePos: { x: 0.85, y: 0.26 }
    },
    {
      product: "Fructose-1,6-bisphosphate",
      enzyme: "PFK-1",
      productPos: { x: 0.50, y: 0.36 },
      enzymePos: { x: 0.85, y: 0.34 }
    },
    {
      product: "DHAP",
      enzyme: "Aldolase",
      productPos: { x: 0.44, y: 0.46 },
      enzymePos: { x: 0.85, y: 0.43 }
    },
    {
      product: "G3P",
      enzyme: "Aldolase",
      productPos: { x: 0.56, y: 0.46 }
    },
    {
      product: "1,3-bisphosphoglycerate",
      enzyme: "G3P dehydrogenase",
      productPos: { x: 0.50, y: 0.56 },
      enzymePos: { x: 0.85, y: 0.52 }
    },
    {
      product: "3-phosphoglycerate",
      enzyme: "Phosphoglycerate kinase",
      productPos: { x: 0.50, y: 0.64 },
      enzymePos: { x: 0.85, y: 0.60 }
    },
    {
      product: "2-phosphoglycerate",
      enzyme: "Phosphoglycerate mutase",
      productPos: { x: 0.50, y: 0.72 },
      enzymePos: { x: 0.85, y: 0.68 }
    },
    {
      product: "Phosphoenolpyruvate",
      enzyme: "Enolase",
      productPos: { x: 0.50, y: 0.80 },
      enzymePos: { x: 0.85, y: 0.78 }
    },
    {
      product: "Pyruvate",
      enzyme: "Pyruvate kinase",
      productPos: { x: 0.50, y: 0.88 },
      enzymePos: { x: 0.85, y: 0.88 }
    }
  ]
};

function showComingSoon(button, originalText) {
  button.innerText = "Coming soon ✨";
}

function resetButton(button, originalText) {
  button.innerText = originalText;
}

// START GAME
function startGame(pathway, mode) {
  currentMode = mode;
  currentData = data[pathway];

  document.getElementById("home").style.display = "none";
  document.getElementById("game").style.display = "block";

  document.getElementById("mode-title").innerText =
    mode.charAt(0).toUpperCase() + mode.slice(1) + " Mode";

  document.getElementById("background").src = "assets/glycolysis_enzyme_blank.png";

  score = 0;
  atp = 0;
  nadh = 0;
  mistakes = 0;

  updateStats();
  renderZones();
  renderChoices();
}

// STATS
function updateStats() {
  document.getElementById("score").innerText = score;
  document.getElementById("atp").innerText = atp;
  document.getElementById("nadh").innerText = nadh;
}

// ZONES
function renderZones() {
  const overlay = document.getElementById("overlay");
  overlay.innerHTML = "";

  currentData.forEach((step) => {
    let pos;

    if (currentMode === "products") pos = step.productPos;
    else if (currentMode === "enzymes") pos = step.enzymePos;
    else pos = step.productPos;

    if (!pos) return;

    const div = document.createElement("div");
    div.className = "zone";

    div.style.left = (pos.x * 100) + "%";
    div.style.top = (pos.y * 100) + "%";

    // DRAG SUPPORT
    div.ondragover = (e) => e.preventDefault();

    div.ondrop = (e) => {
      e.preventDefault();
      handleDrop(step, div);
    };

    // MOBILE TAP SUPPORT
    div.onclick = () => {
      handleDrop(step, div);
    };

    overlay.appendChild(div);
  });
}

// CHOICES
function renderChoices() {
  const container = document.getElementById("choices");
  container.innerHTML = "";

  let items =
    currentMode === "products"
      ? currentData.map(d => d.product)
      : currentMode === "enzymes"
      ? currentData.map(d => d.enzyme)
      : currentData.flatMap(d => [d.product, d.enzyme]);

  items = items.filter(item => item !== "");
  items.sort(() => Math.random() - 0.5);

  items.forEach(item => {
    const div = document.createElement("div");
    div.className = "choice";
    div.innerText = item;

    div.draggable = true;

    // DESKTOP DRAG
    div.ondragstart = () => {
      draggedItem = item;
    };

    // MOBILE TAP
    div.onclick = () => {
      selectedItem = item;
      draggedItem = item;

      document.querySelectorAll(".choice").forEach(c => c.style.background = "white");
      div.style.background = "#eee";
    };

    container.appendChild(div);
  });
}

// DROP LOGIC
function handleDrop(step, zone) {
  if ((!draggedItem && !selectedItem) || zone.innerText !== "") return;

  const item = draggedItem || selectedItem;

  let correct =
    (currentMode === "products" && item === step.product) ||
    (currentMode === "enzymes" && item === step.enzyme) ||
    (currentMode === "hardcore" &&
      (item === step.product || item === step.enzyme));

  if (correct) {
    zone.classList.add("correct");
    zone.innerText = item;

    correctSound.play();
    score++;

    if (item.includes("bisphosphate")) atp -= 1;
    if (item === "Pyruvate") {
      atp += 2;
      nadh += 2;
    }

    removeChoice(item);
  } else {
    zone.classList.add("wrong");
    wrongSound.play();
    mistakes++;
  }

  updateStats();

  draggedItem = null;
  selectedItem = null;

  checkFinished();
}

// REMOVE USED CHOICE
function removeChoice(item) {
  document.querySelectorAll(".choice").forEach(c => {
    if (c.innerText === item) c.remove();
  });
}

// FINISH CHECK
function checkFinished() {
  if (document.querySelectorAll(".choice").length === 0) {
    alert(mistakes === 0 ? "Perfect run!" : `Score: ${score} | Mistakes: ${mistakes}`);
  }
}