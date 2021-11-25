const roadSection = document.querySelector(".road-section");
const building = document.querySelector(".building");

roadSection.onclick = () => {
  const html = `
    <div class="background"></div>

    <div class="dialog">
      <div class="dialog__window">
        <img src="images/exit.svg" alt="Закрыть окно" class="dialog__exit">
        <h1 class="dialog__caption caption">Участок дороги</h1>
        <hr />
        <form class="dialog__form">
          <div class="dialog__form-item">
            <label for="street-name" class="dialog__input-label">Наименование улицы</label>
            <input type="text" class="dialog__form-input" id="street-name" name="streetName">
          </div>
          <div class="dialog__form-item">
            <label for="condition-type" class="dialog__input-label">Состояние участка</label>
            <select class="dialog__form-select" id="condition-type" name="conditionType">
              <option value="volvo">Volvo</option>
            </select>
          </div>
          <div class="dialog__form-item">
            <label for="coverage-type" class="dialog__input-label">Вид покрытия</label>
            <select class="dialog__form-select" id="coverage-type" name="coverageType">
              <option value="volvo">Volvo</option>
            </select>
          </div>
          <div class="dialog__form-item">
            <label for="section-length" class="dialog__input-label">Протяжённость участка</label>
            <input type="text" class="dialog__form-input" id="section-length" name="sectionLength">
          </div>
          <div class="dialog__form-item">
            <label for="commissioning-date" class="dialog__input-label">Дата ввода в эксплуатацию</label>
            <input type="text" class="dialog__form-input" id="commissioning-date" name="commissioningDate">
          </div>
          <div class="dialog__form-item">
            <label for="rotation-angle" class="dialog__input-label">Угол поворота</label>
            <input type="text" class="dialog__form-input" id="rotation-angle" name="rotationAngle">
          </div>
          <div class="dialog__form-item">
            <label for="slope" class="dialog__input-label">Уклон</label>
            <input type="text" class="dialog__form-input" id="slope" name="slope">
          </div>
          <button class="dialog__form-submit-bt" type="submit">Продолжить</button>
        </form>
        </div>
      </div>
    </div>`;

  body.insertAdjacentHTML("beforeend", html);
  const dialog = document.querySelector(".dialog");
  const exitBt = dialog.querySelector(".dialog__exit");
  const form = dialog.querySelector(".dialog__form");
  exitBt.onclick = () => {
    body.querySelector(".background")?.remove();
    dialog.remove();
  };
  form.onsubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    for (var key of formData.keys()) {
      console.log(`${key} - ${formData.get(key)}`);
    }

    exitBt.onclick();
  };
};

building.onclick = () => {
  const html = `
    <div class="background"></div>

    <div class="dialog">
      <div class="dialog__window">
        <img src="images/exit.svg" alt="Закрыть окно" class="dialog__exit">
        <h1 class="dialog__caption caption">Сооружение</h1>
        <hr />
        <form class="dialog__form">
          <div class="dialog__form-item">
            <label for="street-name" class="dialog__input-label">Наименование улицы</label>
            <input type="text" class="dialog__form-input" id="street-name" name="streetName">
          </div>
          <div class="dialog__form-item">
            <label for="building-type" class="dialog__input-label">Тип здания</label>
            <select class="dialog__form-select" id="building-type" name="buildingType">
              <option value="volvo">Volvo</option>
            </select>
          </div>
          <div class="dialog__form-item">
            <label for="house-number" class="dialog__input-label">Порядковый номер дома</label>
            <input type="text" class="dialog__form-input" id="house-number" name="houseNumber" >
          </div>
          <div class="dialog__form-item">
            <label for="corpus" class="dialog__input-label">Корпус</label>
            <input type="text" class="dialog__form-input" id="corpus" name="corpus">
          </div>
          <div class="dialog__form-item">
            <label for="floors-number" class="dialog__input-label">Этажность</label>
            <input type="text" class="dialog__form-input" id="floors-number" name="floorsNumber">
          </div>
          <div class="dialog__form-item">
            <label for="entrance-number" class="dialog__input-label">Количество подъездов</label>
            <input type="text" class="dialog__form-input" id="entrance-number" name="entranceNumber">
          </div>
          <button class="dialog__form-submit-bt" type="submit">Продолжить</button>
        </form>
        </div>
      </div>
    </div>`;

  body.insertAdjacentHTML("beforeend", html);
  const dialog = document.querySelector(".dialog");
  const exitBt = dialog.querySelector(".dialog__exit");
  const form = dialog.querySelector(".dialog__form");
  exitBt.onclick = () => {
    body.querySelector(".background")?.remove();
    dialog.remove();
  };
  form.onsubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    for (var key of formData.keys()) {
      console.log(`${key} - ${formData.get(key)}`);
    }

    exitBt.onclick();
  };
};
