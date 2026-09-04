# ✨ vAssist

> UserScript-помічник для онлайн-тестів (**Naurok**, **Vseosvita**, **Classtime**).

---

## Можливості

Розширення наразі підтримує **три платформи**:

### Naurok

- Скопіювати поточне запитання тесту
- Скопіювати усі запитання тесту

### Classtime

- Скопіювати поточне запитання тесту
- Скопіювати усі запитання тесту

### Vseosvita

- Скопіювати поточне запитання тесту
- Прибирає необхідність повноекранного режиму при проходженні тесту

---

## Зміст

- [Можливості](#можливості)
- [Встановлення](#встановлення)
- [Як користуватися](#як-користуватися)
- [Якщо щось не працює](#якщо-щось-не-працює)
- [Баги та пропозиції](#баги-та-пропозиції)
- [Дисклеймер](#дисклеймер)
- [Ліцензія](#ліцензія)

---

## 💻 Встановлення

> Натисни на потрібний пункт

<details>
<summary><strong>💻 Комп’ютер: Chrome / Edge</strong></summary>

<br>

### Крок 1. Встанови Tampermonkey

1. Відкрий магазин розширень:
   - **Chrome:** [Tampermonkey у Chrome Web Store](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   - **Edge:** [Tampermonkey у Microsoft Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)
2. Натисни **«Додати в Chrome»** / **«Отримати»**.
3. Підтверди встановлення.

Перевірка: біля адресного рядка має з’явитися іконка Tampermonkey.

### Крок 2. Додай скрипт vAssist

1. Відкрий файл [`vAssist.user.js`](./vAssist.user.js) у цьому репозиторії.
2. Натисни кнопку **Raw** (праворуч зверху).
3. Скопіюй **весь** текст (`Ctrl+A` → `Ctrl+C`).
4. Іконка **Tampermonkey** → **«Створити новий скрипт…»** / **Create a new script**.
5. Видали все, що там є за замовчуванням.
6. Вставь код (`Ctrl+V`).
7. Збережи: `Ctrl+S` або **Файл → Зберегти**.

> Якщо відкрити **Raw**-посилання на `.user.js` у браузері з Tampermonkey, інколи з’являється кнопка **Install** автоматично.

### Крок 3. Дозволь роботу на сайтах

1. Відкрий, наприклад, [classtime.com](https://www.classtime.com).
2. Якщо браузер / Tampermonkey спитає дозвіл — натисни **Дозволити**.
3. Онови сторінку (`F5`).

Готово: унизу справа має з’явитися меню **vAssist**.

</details>

<details>
<summary><strong>🦊 Комп’ютер: Firefox</strong></summary>

<br>

1. Встанови [Tampermonkey для Firefox](https://addons.mozilla.org/firefox/addon/tampermonkey/).
2. Відкрий [`vAssist.user.js`](./vAssist.user.js) → **Raw** → скопіюй увесь код.
3. Tampermonkey → **Create a new script** → вставь → збережи.
4. Відкрий сайт тесту й онови сторінку.

</details>

<details>
<summary><strong>📱 Android: Microsoft Edge</strong> <em>(рекомендовано)</em></summary>

<br>

1. Встанови **Microsoft Edge** з Google Play і онови до останньої версії.
2. Відкрий Edge → меню **⋯** → **Розширення** / **Extensions**.
3. Знайди й встанови **Tampermonkey**.
4. Якщо просить увімкнути **Developer mode** — увімкни (інакше скрипти можуть не запускатися).
5. Відкрий [`vAssist.user.js`](./vAssist.user.js) → **Raw** → скопіюй увесь код.
6. Tampermonkey → **Create a new script** → вставь → збережи.
7. Зайди на сайт тесту **в Edge** і онови сторінку.

</details>

<details>
<summary><strong>📱 Android: Firefox</strong></summary>

<br>

1. Встанови **Firefox** з Google Play.
2. Додай [Tampermonkey](https://addons.mozilla.org/android/addon/tampermonkey/).
3. Відкрий [`vAssist.user.js`](./vAssist.user.js) → **Raw** → скопіюй код.
4. Tampermonkey → **Create a new script** → вставь → збережи.
5. Користуйся тестами **в тому ж Firefox**.

</details>

<details>
<summary><strong>📱 Android: Kiwi Browser</strong></summary>

<br>

1. Встанови **Kiwi Browser**.
2. Додай [Tampermonkey з Chrome Web Store](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo).
3. Вставь скрипт [`vAssist.user.js`](./vAssist.user.js) так само, як на ПК.
4. Користуйся тестами **в Kiwi**, не в звичайному Chrome.

> Звичайний **Google Chrome** на Android розширення майже не підтримує.

</details>

<details>
<summary><strong>🍎 iPhone / iPad: Userscripts (Safari)</strong></summary>

<br>

На iOS звичайний Chrome / Safari **без додаткового застосунку** скрипти не запускають.

1. Встанови з App Store **Userscripts** / **Userscripts**.
2. **Налаштування iPhone → Safari → Розширення**.
3. Увімкни Userscripts і дозволь доступ до сайтів (краще «Усі вебсайти» для тестів).
4. У застосунку додай новий скрипт і вставь код з [`vAssist.user.js`](./vAssist.user.js).
5. Збережи.
6. Відкрий тест у **Safari** і онови сторінку.

</details>

<details>
<summary><strong>🍎 iPhone / iPad: Orion Browser</strong></summary>

<br>

1. Встанови **Orion Browser**.
2. Додай підтримку розширень / Tampermonkey у налаштуваннях Orion.
3. Вставь скрипт [`vAssist.user.js`](./vAssist.user.js).
4. Відкрий тест у Orion.

> Якщо меню не з’являється — перевір, що розширення увімкнене для потрібного сайту.

</details>

---

## Як користуватися

1. Відкрий тест на підтримуваному сайті.
2. У правому нижньому куті з’явиться темне меню **vAssist**.
3. Натисни:
   - **Скопіювати питання** — поточне питання в буфер обміну
   - **Скопіювати увесь тест** — усі питання (де можливо)
4. **Сховати** — тимчасово ховає меню (кнопка «Показати меню» поверне його).
5. **Прибрати** — вимикає меню до перезавантаження сторінки.

---

## Якщо щось не працює

<details>
<summary><strong>Не бачу меню</strong></summary>

<br>

- Tampermonkey / Userscripts **увімкнений**
- Скрипт **Enabled** (не вимкнений)
- Ти на підтримуваному сайті
- Сторінку оновлено
- Спробуй вимкнути блокувальник реклами на цій вкладці

</details>

<details>
<summary><strong>«Не знайдено» / «Ще немає даних»</strong></summary>

<br>

- Почни або дочекайся завантаження тесту
- Зачекай 1–2 секунди і спробуй знову

</details>

<details>
<summary><strong>Android: Chrome / Edge проблеми</strong></summary>

<br>

- У звичайному **Chrome** часто **не працює** → бери **Edge**, **Firefox** або **Kiwi**
- У **Edge**: перевір Tampermonkey + **Developer mode**, онови сторінку

</details>

<details>
<summary><strong>iPhone: відкриваю в Chrome</strong></summary>

<br>

Для Userscripts потрібен **Safari**. Або користуйся **Orion**.

</details>

<details>
<summary><strong>Після оновлення скрипта нічого не змінилось</strong></summary>

<br>

1. Відкрий Tampermonkey
2. Знайди **vAssist**
3. Заміни код на новий з [`vAssist.user.js`](./vAssist.user.js)
4. Збережи і онови сторінку тесту

</details>

---

## Баги та пропозиції

Знайшов баг або маєш ідею — відкрий **Issue** або надішли **Pull Request**.

---

## ⚠️ Дисклеймер

Цей проєкт створено **виключно для освітніх цілей**.  
Використовуй на власний розсуд і відповідальність. Автор не несе відповідальності за наслідки використання.

---

## Ліцензія

Проєкт поширюється під ліцензією **[MIT](./LICENSE)**.
