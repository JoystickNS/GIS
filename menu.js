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
        sidebar.appendChild(p);
        this.disabled = true;
        if (!mapBody.onclick) {
          mapBody.onclick = (e) => {
            function deleteMark(mark) {}

            if (e.target === mapBody.querySelector(".map__body-mark")) {
              const popupWindow = mapBody.querySelector(".popup-window");
              if (popupWindow) {
                popupWindow.remove();
              }
              e.target.remove();
              map.calcCoords.count--;
              return;
            }

            if (map.calcCoords.markCount < 2) {
              const mark = document.createElementNS(xmlns, "image");
              mark.classList.add("map__body-mark");
              mark.setAttribute("href", "point.svg");
              mark.setAttribute("x", map.layerX - 8);
              mark.setAttribute("y", map.layerY - 16);
              map.calcCoords.markCount++;

              if (!mark.onmouseenter) {
                mark.onmouseenter = (e) => {
                  if (e.relatedTarget !== main.querySelector(".popup-window")) {
                    const x = +e.target.getAttribute("x");
                    const y = +e.target.getAttribute("y");
                    const html = `
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
                          <button class="popup-window__delete-coord button" type="button" hidden>Удалить координаты</button>
                          <button class="popup-window__save-button button" type="submit">Сохранить координаты</button>
                        </div>
                      </form>`;
                    const popupWindow = document.createElement("div");
                    popupWindow.classList.add("popup-window");
                    popupWindow.innerHTML = html;

                    const form = popupWindow.querySelector(
                      ".popup-window__coords-form"
                    );

                    // Form data processing
                    form.onsubmit = (e) => {
                      e.preventDefault();
                      const formData = new FormData(form);
                      const coordCount = map.calcCoords.coordCount;
                      const realXInput = form.elements["realX"];
                      const realYInput = form.elements["realY"];

                      map.calcCoords[coordCount].htmlBlock = popupWindow;
                      map.calcCoords[coordCount].layerX = map.layerX;
                      map.calcCoords[coordCount].layerY = map.layerY;
                      map.calcCoords[coordCount].realX = +formData.get("realX");
                      map.calcCoords[coordCount].realY = +formData.get("realY");
                      map.calcCoords.count++;

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

                      deleteBtn.onclick = () => {
                        realXInput.disabled = false;
                        realYInput.disabled = false;
                        formMsg.classList.add("unvisible");
                        deleteBtn.hidden = true;
                        saveBtn.hidden = false;
                      };
                    };

                    main.appendChild(popupWindow);

                    // Calc the position of the popup-window
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

              if (!mark.onmouseleave) {
                mark.onmouseleave = (e) => {
                  const popupWindow = main.querySelector(".popup-window");

                  if (e.relatedTarget !== popupWindow) {
                    //popupWindow.remove();
                  }

                  if (!popupWindow.onmouseleave) {
                    popupWindow.onmouseleave = (e) => {
                      if (e.relatedTarget !== mark) {
                        //popupWindow.remove();
                      }
                    };
                  }
                };
              }

              mapBody.appendChild(mark);
              map.isMarked = true;
            } else {
              map.calcCoords.markCount--;
              const popupWindow = main.querySelector(".popup-window");

              if (popupWindow) {
                popupWindow.remove();
              }

              mapBody.querySelector(".map__body-mark").remove();
              map.isMarked = false;
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
  menuBlock.appendChild(popupMenu.options.activeBlock);
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
        popupBlock.appendChild(button);
      });

      popupMenu[prop].block = popupBlock;
    }
  }
})();
