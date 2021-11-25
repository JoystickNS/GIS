const xmlns = "http://www.w3.org/2000/svg";
const body = document.querySelector("body");
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

  let scale = 1;
  let timeoutId = null;
  let newMapImageWidth = mapImage.width;
  let newMapImageHeight = mapImage.height;
  let newMapImageLeft = parseFloat(mapImage.style.left);
  let newMapImageTop = parseFloat(mapImage.style.top);
  let newMapBodyWidth = mapBody.scrollWidth;
  let newMapBodyHeight = mapBody.scrollHeight;

  // Обработка прокрутки колёсика мыши над картой
  mapBody.addEventListener("wheel", (e) => {
    e.preventDefault();

    if (e.deltaY < 0) {
      // Уменьшение масштаба
      if (
        calculateZoom(newMapBodyWidth) > Number.MAX_SAFE_INTEGER ||
        calculateZoom(newMapBodyHeight) > Number.MAX_SAFE_INTEGER
      ) {
        return;
      }

      scale *= 1.2;
      newMapBodyWidth = calculateZoom(newMapBodyWidth);
      newMapBodyHeight = calculateZoom(newMapBodyHeight);
    } else if (e.deltaY > 0) {
      // Увеличение масштаба
      if (
        calculateUnZoom(newMapBodyWidth) < screen.width ||
        calculateUnZoom(newMapBodyHeight) < screen.height
      ) {
        return;
      }

      scale /= 1.2;
      newMapBodyWidth = calculateUnZoom(newMapBodyWidth);
      newMapBodyHeight = calculateUnZoom(newMapBodyHeight);
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

      let calculateZoomFunc;
      let scaleCount = 0;
      if (scale > 1) {
        calculateZoomFunc = calculateZoom;

        while (scale > 1) {
          scale /= 1.2;
          scaleCount++;
        }

        map.mPerPixel = calculateUnZoom(map.mPerPixel, scaleCount);
      } else if (scale < 1) {
        calculateZoomFunc = calculateUnZoom;

        while (scale < 1) {
          scale *= 1.2;
          scaleCount++;
        }

        map.mPerPixel = calculateZoom(map.mPerPixel, scaleCount);
      }

      // Расчёт новых значений
      newMapImageWidth = calculateZoomFunc(newMapImageWidth, scaleCount);
      newMapImageHeight = calculateZoomFunc(newMapImageHeight, scaleCount);
      newMapImageLeft = calculateZoomFunc(newMapImageLeft, scaleCount);
      newMapImageTop = calculateZoomFunc(newMapImageTop, scaleCount);
      // Конец расчёта новых значений

      const oldMapImageLeft = parseFloat(mapImage.style.left);
      const oldMapImageTop = parseFloat(mapImage.style.top);

      // Присвоение новых значений
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
      // Конец присвоения новых значений

      // Смешение страницы, относительно того куда приблизили
      const divX = e.clientX - main.offsetLeft;
      const divY = e.clientY - main.offsetTop;

      main.scrollTo(
        calculateZoomFunc(e.layerX, scaleCount) - divX,
        calculateZoomFunc(e.layerY, scaleCount) - divY
      );
      // Конец смещения

      // Масштабирование элементов карты
      const mapElements = mapBody.querySelector(".map__body-elements").children;
      for (let i = 0; i < mapElements.length; i++) {
        if (
          mapElements[i].tagName == "polyline" ||
          mapElements[i].tagName == "polygon"
        ) {
          calculateSVGSize(
            mapElements[i],
            calculateZoomFunc,
            scaleCount,
            newMapImageLeft - oldMapImageLeft,
            newMapImageTop - oldMapImageTop
          );
        }
      }
      // Конец масштабирования элементов карты

      // Смещение марок карты
      const marks = mapBody.querySelectorAll(".map__body-mark");
      marks.forEach((mark) => {
        mark.setAttribute(
          "x",
          (
            +calculateZoomFunc(+mark.getAttribute("x") + 8, scaleCount) - 8
          ).toFixed(2)
        );
        mark.setAttribute(
          "y",
          (
            +calculateZoomFunc(+mark.getAttribute("y") + 16, scaleCount) - 16
          ).toFixed(2)
        );
      });
      // Конец смещения марок карты

      const popupWindow = main.querySelector(".popup-window");
      if (popupWindow) {
        popupWindow.remove();
      }

      scale = 1;
    }, 300);
  });
};

main.onmousedown = (e) => {
  e.preventDefault();
  if (e.buttons & 1) {
  }
};

main.addEventListener("click", (e) => {
  const divX = e.clientX - main.offsetLeft;
  const divY = e.clientY - main.offsetTop;
  console.log(divX);
  console.log(divY);
});

let c = document.querySelector("polyline");

function calculateZoom(value, pow = 1) {
  return (value * Math.pow(6, pow)) / Math.pow(5, pow);
}

function calculateUnZoom(value, pow = 1) {
  return (value * Math.pow(5, pow)) / Math.pow(6, pow);
}

/**
 * Поулчает значение атрибута "points" SVG элемента
 *
 * @param {SVGImageElement} element - SVG элемент, размеры которого будут вычислены
 * @returns {Array} Массив координат SVG элемента
 */
function getArraySVGPoints(element) {
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

/**
 * Вычисляет новые размеры SVG элемента у которого есть атрибут "points" и добавляет смещение,
 * если необходимо, исходя из того увеличил или уменьшил пользователь масштаб карты
 *
 * @param {SVGImageElement} element - SVG элемент, размеры которого будут вычислены
 * @param {Function} calculateSizeFunc - функция, которая вычисляет, на сколько будут
 * увеличены или уменьшены размеры SVG элемента
 * @param {Number} pow - аргумент для функции calculateSizeFunc
 * @param {Number} offsetX - Смещение относительно X
 * @param {Number} offsetY - Смещение относительно Y
 */
function calculateSVGSize(
  element,
  calculateSizeFunc,
  pow = 1,
  offsetX = 0,
  offsetY = 0
) {
  const points = getArraySVGPoints(element);

  let firstPoint = points[0].split(",");
  let secondPoint;
  let newDiffX = 0;
  let newDiffY = 0;
  let summDiffX = 0;
  let summDiffY = 0;

  for (let i = 1; i < points.length; i++) {
    secondPoint = points[i].split(",");
    secondPoint[0] = +secondPoint[0];
    secondPoint[1] = +secondPoint[1];
    const lenX = secondPoint[0] - firstPoint[0];
    const lenY = secondPoint[1] - firstPoint[1];
    summDiffX += newDiffX;
    summDiffY += newDiffY;
    newDiffX = calculateSizeFunc(lenX, pow) - lenX;
    newDiffY = calculateSizeFunc(lenY, pow) - lenY;
    firstPoint = Array.from(secondPoint);
    points[i] = `${+(secondPoint[0] + summDiffX + newDiffX + offsetX).toFixed(
      2
    )},${+(secondPoint[1] + summDiffY + newDiffY + offsetY).toFixed(2)}`;
  }
  firstPoint = points[0].split(",");
  points[0] = `${+(+firstPoint[0] + offsetX).toFixed(2)},${+(
    +firstPoint[1] + offsetY
  ).toFixed(2)}`;
  const strokeWidth = element.getAttribute("stroke-width");
  element.setAttribute(
    "stroke-width",
    +calculateSizeFunc(strokeWidth, pow).toFixed(2)
  );
  element.setAttribute("points", points.join(" "));
}
