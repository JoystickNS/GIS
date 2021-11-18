const xmlns = "http://www.w3.org/2000/svg";
const menuBlock = document.querySelector(".menu");
const menuItems = menuBlock.querySelectorAll(".menu__item"); // Menu buttons
const main = document.querySelector("main");
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
  main.addEventListener("mousemove", (e) => {
    if (e.buttons & 1) {
      map.isFree = false;
      main.scrollLeft -= e.movementX;
      main.scrollTop -= e.movementY;
      main.style.cursor = "grab";
    }
  });

  main.addEventListener("mouseup", (e) => {
    if (~e.buttons & 1) {
      main.style.cursor = "default";
      map.isFree = true;
    }
  });

  function calculateZoom(value) {
    return (value * 6) / 5;
  }

  function calculateUnZoom(value) {
    return (value * 5) / 6;
  }

  let scale = 1;
  let timeoutId = null;
  let newMapImageWidth = mapImage.width;
  let newMapImageHeight = mapImage.height;
  let newMapImageLeft = parseFloat(mapImage.style.left);
  let newMapImageTop = parseFloat(mapImage.style.top);
  let newMapBodyWidth = mapBody.scrollWidth;
  let newMapBodyHeight = mapBody.scrollHeight;

  // Обработка прокрутки колёсика мыши над картой
  main.addEventListener("wheel", (e) => {
    e.preventDefault();

    if (e.deltaY < 0) {
      // Уменьшение масштаба
      scale *= 1.2;
      newMapImageWidth = calculateZoom(newMapImageWidth);
      newMapImageHeight = calculateZoom(newMapImageHeight);
      newMapBodyWidth = calculateZoom(newMapBodyWidth);
      newMapBodyHeight = calculateZoom(newMapBodyHeight);
      newMapImageLeft = calculateZoom(newMapImageLeft);
      newMapImageTop = calculateZoom(newMapImageTop);
      map.mPerPixel = calculateUnZoom(map.mPerPixel);
    } else if (e.deltaY > 0) {
      // Увеличение масштаба
      if (
        calculateUnZoom(newMapBodyWidth) < screen.width ||
        calculateUnZoom(newMapBodyHeight) < screen.height
      ) {
        return;
      }
      scale /= 1.2;
      newMapImageWidth = calculateUnZoom(newMapImageWidth);
      newMapImageHeight = calculateUnZoom(newMapImageHeight);
      newMapBodyWidth = calculateUnZoom(newMapBodyWidth);
      newMapBodyHeight = calculateUnZoom(newMapBodyHeight);
      newMapImageLeft = calculateUnZoom(newMapImageLeft);
      newMapImageTop = calculateUnZoom(newMapImageTop);
      map.mPerPixel = calculateZoom(map.mPerPixel);
    }

    mapImage.style.transform = `scale(${scale})`;
    mapImage.style.transformOrigin = `${
      e.layerX - parseFloat(mapImage.style.left)
    }px ${e.layerY - parseFloat(mapImage.style.top)}px 0px`;
    mapBody.style.transform = `scale(${scale})`;
    mapBody.style.transformOrigin = `${e.layerX}px ${e.layerY}px 0px`;

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      if (scale === 1) {
        mapImage.style.transform = "";
        mapImage.style.transformOrigin = "";
        return;
      }

      const oldMapImageLeft = parseFloat(mapImage.style.left);
      const oldMapImageTop = parseFloat(mapImage.style.top);

      mapImage.style.transform = "";
      mapImage.style.transformOrigin = "";
      mapImage.style.width = `${newMapImageWidth}px`;
      mapImage.style.height = `${newMapImageHeight}px`;
      mapImage.style.left = `${newMapImageLeft}px`;
      mapImage.style.top = `${newMapImageTop}px`;

      mapBody.style.transform = "";
      mapBody.style.transformOrigin = "";
      mapBody.style.width = `${newMapBodyWidth}px`;
      mapBody.style.height = `${newMapBodyHeight}px`;

      // Смешение страницы, относительно того куда приблизили
      const divX = e.clientX - main.offsetLeft;
      const divY = e.clientY - main.offsetTop;
      let x = e.layerX;
      let y = e.layerY;
      while (scale > 1) {
        x = calculateZoom(x);
        y = calculateZoom(y);
        scale /= 1.2;
      }

      while (scale < 1) {
        x = calculateUnZoom(x);
        y = calculateUnZoom(y);
        scale *= 1.2;
      }
      main.scrollTo(x - divX, y - divY);

      let a = document.querySelector("polyline");
      a.setAttribute(
        "points",
        a
          .getAttribute("points")
          .split(" ")
          .map((point) => {
            return point
              .split(",")
              .map((value, i) =>
                i % 2 === 0
                  ? (+value + newMapImageLeft - oldMapImageLeft).toFixed(2)
                  : (+value + newMapImageTop - oldMapImageTop).toFixed(2)
              )
              .join(",");
          })
          .join(" ")
      );

      scale = 1;
    }, 300);
  });
};

let a = document.querySelector(".a");
let b = document.querySelector(".b");

a.onclick = (e) => {
  resizeMapElemenst();
};

b.onclick = (e) => {
  console.log(e);
};

main.onmousedown = (e) => {
  e.preventDefault();
  if (e.buttons & 1) {
    //   const divX = e.clientX - main.offsetLeft;
    //   const divY = e.clientY - main.offsetTop;
    //   // const middleX = main.clientWidth / 2;
    //   // const middleY = main.clientHeight / 2;
    //   console.log(e.layerX - divX);
    //   console.log(e.layerY - divY);
    // } else if (e.buttons & 2) {
    //b.onclick(e);
  }
};

main.addEventListener("click", (e) => {
  const divX = e.clientX - main.offsetLeft;
  const divY = e.clientY - main.offsetTop;
  console.log(divX);
  console.log(divY);
});

function resizeMapElemenst() {
  const a = mapBody.querySelector(".map__body-elements").children;
  for (let i = 0; i < a.length; i++) {
    // Строка вида => "5,5 10,10"
    a[i].setAttribute(
      "points",
      a[i]
        .getAttribute("points")
        .split(" ")
        .map((point) => {
          return point
            .split(",")
            .map((value, i) =>
              i % 2 === 0
                ? +value + (main.scrollWidth - main.clientWidth) / 2
                : +value + (main.scrollHeight - main.clientHeight) / 2
            )
            .join(",");
        })
        .join(" ")
    );
  }
}

let c = document.querySelector("polyline");

function getSVGPoints(element) {
  return element
    .getAttribute("points")
    .split(" ")
    .map((point) => {
      return point
        .split(",")
        .map((value) => value)
        .join(",");
    });
}

function calculateSVGPosition(element) {
  let points = getSVGPoints(element);

  for (let i = 1; i < points.length; i++) {}
}

console.log(getSVGPoints(c));
