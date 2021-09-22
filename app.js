const xmlns = "http://www.w3.org/2000/svg";
const menuBlock = document.querySelector(".menu");
const menuItems = menuBlock.querySelectorAll(".menu__item"); // Menu buttons
const main = document.querySelector("main");
const mapBody = main.querySelector(".map__body");
const mapImage = main.querySelector(".map__image");
const options = document.querySelector(".options");
const sidebar = document.querySelector(".sidebar");

const map = {
  zoom: 100,
  step: 5,
  isCoordsCalculated: false,
  isMarked: false,
  isGridAttach: false,
  curentX: 0,
  currentY: 0,
};

mapBody.addEventListener("mousewheel", (e) => {
  if (e.ctrlKey) {
    e.preventDefault();
  }
});

mapBody.onmouseenter = () => {
  mapBody.querySelector(".map__body-grid-attach").style.visibility = "visible";
};

mapBody.onmouseleave = () => {
  mapBody.querySelector(".map__body-grid-attach").style.visibility = "hidden";
};

mapBody.onmousemove = (e) => {
  const xb = document.querySelector(".xb");
  const yb = document.querySelector(".yb");

  xb.innerHTML = `X: ${e.layerX}`;
  yb.innerHTML = `Y: ${e.layerY}`;

  if (map.isGridAttach) {
    map.currentX = Math.round(e.layerX / map.step) * map.step;
    map.currentY = Math.round(e.layerY / map.step) * map.step;
  } else {
    map.currentX = e.layerX;
    map.currentY = e.layerY;
  }

  const point = mapBody.querySelector(".map__body-grid-attach");

  point.setAttribute("cx", map.currentX);
  point.setAttribute("cy", map.currentY);

  const xc = document.querySelector(".xc");
  const yc = document.querySelector(".yc");

  xc.innerHTML = `Xc: ${map.currentX}`;
  yc.innerHTML = `Yc: ${map.currentY}`;
};

const optionsGrid = options.querySelector("#options__item-grid");

optionsGrid.onchange = (e) => {
  const mapBodyGrid = main.querySelector(".map__body-grid");
  const grid = mapBodyGrid.querySelector("rect");

  if (e.target.checked) {
    grid.style.visibility = "visible";
  } else {
    grid.style.visibility = "hidden";
  }
};

const optionsMapImage = options.querySelector("#options__item-map-image");

optionsMapImage.onchange = (e) => {
  if (e.target.checked) {
    mapImage.classList.remove("hide");
  } else {
    mapImage.classList.add("hide");
  }
};

const optionsGridAttach = options.querySelector("#options__item-grid-attach");

optionsGridAttach.onchange = (e) => {
  map.isGridAttach = e.target.checked;
};
