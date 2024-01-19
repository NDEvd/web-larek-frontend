# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

Базовые компоненты

1.Класс Component
Абстрактный класс для реализации отображения компонентов приложения: модального окна с карточкой, модального окна корзины и др.
Поля:
o protected readonly container: HTMLElement

Методы:
• toggleClass - Переключить класс
• protected setText - Установить текстовое содержимое
• setDisabled - Сменить статус блокировки
• protected setImage - Установить изображение с алтернативным текстом
• render - Вернуть корневой DOM-элемент

2.Класс Api
Реализует методы для работы с данными сервера.
Поля:
o readonly baseUrl: string;
o protected options: RequestInit;
Методы:
• protected handleResponse(response: Response): Promise<object> – метод реализации промиса
• get – получение данных
• post – отправка данных
• delete – удаление данных

3. Класс EventEmitter.
   Реализует паттерн «Наблюдатель» и позволяет подписываться на события и уведомлять подписчиков о наступлении события.
   Поля:
   o protected events: Map<string, Set<EventHandler>>
   Методы:
   • On – для подписки на событие
   • Off – отписки от события
   • emit - уведомления подписчиков о наступлении события соответственно
   • onAll – для подписки на все события
   • offAll – для сброса всех подписчиков
   • trigger - генерирует заданное событие с заданными аргументами (коллбек триггер, генерирующий событие при вызове). Это позволяет передавать его в качестве обработчика события в другие классы. Эти классы будут генерировать события, не будучи при этом напрямую зависимыми от класса EventEmitter.

Общие компоненты

1. Класс Modal extends Component
   Реализует открытие/закрытие модальных окон и их отрисовку.
   Поля:
   o protected \_closeButton: HTMLButtonElement;
   o protected \_content: HTMLElement;
   Методы:
   • set content(value: HTMLElement) – перемещает контент в выбранный контейнер
   • open()
   • close()
   • render(data: IModalData) - отрисовка модального окна
   • get total() – получение общей стоимости товара для вывода инфо об успешном оформлении заказа

2. Класс Basket extends Component
   Отображает открытую корзину. Реализует возможность удаления товаров и переход к оформлению.
   Поля:
   o protected \_productTemplate;
   o protected \_products;
   o protected \_storageKey;
   Методы:
   • save() – сохраняет инфо о товарах в localStorage
   • load() – отображает инфо из localStorage
   • removeProduct(id: string) – удаление товара
   • get total() – получение общей стоимости товара

3. Класс Form extends Component
   Отображает общие элементы формы, реализуют их функциональность
   Поля:
   o protected \_submit: HTMLButtonElement;
   o protected \_errors: HTMLElement;
   Методы:
   • protected onInputChange – информирует об изменении значения инпута
   • set valid(value: boolean) – устанавливает состояние кнопки (заблокирована или нет)
   • set errors(value: string) – отображает информацию об ошибке валидации
   • render(state) – отображает форму

4. Класс Success extends Component
   Предназначен для отображения модального окно об информации об успешном заказе.
   Поля:
   o protected \_close: HTMLElement;

Другие компоненты:

1. Класс Card extends Component
   Реализация отображения карточки товара: в каталоге, в модальном окне, в корзине

Поля:
o protected \_name: HTMLElement;
o protected \_price: HTMLElement;
o protected \_description?: HTMLElement;
o protected \_category?: HTMLElement;
o protected \_image?: HTMLElement;

Методы:
get id()
set name()
get name()
set price ()
get price ()
set description ()
set category ()
set image ()

2. Класс Page extends Component
   Реализует отображение основной страницы приложения.
   Поля:
   o protected \_counter: HTMLElement;
   o protected \_catalog: HTMLElement;
   o protected \_basket: HTMLElement;
   Методы:
   • set counter(value: number) – отображает кол-во товаров в корзине
   • setProducts(items: HTMLElement[]) – отображает полученные с сервера карточки товаров

3. Класс Order extends Form
   Поля:
   o \_selectButton: HTMLElement;

Методы:
• set paymentMethod (value: boolean) – метод для фиксации выбора способа оплаты
• set address(value: string) – установить адрес
• set email(value: string) – установить email
• set phone(value: string) – установить телефон

4. Класс AuctionAPI extends Api
   Кастомная реализация взаимодействия с сервером
   Методы:
   • getProduct() – получение карточек с сервера
