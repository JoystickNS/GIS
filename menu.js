"use strict";

const popupMenu = {
  options: {
    activeItem: null,
    activeBlock: null,
  },

  file: [
    {
      name: "Загрузить изображение",
      event: "click",
      func() {
        const fileInput = document.querySelector("[type='file']");
        fileInput.click();
        if (!fileInput.onchange) {
          fileInput.onchange = () => {
            if (fileInput.files[0].type.includes("image")) {
              const imageUrl = URL.createObjectURL(fileInput.files[0]);
              const ctx = mapImage.getContext("2d");

              const img = new Image();
              img.src = imageUrl;
              img.onload = function () {
                mapImage.width = this.width;
                mapImage.height = this.height;
                ctx.drawImage(img, 0, 0);
                URL.revokeObjectURL(imageUrl);
              };
            } else {
              alert("Вы выбрали не картинку");
            }
          };
        }
      },
      block: null,
    },
    {
      name: "Сохранить",
      event: "click",
      func() {
        alert("Сохранить");
      },
      block: null,
    },
  ],

  functions: [
    {
      name: "Задать плоские координаты",
      event: "click",
      func() {
        const p = document.createElement("p");
        p.innerHTML = "Задание плоских координат";
        p.style.color = "red";
        sidebar.append(p);
        this.disabled = true;
        if (!mapBody.onclick) {
          mapBody.onmouseup = (e) => {
            if (e.target === mapBody.querySelector(".map__body-mark")) return;

            // If 2 markers have not been set yet
            if (map.calcCoords.markCount < 2) {
              const coords = map.calcCoords.coords;
              const freeCoord = coords.find((coord) => coord.mark === null);

              const mark = document.createElementNS(xmlns, "image");
              mark.classList.add("map__body-mark");
              mark.setAttribute("href", "point.svg");
              mark.setAttribute("x", map.layerX - 8);
              mark.setAttribute("y", map.layerY - 16);
              mapBody.append(mark);
              map.calcCoords.markCount++;

              freeCoord.mark = mark;
              freeCoord.layerX = map.layerX;
              freeCoord.layerY = map.layerY;

              if (map.calcCoords.markCount === 2) {
                const line = document.createElementNS(xmlns, "line");
                line.classList.add("map__body-mark-dist");
                line.setAttribute("x1", coords[0].layerX);
                line.setAttribute("y1", coords[0].layerY);
                line.setAttribute("x2", coords[1].layerX);
                line.setAttribute("y2", coords[1].layerY);
                line.style.stroke = "black";
                line.style.strokeWidth = "1px";
                mapBody.append(line);
              }

              if (!mark.onmouseenter) {
                mark.onmouseenter = (e) => {
                  // If the hover over the marker was not made from a pop-up window
                  if (e.relatedTarget !== main.querySelector(".popup-window")) {
                    const knownMark = coords.find((coord) => {
                      return coord.mark === mark && coord.domBlock !== null;
                    });

                    // If the marker is known, then we display its window and exit
                    if (knownMark) {
                      main.append(knownMark.domBlock);
                      return;
                    }

                    const x = +mark.getAttribute("x");
                    const y = +mark.getAttribute("y");
                    const html = `
                      <div class="popup-window">
                        <form class="popup-window__coords-form" method="POST">
                          <section class="popup-window__coords">
                            <article class="popup-window__coords-layer">
                              <p>Экранный X: <span class="dodgerblue">${
                                x + 8
                              }</span></p>
                              <p>Экранный Y: <span class="dodgerblue">${
                                y + 16
                              }</span></p>
                            </article>
                            <article class="popup-window__coords-real">
                              <label style="display:block" for="real-coord-x">
                                Реальный<span class="dodgerblue"> Х:</span>
                              </label>
                              <input type="text" id="real-coord-x" name="realX" autocomplete="off">
                              <label style="display:block" for="real-coord-y">
                                Реальный<span class="dodgerblue"> Y:</span> 
                              </label>
                              <input type="text" id="real-coord-y" name="realY" autocomplete="off">
                            </article>
                          </section>
                          <p class="popup-window__result-msg unvisible">Результат обработки формы</p>
                          <div class="popup-window__buttons">
                            <button class="popup-window__delete-coord button button_red-border" type="button" hidden>Удалить координаты</button>
                            <button class="popup-window__save-button button button_green-border" type="submit">Сохранить координаты</button>
                          </div>
                        </form>
                      </div>`;
                    main.insertAdjacentHTML("beforeend", html);

                    const popupWindow = main.querySelector(".popup-window");
                    freeCoord.domBlock = popupWindow;

                    const form = popupWindow.querySelector(
                      ".popup-window__coords-form"
                    );

                    // Form data processing
                    form.onsubmit = (e) => {
                      e.preventDefault();

                      const formData = new FormData(form);
                      const realXInput = form.elements["realX"];
                      const realYInput = form.elements["realY"];

                      freeCoord.isSaved = true;
                      freeCoord.realX = +formData.get("realX");
                      freeCoord.realY = +formData.get("realY");
                      mark.dataset.markStatus = "saved";
                      map.calcCoords.savedCount++;

                      realXInput.disabled = true;
                      realYInput.disabled = true;

                      const formMsg = form.querySelector(
                        ".popup-window__result-msg"
                      );
                      formMsg.textContent = "Координаты сохранены";
                      formMsg.style.color = "green";
                      formMsg.classList.remove("unvisible");

                      const saveBtn = form.querySelector(
                        ".popup-window__save-button"
                      );
                      saveBtn.hidden = true;

                      const deleteBtn = form.querySelector(
                        ".popup-window__delete-coord"
                      );
                      deleteBtn.hidden = false;

                      if (map.calcCoords.savedCount === 2) {
                        const html = `      
                        <div class="map__confirm-calc">
                          <button class="map__confirm-calc-bt button button_green-border">
                            Рассчитать реальные координаты
                          </button>
                        </div>`;
                        main.insertAdjacentHTML("beforeend", html);
                        const confirmBlock =
                          main.querySelector(".map__confirm-calc");
                        const confirmBt = confirmBlock.querySelector(
                          ".map__confirm-calc-bt"
                        );

                        confirmBt.onclick = () => {
                          const layerDist = Math.sqrt(
                            (coords[0].layerX - coords[1].layerX) ** 2 +
                              (coords[0].layerY - coords[1].layerY) ** 2
                          );
                          const realDist = Math.sqrt(
                            (coords[0].realX - coords[1].realX) ** 2 +
                              (coords[0].realY - coords[1].realY) ** 2
                          );

                          map.mPerPixel = realDist / layerDist;
                          map.zeroRealCoord.x =
                            coords[0].realX - map.mPerPixel * coords[0].layerY;
                          map.zeroRealCoord.y =
                            coords[0].realY - map.mPerPixel * coords[0].layerX;

                          map.isCoordsCalculated = true;

                          confirmBlock.style.top = "-80px";
                          setTimeout(() => confirmBlock.remove(), 800);

                          mapBody.addEventListener("mousemove", (e) => {
                            const realX = document.querySelector(".realX");
                            const realY = document.querySelector(".realY");

                            realX.innerHTML = `RealX: ${
                              map.zeroRealCoord.x + e.layerY * map.mPerPixel
                            }`;
                            realY.innerHTML = `RealY: ${
                              map.zeroRealCoord.y + e.layerX * map.mPerPixel
                            }`;
                          });
                        };
                        setTimeout(() => (confirmBlock.style.top = "0px"), 100);
                      }

                      deleteBtn.onclick = () => {
                        if (map.calcCoords.savedCount === 2) {
                          main.querySelector(".map__confirm-calc").remove();
                        }
                        realXInput.disabled = false;
                        realYInput.disabled = false;
                        formMsg.classList.add("unvisible");
                        deleteBtn.hidden = true;
                        saveBtn.hidden = false;
                        freeCoord.isSaved = false;
                        map.calcCoords.savedCount--;
                        delete mark.dataset.markStatus;
                      };
                    };

                    // Calculates the position of the popup-window
                    if (x < popupWindow.offsetWidth / 2) {
                      popupWindow.style.left = "0px";
                    } else if (
                      main.offsetWidth - x <
                      popupWindow.offsetWidth / 2
                    ) {
                      popupWindow.style.right = "0px";
                    } else {
                      popupWindow.style.left = `${
                        x + 8 - popupWindow.offsetWidth / 2
                      }px`;
                    }

                    if (y < popupWindow.offsetHeight) {
                      popupWindow.style.top = `${y + 16}px`;
                    } else {
                      popupWindow.style.top = `${
                        y - popupWindow.offsetHeight
                      }px`;
                    }
                  }
                };
              }

              if (!mark.onclick) {
                mark.onclick = (e) => {
                  if (mark.dataset.markStatus !== "saved") {
                    if (map.calcCoords.markCount === 2) {
                      mapBody.querySelector(".map__body-mark-dist").remove();
                    }
                    const coord = coords.find((i) => i.mark === mark);
                    coord.domBlock = null;
                    coord.mark = null;
                    const popupWindow = main.querySelector(".popup-window");
                    if (popupWindow) {
                      popupWindow.remove();
                    }
                    e.target.remove();
                    map.calcCoords.markCount--;
                  }
                };
              }

              if (!mark.onmouseleave) {
                mark.onmouseleave = (e) => {
                  const popupWindow = main.querySelector(".popup-window");

                  if (e.relatedTarget !== popupWindow) {
                    popupWindow.remove();
                  }

                  if (!popupWindow.onmouseleave) {
                    popupWindow.onmouseleave = (e) => {
                      if (e.relatedTarget !== mark) {
                        popupWindow.remove();
                      }
                    };
                  }
                };
              }
            }
          };
        }
      },
      block: null,
    },
    {
      name: "2",
      event: "click",
      func() {
        alert("2");
      },
      block: null,
    },
  ],
};

// Adding "mousedown" event on every "Menu button"
menuItems.forEach((item, ind) => {
  item.addEventListener("mousedown", (e) => {
    if (e.target === popupMenu.options.activeItem) {
      hidePopupMenu();
      return;
    }

    showPopupMenu(e.target, ind);
  });
});

// Adding "mouseenter" event on every "Menu button"
menuItems.forEach((item, ind) => {
  item.addEventListener("mouseenter", (e) => {
    if (popupMenu.options.activeItem) {
      popupMenu.options.activeBlock.remove();
      popupMenu.options.activeItem.classList.remove("menu__item_active");

      showPopupMenu(e.target, ind);
    }
  });
});

// Adding "click" event on document
document.addEventListener("click", (e) => {
  if (
    popupMenu.options.activeItem &&
    popupMenu.options.activeItem !== e.target
  ) {
    hidePopupMenu();
  }
});

function showPopupMenu(target, ind) {
  switch (ind) {
    // File button
    case 0:
      popupMenu.options.activeBlock = popupMenu.file.block;
      break;
    // Functions button
    case 1:
      popupMenu.options.activeBlock = popupMenu.functions.block;
      break;
  }

  popupMenu.options.activeItem = target;
  target.classList.add("menu__item_active");
  popupMenu.options.activeBlock.style.left = `${target.offsetLeft}px`;
  menuBlock.append(popupMenu.options.activeBlock);
}

function hidePopupMenu() {
  popupMenu.options.activeItem.classList.remove("menu__item_active");
  popupMenu.options.activeItem = null;
  popupMenu.options.activeBlock.remove();
  popupMenu.options.activeBlock = null;
}

(function createPopupMenu() {
  for (let prop in popupMenu) {
    if (Array.isArray(popupMenu[prop])) {
      const popupBlock = document.createElement("div");
      popupBlock.classList.add("menu__popup-menu");

      popupMenu[prop].forEach((item) => {
        const button = document.createElement("button");
        button.classList.add("menu__popup-menu-item");
        button.textContent = item.name;
        button.addEventListener(item.event, item.func);
        popupBlock.append(button);
      });

      popupMenu[prop].block = popupBlock;
    }
  }
})();
