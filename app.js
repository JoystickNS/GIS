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
  mPerPixel: 0,
  calcCoords: {
    markCount: 0,
    savedCount: 0,
    coords: [
      {
        isSaved: false,
        mark: null,
        domBlock: null,
        layerX: 0,
        layerY: 0,
        realX: 0,
        realY: 0,
      },
      {
        isSaved: false,
        mark: null,
        domBlock: null,
        layerX: 0,
        layerY: 0,
        realX: 0,
        realY: 0,
      },
    ],
  },
  zeroRealCoord: {
    x: 0,
    y: 0,
  },
  isCoordsCalculated: false,
  isMarked: false,
  isGridAttach: false,
  layerX: 0,
  layerY: 0,
  realX: 0,
  realY: 0,
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
    map.layerX = Math.round(e.layerX / map.step) * map.step;
    map.layerY = Math.round(e.layerY / map.step) * map.step;
  } else {
    map.layerX = e.layerX;
    map.layerY = e.layerY;
  }

  const point = mapBody.querySelector(".map__body-grid-attach");

  point.setAttribute("cx", map.layerX);
  point.setAttribute("cy", map.layerY);

  const xc = document.querySelector(".xc");
  const yc = document.querySelector(".yc");

  xc.innerHTML = `Xc: ${map.layerX}`;
  yc.innerHTML = `Yc: ${map.layerY}`;

  const realX = document.querySelector(".realX");
  const realY = document.querySelector(".realY");

  if (map.isCoordsCalculated) {
    realX.innerHTML = `RealX: ${
      map.zeroRealCoord.x + e.layerX * map.mPerPixel
    }`;
    realY.innerHTML = `RealY: ${
      map.zeroRealCoord.y + e.layerY * map.mPerPixel
    }`;
  }
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
  mapImage.hidden = !e.target.checked;
};

const optionsGridAttach = options.querySelector("#options__item-grid-attach");

optionsGridAttach.onchange = (e) => {
  map.isGridAttach = e.target.checked;
};
