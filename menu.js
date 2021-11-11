// const mainMenu = new MainMenu();
// let menuItem = new MenuItem();

const popupMenu = {
  options: {
    activeItem: null,
    activeBlock: null,
  },

  // Пункт меню "Файл"
  file: [
    // Пункт меню "Загрузить изображение"
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
    },
    // Пункт меню "Сохранить"
    {
      name: "Сохранить",
      event: "click",
      func() {
        alert("Сохранить");
      },
    },
  ],

  // Пункт меню "Функции"
  functions: [
    // Пункт меню "Задать плоские координаты"
    {
      name: "Задать плоские координаты",
      event: "click",
      func() {
        const button = this;
        const p = document.createElement("p");
        p.innerHTML = "Задание плоских координат";
        p.style.color = "red";
        sidebar.append(p);
        button.disabled = true;

        // Срабатывает в момент отжатия "Клика" мышки
        mapBody.onclick = (e) => {
          const marksCount = 2; // Максимальное количество меток

          // Если не было установлено marksCount отметок на карте
          if (
            map.calcCoords.markCount < marksCount &&
            !e.target.classList.value.includes("map__body-mark")
          ) {
            const markCoords = map.calcCoords.markCoords;
            const freeCoord = markCoords.find((coord) => coord.mark === null);

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

            // Срабатывает при наведении на отметку на карте
            mark.onmouseenter = (e) => {
              // Если наведение на отметку было сделано не с всплывающего окна
              if (e.relatedTarget !== main.querySelector(".popup-window")) {
                const savedMark = markCoords.find((coord) => {
                  return coord.mark === mark && coord.domBlock !== null;
                });
                // Если отметка была ранее сохранена, то просто отображаем её всплывающее окно и выходим
                if (savedMark) {
                  main.append(savedMark.domBlock);
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
                              <input type="text" id="real-coord-x" name="realX" pattern="^[0-9]{1,10}$" autocomplete="off">
                              <label style="display:block" for="real-coord-y">
                                Реальный<span class="dodgerblue"> Y:</span> 
                              </label>
                              <input type="text" id="real-coord-y" name="realY" pattern="^[0-9]{1,10}$" autocomplete="off">
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

                const markPopupWindow = main.querySelector(".popup-window");
                freeCoord.domBlock = markPopupWindow;

                const form = markPopupWindow.querySelector(
                  ".popup-window__coords-form"
                );

                // Обработка кнопки "Сохранить координаты"
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

                  if (map.calcCoords.savedCount === marksCount) {
                    const html = `      
                        <div class="map__confirm-calc">
                          <button class="map__confirm-calc-bt button button_green-border">
                            Рассчитать реальные координаты
                          </button>
                        </div>`;
                    main.insertAdjacentHTML("beforeend", html);
                    const caclRealCoordsBlock =
                      main.querySelector(".map__confirm-calc");
                    const caclRealCoordsBt = caclRealCoordsBlock.querySelector(
                      ".map__confirm-calc-bt"
                    );

                    // Обработка кнопки "Рассчитать реальные координаты"
                    caclRealCoordsBt.onclick = () => {
                      mapBody
                        .querySelectorAll(".map__body-mark")
                        .forEach((mark) => {
                          mark.remove();
                          mapBody.onclick = null;
                        });

                      const layerDist = Math.sqrt(
                        (markCoords[0].layerX - markCoords[1].layerX) ** 2 +
                          (markCoords[0].layerY - markCoords[1].layerY) ** 2
                      );
                      const realDist = Math.sqrt(
                        (markCoords[0].realX - markCoords[1].realX) ** 2 +
                          (markCoords[0].realY - markCoords[1].realY) ** 2
                      );

                      map.mPerPixel = realDist / layerDist;
                      map.zeroRealCoord.x =
                        markCoords[0].realX -
                        map.mPerPixel * markCoords[0].layerY;
                      map.zeroRealCoord.y =
                        markCoords[0].realY -
                        map.mPerPixel * markCoords[0].layerX;

                      map.isCoordsCalculated = true;

                      caclRealCoordsBlock.style.top = "-80px";
                      setTimeout(() => caclRealCoordsBlock.remove(), 800);

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

                      button.disabled = false;
                    };

                    setTimeout(
                      () => (caclRealCoordsBlock.style.top = "0px"),
                      100
                    );
                  }

                  // Обработка кнопки "Удалить координаты"
                  deleteBtn.onclick = () => {
                    if (map.calcCoords.savedCount === marksCount) {
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

                // Рассчитывает позицию всплывающего окна, при наведении на отметку на карте
                if (x < markPopupWindow.offsetWidth / 2) {
                  markPopupWindow.style.left = "0px";
                } else if (
                  main.offsetWidth - x <
                  markPopupWindow.offsetWidth / 2
                ) {
                  markPopupWindow.style.right = "0px";
                } else {
                  markPopupWindow.style.left = `${
                    x + 8 - markPopupWindow.offsetWidth / 2
                  }px`;
                }

                if (y < markPopupWindow.offsetHeight) {
                  markPopupWindow.style.top = `${y + 16}px`;
                } else {
                  markPopupWindow.style.top = `${
                    y - markPopupWindow.offsetHeight
                  }px`;
                }
              }
            };

            // Срабатывает, когда "Кликаем" по отметке на карте
            mark.onclick = () => {
              if (mark.dataset.markStatus !== "saved") {
                const markCoord = markCoords.find((i) => i.mark === mark);
                markCoord.domBlock = null;
                markCoord.mark = null;
                const markPopupWindow = main.querySelector(".popup-window");
                if (markPopupWindow) {
                  markPopupWindow.remove();
                }
                mark.remove();
                map.calcCoords.markCount--;
              }
            };

            // Срабатывает, когда курсор мыши покидает отметку на карте
            mark.onmouseleave = (e) => {
              const markPopupWindow = main.querySelector(".popup-window");

              if (e.relatedTarget !== markPopupWindow) {
                markPopupWindow.remove();
              }

              if (!markPopupWindow.onmouseleave) {
                markPopupWindow.onmouseleave = (e) => {
                  if (e.relatedTarget !== mark) {
                    markPopupWindow.remove();
                  }
                };
              }
            };
          }
        };
      },
    },
    // Пункт меню ""
    {
      name: "2",
      event: "click",
      func() {
        alert("2");
      },
    },
  ],
};

// Для каждого пункта меню добавляем функцию обработки нажатия правой кнопки мыши по пункту меню
menuItems.forEach((item, ind) => {
  item.addEventListener("click", (e) => {
    if (e.target === popupMenu.options.activeItem) {
      hidePopupMenu();
      return;
    }

    showPopupMenu(e.target, ind);
  });
});

// Для каждого пункта меню добавляем функцию обработки наведения на пункт меню
menuItems.forEach((item, ind) => {
  item.addEventListener("mouseenter", (e) => {
    if (popupMenu.options.activeItem) {
      popupMenu.options.activeBlock.remove();
      popupMenu.options.activeItem.classList.remove("menu__item_active");

      showPopupMenu(e.target, ind);
    }
  });
});

// Срабатывает при "Клике" по документу
document.addEventListener("click", (e) => {
  if (
    popupMenu.options.activeItem &&
    popupMenu.options.activeItem !== e.target
  ) {
    hidePopupMenu();
  }
});

// Функция показа всплывающего меню
function showPopupMenu(target, ind) {
  switch (ind) {
    // Пункт меню "Файл"
    case 0:
      popupMenu.options.activeBlock = popupMenu.file.htmlBlock;
      break;
    // Пункт меню "Функции"
    case 1:
      popupMenu.options.activeBlock = popupMenu.functions.htmlBlock;
      break;
  }

  popupMenu.options.activeItem = target;
  target.classList.add("menu__item_active");
  popupMenu.options.activeBlock.style.left = `${target.offsetLeft}px`;
  menuBlock.append(popupMenu.options.activeBlock);
}

// Фуцнкция скрытия всплывающего меню
function hidePopupMenu() {
  popupMenu.options.activeItem.classList.remove("menu__item_active");
  popupMenu.options.activeItem = null;
  popupMenu.options.activeBlock.remove();
  popupMenu.options.activeBlock = null;
}

// Функция создания меню
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

      popupMenu[prop].htmlBlock = popupBlock;
    }
  }
})();
