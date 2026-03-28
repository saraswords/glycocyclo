function startEnzymeGame(){
  const data = getData();

  document.getElementById("game-container").classList.remove("products");
  document.getElementById("home").style.display = "none";
  document.getElementById("game").style.display = "block";

  document.getElementById("background").src =
    currentPathway === "glycolysis"
      ? "assets/glycolysis_enzyme_blank.png"
      : currentPathway === "gluconeogenesis"
      ? "assets/gluconeogenesis_enzyme_blank.png"
      : "assets/cac_enzyme_blank.png";

  renderEnzymeZones(data);
  renderEnzymeChoices(data);
}

function renderEnzymeZones(data){
  const overlay = document.getElementById("overlay");
  overlay.innerHTML = "";

  // ✅ CAC (FIXED — no duplicate overlay declaration)
  if(currentPathway === "cac"){
    const positions = [
      {x:0.40, y:0.22}, // Citrate synthase
      {x:0.63, y:0.27}, // Aconitase
      {x:0.72, y:0.52}, // Isocitrate dehydrogenase
      {x:0.63, y:0.73}, // α-KG dehydrogenase
      {x:0.47, y:0.80}, // Succinyl-CoA synthetase
      {x:0.30, y:0.71}, // Succinate dehydrogenase
      {x:0.24, y:0.54}, // Fumarase
      {x:0.27, y:0.37}  // Malate dehydrogenase
    ];

    data.forEach((step, i) => {
      createZone(step, positions[i], "enzyme");
    });

    return;
  }

  // DEFAULT (unchanged)
  const positionsDefault = [
    0.085, 0.175, 0.27, 0.355, 0.44,
    0.525, 0.63, 0.725, 0.815
  ];

  const seen = new Set();
  let index = 0;

  data.forEach(step => {
    if(!step.enzyme || seen.has(step.enzyme)) return;

    seen.add(step.enzyme);

    createZone(step, {
      x: 0.80,
      y: positionsDefault[index]
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
