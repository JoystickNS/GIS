const menuBlock = document.querySelector(".menu");
const menuItems = document.querySelectorAll(".menu__item"); // Menu buttons
const menuPopupBlock = null;
const mapBody = document.querySelector(".map__body");

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
        fileInput.addEventListener("change", function loadImg() {
          if (fileInput.files[0].type.includes("image")) {
            const xmlns = "http://www.w3.org/2000/svg";
            const image = document.createElementNS(xmlns, "image");
            const img = document.createElement("img");
            const imageUrl = URL.createObjectURL(fileInput.files[0]);

            img.src = imageUrl;
            img.onload = function () {
              image.setAttribute(
                "href",
                URL.createObjectURL(fileInput.files[0])
              );
              image.setAttribute("width", this.width);
              image.setAttribute("height", this.height);
              mapBody.setAttribute("width", this.width);
              mapBody.setAttribute("height", this.height);

              mapBody.appendChild(image);
              URL.revokeObjectURL(imageUrl);
              alert("da");
              fileInput.removeEventListener("change", loadImg);
            };
          } else {
            alert("Вы выбрали не картинку");
          }
        });
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
      name: "1",
      event: "click",
      func() {
        alert("1");
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
