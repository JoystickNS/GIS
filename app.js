const xmlns = "http://www.w3.org/2000/svg";
const menuBlock = document.querySelector(".menu");
const menuItems = menuBlock.querySelectorAll(".menu__item"); // Menu buttons
const main = document.querySelector("main");
const mapWrapper = main.querySelector(".map__wrapper");
const mapBody = main.querySelector(".map__body");
const mapImage = main.querySelector(".map__image");
const options = document.querySelector(".options");
const sidebar = document.querySelector(".sidebar");

const map = {
  step: 10,
  mPerPixel: null,
  isFree: true,
  calcCoords: {
    markCount: 0,
    savedCount: 0,
    markCoords: [
      {
        isSaved: false,
        mark: null,
        domBlock: null,
        layerX: 10,
        layerY: 10,
        realX: 10,
        realY: 10,
      },
      {
        isSaved: false,
        mark: null,
        domBlock: null,
        layerX: 20,
        layerY: 20,
        realX: 20,
        realY: 20,
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
  //mapBody.querySelector(".map__body-grid-attach").style.visibility = "visible";
};

mapBody.onmouseleave = () => {
  //mapBody.querySelector(".map__body-grid-attach").style.visibility = "hidden";
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

  // const point = mapBody.querySelector(".map__body-grid-attach");

  // point.setAttribute("cx", map.layerX);
  // point.setAttribute("cy", map.layerY);

  // const xc = document.querySelector(".xc");
  // const yc = document.querySelector(".yc");

  // xc.innerHTML = `Xc: ${map.layerX}`;
  // yc.innerHTML = `Yc: ${map.layerY}`;
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

// Срабатывает после загрузки картинки карты
main.afterImageLoaded = () => {
  mapWrapper.addEventListener("mousemove", (e) => {
    if (e.buttons & 1) {
      map.isFree = false;
      main.scrollLeft -= e.movementX;
      main.scrollTop -= e.movementY;
      mapWrapper.style.cursor = "grab";
    }
  });

  mapWrapper.addEventListener("mouseup", (e) => {
    if (~e.buttons & 1) {
      mapWrapper.style.cursor = "default";
      map.isFree = true;
    }
  });

  let scale = 1;
  let timeoutId = null;

  // Обработка прокрутки колёсика мыши над картой
  mapWrapper.addEventListener("wheel", (e) => {
    e.preventDefault();

    if (e.deltaY < 0) {
      // Уменьшение масштаба
      scale *= 1.1;
    } else if (e.deltaY > 0) {
      // Увеличение масштаба
      scale /= 1.1;
    }

    mapWrapper.style.transformOrigin = `${e.layerX}px ${e.layerY}px 0px`;
    mapWrapper.style.transform = `scale(${scale})`;

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      newClientWidth = mapWrapper.clientWidth * scale;
      newClientHeight = mapWrapper.clientHeight * scale;
      mapImage.style.width = `${newClientWidth}px`;
      mapImage.style.height = `${newClientHeight}px`;
      mapWrapper.style.width = `${newClientWidth}px`;
      mapWrapper.style.height = `${newClientHeight}px`;
      mapWrapper.style.transformOrigin = "";
      mapWrapper.style.transform = "";
      map.mPerPixel *= scale;
      scale = 1;
    }, 500);
  });

  main.addEventListener("wheel", (e) => {
    console.log(e.layerX - main.scrollLeft);
  });
};
