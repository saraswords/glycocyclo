window.startGame = function(pathway, mode){
  document.getElementById("score-popup").classList.add("hidden");

  // ✅ RESET ENZYME INFO
  const box = document.getElementById("enzyme-info");
  box.classList.add("hidden");
  document.getElementById("enzyme-title").innerText = "";
  document.getElementById("enzyme-desc").innerText = "";

  if(mode === "enzymes"){
    startEnzymeGame();
  } else {
    startProductGame();
  }
};

function startEnzymeGame(){
  const data = getData();

  document.getElementById("game-container").classList.remove("products");
  document.getElementById("home").style.display = "none";
  document.getElementById("game").style.display = "block";

  document.getElementById("background").src =
    "assets/glycolysis_enzyme_blank.png";

  renderEnzymeZones(data);
  renderEnzymeChoices(data);
}

function renderEnzymeZones(data){
  const overlay = document.getElementById("overlay");
  overlay.innerHTML = "";

  const positions = [
    0.085,
    0.175,
    0.27,
    0.355,
    0.44,
    0.525,
    0.63,
    0.725,
    0.815
  ];

  const seen = new Set();

  let index = 0;

  data.forEach(step => {
    if(!step.enzyme || seen.has(step.enzyme)) return;

    seen.add(step.enzyme);

    createZone(step, {
      x: 0.80,
      y: positions[index]
    }, "enzyme");

    index++;
  });
}

function renderEnzymeChoices(data){
  const c = document.getElementById("choices");
  c.innerHTML = "";

  const uniqueEnzymes = [...new Set(
    data.map(d => d.enzyme).filter(Boolean)
  )];

  shuffleArray(uniqueEnzymes).forEach(item=>{
    const div = document.createElement("div");
    div.className = "choice";
    div.innerText = item;

    setupChoice(div, item);
    c.appendChild(div);
  });
}