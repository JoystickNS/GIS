const menuBlock = document.querySelector(".menu");
const menuItems = document.querySelectorAll(".menu__item"); // Menu buttons
const menuPopupBlock = null;
const mapBody = document.querySelector(".map__body");

const popupMenu = {
  options: {
    activeItem: null,
    block: null,
  },

  file: [
    {
      name: "Загрузить изображение",
      clickFunc() {
        const fileInput = document.querySelector("[type='file']");
        fileInput.click();
        fileInput.addEventListener("change", () => {
          const image = document.createElement("image");
          image.setAttribute("x", "100");
          image.setAttribute("y", "100");
          image.setAttribute("width", "100px");
          image.setAttribute("height", "100px");
          image.setAttribute("preserveAspectRatio", "none");
          image.setAttribute("href", URL.createObjectURL(fileInput.files[0]));
          mapBody.appendChild(image);
        });
      },
      block: null,
    },
    {
      name: "Сохранить",
      clickFunc() {
        alert("Сохранить");
      },
      block: null,
    },
  ],

  functions: [
    {
      name: "1",
      clickFunc() {
        alert("1");
      },
      block: null,
    },
    {
      name: "2",
      clickFunc() {
        alert("2");
      },
      block: null,
    },
  ],
};

// Adding event on every "Menu button"
menuItems.forEach((item, ind) => {
  item.addEventListener("click", (e) => {
    // Clicked on active menu item
    if (e.target === popupMenu.options.activeItem) {
      popupMenu.options.activeItem.classList.remove("menu__item_active");
      popupMenu.options.activeItem = null;
      return;
    }

    switch (ind) {
      // File button
      case 0:
        popupMenu.options.block = popupMenu.file.block;
        break;
      // Functions button
      case 1:
        popupMenu.options.block = popupMenu.functions.block;
        break;
    }

    popupMenu.options.activeItem = e.target;
    popupMenu.options.activeItem.classList.add("menu__item_active");
    popupMenu.options.block.style.left = `${e.target.offsetLeft}px`;
    menuBlock.appendChild(popupMenu.options.block);
  });
});

menuItems.forEach((item) => {
  item.addEventListener("mouseenter", (e) => {
    if (popupMenu.options.activeItem) {
      popupMenu.options.block.remove();
      console.log(e);
      popupMenu.options.activeItem.classList.remove("menu__item_active");
      popupMenu.options.activeItem = e.target;
      popupMenu.options.activeItem.classList.add("menu__item_active");
      //menuPopupBlock.style.left = `${e.target.offsetLeft}px`;
    }
  });
});

document.addEventListener("mousedown", (e) => {
  if (
    popupMenu.options.activeItem &&
    popupMenu.options.activeItem !== e.target
  ) {
    popupMenu.options.activeItem.classList.remove("menu__item_active");
    popupMenu.options.activeItem = null;
    //menuPopupBlock.style.display = "none";
  }
});

(function createPopupMenu() {
  for (let prop in popupMenu) {
    if (Array.isArray(popupMenu[prop])) {
      const popupBlock = document.createElement("div");
      popupBlock.classList.add("menu__popup-menu");

      popupMenu[prop].forEach((item) => {
        const button = document.createElement("button");
        button.classList.add("menu__popup-menu-item");
        button.textContent = item.name;
        button.addEventListener("click", item.clickFunc);
        popupBlock.appendChild(button);
      });

      popupMenu[prop].block = popupBlock;
    }
  }
})();
