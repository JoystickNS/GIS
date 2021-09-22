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
        if (!main.onclick) {
          main.onclick = () => {
            if (!map.isMarked) {
              const mark = document.createElementNS(xmlns, "image");

              mark.classList.add("map__body-mark");
              mark.setAttribute("href", "point.svg");
              mark.setAttribute("x", map.currentX - 8);
              mark.setAttribute("y", map.currentY - 16);

              if (!mark.onmouseenter) {
                mark.onmouseenter = (e) => {
                  if (e.relatedTarget !== main.querySelector(".popup-window")) {
                    const popupWindow = document.createElement("div");

                    const x = +e.target.getAttribute("x");
                    const y = +e.target.getAttribute("y");

                    popupWindow.classList.add("popup-window");
                    main.appendChild(popupWindow);

                    const section = document.createElement("section");
                    section.classList.add("popup-window__coords");

                    const article = document.createElement("article");
                    article.classList.add("popup-window__coords-local");

                    const px = document.createElement("p");
                    px.textContent = "Локальный Х: ";
                    const py = document.createElement("p");
                    py.textContent = "Локальный Y: ";

                    const spanX = document.createElement("span");
                    spanX.classList.add("popup-window__coord_dodgerblue");
                    spanX.textContent = +mark.getAttribute("x") + 8;
                    const spanY = spanX.cloneNode(true);
                    spanY.textContent = +mark.getAttribute("y") + 16;

                    px.appendChild(spanX);
                    py.appendChild(spanY);

                    article.appendChild(px);
                    article.appendChild(py);

                    section.appendChild(article);
                    debugger;
                    popupWindow.appendChild(section);

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

              mapBody.appendChild(mark);
              map.isMarked = true;
            } else {
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
