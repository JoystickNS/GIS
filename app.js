const menuItems = document.querySelectorAll(".menu__item"); // Menu buttons

// Adding event on every "Menu button"
menuItems.forEach((item, ind) =>
  item.addEventListener("click", () => {
    const subMenu = document.createElement("div");
    switch (ind) {
      // File button
      case 0:
        const fileInput = document.querySelector("[type='file']");
        fileInput.click();
        break;
      // Functions button
      case 1:
        break;
    }
  })
);
