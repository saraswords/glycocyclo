function startProductGame(){
  const data = getData();
  
  document.getElementById("game-container").classList.add("products");
  document.getElementById("home").style.display = "none";
  document.getElementById("game").style.display = "block";

  document.getElementById("background").src =
    "assets/glycolysis_product_blank.png";

  renderProductZones(data);
  renderProductChoices(data);
}

function renderProductZones(data){
  const overlay = document.getElementById("overlay");
  overlay.innerHTML = "";

  // main vertical pathway
  createZone(data[0], {x:0.42, y:0.05}, "product");  // Glucose
  createZone(data[1], {x:0.42, y:0.14}, "product");
  createZone(data[2], {x:0.42, y:0.23}, "product");
  createZone(data[3], {x:0.42, y:0.32}, "product");

  createSplitZone(0.36, 0.39, "DHAP");
  createSplitZone(0.495, 0.39, "G3P");

  // continue pathway (AFTER split → use G3P line)
  createZone(data[6], {x:0.42, y:0.498}, "product");
  createZone(data[7], {x:0.42, y:0.59}, "product");
  createZone(data[8], {x:0.42, y:0.68}, "product");
  createZone(data[9], {x:0.42, y:0.77}, "product");
  createZone(data[10], {x:0.42, y:0.87}, "product");
}

function renderProductChoices(data){
  const c = document.getElementById("choices");
  c.innerHTML = "";

  // ✅ REMOVE .slice(1) so glucose appears
  shuffleArray(
    data.map(d => d.product)
  ).forEach(item=>{
      const div = document.createElement("div");
      div.className = "choice";
      div.innerText = item;

      setupChoice(div, item);
      c.appendChild(div);
    });
}