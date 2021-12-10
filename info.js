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
      <p class="object-info__label">Улица: проспект Ленина</p>
      <p class="object-info__label">Состояние участка: <span style="color: green">Отличное</span></p>
      <p class="object-info__label">Вид покрытия: асфальт</p>
      <p class="object-info__label">Протяжённость участка: <span style="color: blue"> 1569 м</span></p>
      <p class="object-info__label">Дата ввода в эксплуатацию: <span style="color: green">20.07.2021</span></p>
      <p class="object-info__label">Угол поворота: 0</p>
      <p class="object-info__label">Уклон: 0</p>
      <button class="object-info__button dialog__form-submit-bt">Редактировать</button>
      <button class="object-info__button dialog__form-submit-bt">Удалить</button>
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
