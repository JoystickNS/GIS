const info = body.querySelector(".info");
const offInfo = body.querySelector(".offInfo");

info.onclick = () => {
  let objectInfo = main.querySelector(".object-info");

  if (objectInfo) {
    return;
  }

  const html = `
    <div class="object-info">
      <h1 class="object-info__caption caption">Информация</h1>
      <hr />
      <p>Какая-то информация</p>
      <p>Какая-то информация</p>
      <p>Какая-то информация</p>
      <p>Какая-то информация</p>
      <button class="object-info__button dialog__form-submit-bt">Какая-то кнопка</button>
    </div>`;

  main.insertAdjacentHTML("beforeend", html);
  objectInfo = main.querySelector(".object-info");

  setTimeout(() => (objectInfo.style.right = "0px"), 100);
};

offInfo.onclick = () => {
  const objectInfo = main.querySelector(".object-info");

  if (objectInfo) {
    objectInfo.style.right = "-300px";
    setTimeout(() => objectInfo.remove(), 800);
  }
};
