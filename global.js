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
        layerX: null,
        layerY: null,
        realX: null,
        realY: null,
      },
      {
        isSaved: false,
        mark: null,
        domBlock: null,
        layerX: null,
        layerY: null,
        realX: null,
        realY: null,
      },
    ],
  },
  zeroRealCoord: {
    x: null,
    y: null,
  },
  isCoordsCalculated: false,
  isMarked: false,
  isGridAttach: false,
  layerX: 0,
  layerY: 0,
  realX: 0,
  realY: 0,
};
