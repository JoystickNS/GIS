mapBody.addEventListener("mousewheel", (e) => {
  if (e.ctrlKey) {
    e.preventDefault();
  }
});

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

  if (point) {
    point.setAttribute("cx", map.layerX);
    point.setAttribute("cy", map.layerY);
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

  if (map.isGridAttach) {
    const circle = document.createElementNS(xmlns, "circle");

    circle.classList.add("map__body-grid-attach");
    circle.setAttribute("r", 1);

    main.querySelector(".map__body-grid").append(circle);

    mapBody.onmouseenter = () => {
      mapBody.querySelector(".map__body-grid-attach").style.visibility =
        "visible";
    };

    mapBody.onmouseleave = () => {
      mapBody.querySelector(".map__body-grid-attach").style.visibility =
        "hidden";
    };
  } else {
    mapBody.querySelector("map__body-grid-attach")?.remove();

    mapBody.onmouseenter = null;

    mapBody.onmouseleave = null;
  }
};

// Срабатывает после загрузки картинки карты
main.afterImageLoaded = () => {
  main.onmousemove = (e) => {
    if (e.buttons & 1) {
      map.isFree = false;
      main.scrollLeft -= e.movementX;
      main.scrollTop -= e.movementY;
      main.style.cursor = "grab";
    }
  };

  main.onmouseup = (e) => {
    if (~e.buttons & 1) {
      main.style.cursor = "default";
      map.isFree = true;
    }
  };

  let scale = 1;
  let timeoutId = null;
  let newMapImageWidth = mapImage.width;
  let newMapImageHeight = mapImage.height;
  let newMapImageLeft = parseFloat(mapImage.style.left);
  let newMapImageTop = parseFloat(mapImage.style.top);
  let newMapBodyWidth = mapBody.scrollWidth;
  let newMapBodyHeight = mapBody.scrollHeight;

  // Обработка прокрутки колёсика мыши над картой
  mapBody.onwheel = (e) => {
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

    // Функция перерасчёта размеров и позиций всех объектов
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
          calculateSVGSize(mapElements[i], calculateZoomFunc, scaleCount);
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
  };
};

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
 */
function calculateSVGSize(element, calculateSizeFunc, pow = 1) {
  const points = getArraySVGPoints(element);

  points.forEach((point, i) => {
    point = point.split(",");
    point[0] = +calculateSizeFunc(+point[0], pow).toFixed(2);
    point[1] = +calculateSizeFunc(+point[1], pow).toFixed(2);
    points[i] = point;
  });

  const strokeWidth = element.getAttribute("stroke-width");
  element.setAttribute(
    "stroke-width",
    +calculateSizeFunc(strokeWidth, pow).toFixed(2)
  );
  element.setAttribute("points", points.join(" "));
}
