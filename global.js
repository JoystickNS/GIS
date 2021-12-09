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
