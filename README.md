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

В проекте реализован паттерн MVP.
Тип Presenter (Представитель), который служит «прослойкой» между типами Model и View, предствлен классом EventEmitter.
Реализует паттерн «Наблюдатель» и позволяет подписываться на события и уведомлять подписчиков о наступлении события. А так же передавать актуальные данные в обработчик.

Имплементирует интерфес: interface IEvents {
on<T extends object>(event: EventName, callback: (data: T) => void): void;
emit<T extends object>(event: string, data?: T): void;
trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}

Поля:
o protected events: Map<string, Set<EventHandler>>

Методы:
• On – для подписки на событие
• Off – отписки от события
• emit - уведомления подписчиков о наступлении события соответственно
• onAll – для подписки на все события
• offAll – для сброса всех подписчиков
• trigger - генерирует заданное событие с заданными аргументами (коллбек триггер, генерирующий событие при вызове). Это позволяет передавать его в качестве обработчика события в другие классы. Эти классы будут генерировать события, не будучи при этом напрямую зависимыми от класса EventEmitter.
,
Тип Model (Модель), который отвечает за работу с данными (данные приходят с сервера, отправляются на сервер, помещаются в корзину), представлен классами Model, AppState, AuctionAPI.

Класс AppState
Класс для для работы с данными приложения (получение значения, запись значения, изменение данных):

Поля:
o catalog: IProduct [] – массив товаров, которые отображаются в каталоге
o basketList: IProduct [] – массив товаров, которые находятся в корзине
o preview: string | null – id товара, у которого открыто превью
o order: IOrder | null – массив данных первого этапа заказа
o contacts: IContacts | null - массив данных второго этапа заказа

Интерфейсы полей класса:

export interface IProduct {
id: string;
title: string;
price: number | null;
description?: string;
category?: string;
image?: string;
}

export interface IAppState {
catalog: IProduct [];
basketList: IProduct [];
preview: string | null;
order: IOrder | null;
contacts: IContacts | null;
}

export interface IOrderForm {
paymentMethod?: boolean;
address?: string;
}

export interface IContactsForm {
email?: string;
phone?: string;
}

export interface IOrder extends IOrderForm {
items: string[]
}

export interface IContacts extends IContactsForm {
items: string[]
}

Методы:
• getButtonName – определяет лэйбл кнопки на превью товара в зависимости от того, добавлен товар в корзину или нет
• getTotal – получает общее кол-во товаров в корзине
• getTotalPrice – получает общую стоимость товаров в корзине
• setCatalog(items: IProduct[]) – передает данные товаров для отрисовки каталога
• setPreview(item: ProductItem) – передает данные товара для отрисовки превью
• addBasketList(item: IProduct) – добавление товара в массив товаров корзины
• clearBasket – метод для удаления данных из массива товаров корзины
• getBasketList() – возвращает массив товаров, находящихся в корзине
• changeBasketList – метод для удаления товаров из массива (корзины)
• setOrderItems – добавляет товары из массива корзины в заказ
• setOrderField – добавляет значения инпутов формы заказа в объект заказа
• setContactsField – добавляет значения инпутов формы с контактными данными в объект заказа
• validateOrder – предназначен для получения сообщения об ошибке валидации для формы заказа
• validateContacts – предназначен для получения сообщения об ошибке валидации для формы с контактами

Класс Api
Реализует методы для работы с данными сервера.
Поля:
o readonly baseUrl: string;
o protected options: RequestInit;
Методы:
• protected handleResponse(response: Response): Promise<object> – метод реализации промиса
• get – получение данных
• post – отправка данных
• delete – удаление данных

Класс AuctionAPI extends Api
Кастомная реализация взаимодействия с сервером
Методы:
• getProduct() – получение карточек с сервера
• postOrder() – отправка данных по заказу

Тип View (Вид или представление), который отвечает за отрисовку компонентов приложения, представлен классом Component и его наследниками.

Класс Component
Абстрактный класс для отображения компонентов приложения: модального окна с карточкой, модального окна корзины и др.
Поля:
o protected readonly container: HTMLElement
В конструктор передается container – HTML элемент, который следует отрисовать

Методы:
• protected setText - Установить текстовое содержимое элемента
• setDisabled - Сменить статус блокировки кнопки
• protected setImage - Установить изображение с алтернативным текстом
• render - Возвращает корневой DOM-элемент для отрисовки

Класс Modal наследует класс Component
Отрисовывает открытие/закрытие всех модальных окон приложения
Поля:
o protected \_closeButton: HTMLButtonElement; На кнопку закрытия окна в конструкторе вешается слушатель клика с колбэком.
o protected \_content: HTMLElement;
В конструктор передается контейнер и событие.
Методы:
• set content(value: HTMLElement) – помещает контент в выбранный контейнер
• open()
• close()
• render(data: IModalData) - Возвращает корневой DOM-элемент для отрисовки

Класс Basket наследует класс Component
Отображает открытую корзину. Реализует возможность удаления товаров и переход к оформлению.
Поля:
o protected \_productTemplate;
o protected \_products: Map<string, Product>;
o protected \_storageKey: string;
В конструктор передается контейнер и событие. В конструкторе создается пустой массив для товаров, которые будут помещаться в карзину.

Методы:
• set items – наполняет содержимым корзину: товарами, либо информацией о том, что корзина пуста
• selected– блокирует кнопку, если корзина пустая
• set total– устанавливает общую стоимость товаров

Класс Form наследует класс Component
Предназначен для отображения элементов формы
Поля:
o protected \_submit: HTMLButtonElement;
o protected \_errors: HTMLElement;
В конструктор передается контейнер и событие. На кнопку submit вешается вызов обработчика события.

Методы:
• protected onInputChange – информирует об изменении значения инпута
• set valid(value: boolean) – устанавливает состояние кнопки (заблокирована или нет)
• set errors(value: string) – отображает информацию об ошибке валидации
• render(state) – отрисовывает форму

Класс Success наследует класс Component
Предназначен для отображения модального окно об информации об успешном заказе.
Поля:
o protected \_close: HTMLElement;
o protected \_total: HTMLElement;
В конструктор передается контейнер и действие при закрытии модального окна.
Методы:
• set total– устанавливает общую стоимость товаров

Класс Card наследует класс Component
Реализация отображения карточки товара: в каталоге, в модальном окне, в корзине

Поля:
o protected \_category?: HTMLElement;
o protected \_title: HTMLElement;
o protected \_image?: HTMLImageElement;
o protected \_price: HTMLElement;
В контейнер передается контейнер и имя блока.

Методы:
• set id
• get id
• set title
• get title
• set image
• set price
• set category

Класс Card наследуется классами:
CardCatalodItem – для отрисовки карточек товара в каталоге
CardPreview – для отрисовки превью товара. Название кнопки отрисовывается в зависимости от того, добавлен товар в корзину или нет.
CardListItem – для отрисовки товаров в модальном окне корзины с реализацией кнопки удаления товара.

Класс Page наследует класс Component
Реализует отображение основной страницы приложения.
Поля:
o protected \_counter: HTMLElement;
o protected \_catalog: HTMLElement;
o protected \_wrapper: HTMLElement;
o protected \_basket: HTMLElement;
В конструктор передается контейнер и событие. На корзину устанавливается слушатель события, который вызывает обработчик события – открытие модального окна с корзиной.

Методы:
• set counter – устанавливает кол-во товаров в корзине
• set catalog – наполняет каталог карточками товаров
• set locked – устанавливает блокировку прокрутки

Класс Order наследует класс Form
Поля:
o protected \_buttonsCard: HTMLButtonElement;
o protected \_buttonsCash: HTMLButtonElement;
В конструктор передается контейнер и событие. Устанавливаются обработчики кнопок выбора оплаты для смены стилей и вызова обработчика, который отвечает за запись способа оплаты в объект заказа.
Методы:
• set address

Класс Contacts наследует класс Form
В конструктор передается контейнер и событие.
Методы:
• set email
• set phone
