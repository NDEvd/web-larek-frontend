import './scss/styles.scss';

import {AuctionAPI} from "./components/AuctionAPI";
import {API_URL, CDN_URL} from "./utils/constants";
import {EventEmitter} from "./components/base/events";
import {AppState} from "./components/AppData";
import {Page} from "./components/Page";
import {CardPreview, CardListItem, CardCatalodItem} from "./components/Card";
import {cloneTemplate, ensureElement} from "./utils/utils";
import {Modal} from "./components/common/Modal";
import {Basket} from "./components/common/Basket";
import {IProduct, IOrderForm} from './types';
import {Order} from "./components/Order";
import {Contacts} from './components/Contacts';
import {Success} from './components/common/Success';

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardListItemTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const events = new EventEmitter();
const api = new AuctionAPI(CDN_URL, API_URL);

const appData = new AppState({}, events);

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);

api.getProducts()
  .then(appData.setCatalog.bind(appData))
  .catch(err => {
    console.error(err);
  });

events.on('items:changed', () => {
  page.catalog = appData.catalog.map(item => {
    const card = new CardCatalodItem('card', cloneTemplate(cardCatalogTemplate), {
      onClick: () => events.emit('card:select', item)
    });

    return card.render({
      category: item.category,
      title: item.title,
      image: item.image,
      price: item.price === null ? 'Бесценно' : `${item.price} синапсов`,
    });
  });
});

events.on('card:select', (item: IProduct) => {
  appData.setPreview(item);
});

events.on('counter:changed', () => {
  page.counter = String(appData.basketList.length);
});

events.on('preview:changed', (item: IProduct) => {
    
  const card = new CardPreview('card', cloneTemplate(cardPreviewTemplate), {
    onClick: () => {
      events.emit('modal:close', item);

      if (appData.buttonName === 'Купить') {
        appData.addBasketList({
          id: item.id,
          title: item.title,
          price: item.price,
        });
        events.emit('counter:changed');
        events.emit('basket:changed');
        card.button = appData.getButtonName(item.title);
        } else {
          appData.changeBasketList(item.id);
          events.emit('counter:changed');
          events.emit('basket:changed');
          card.button = appData.getButtonName(item.title);
        }
    }
  });

  modal.render({
    content: card.render({
      category: item.category,
      title: item.title,
      image: item.image,
      price: item.price === null ? 'Бесценно' : `${item.price} синапсов`,
      description: item.description,
      button: appData.getButtonName(item.title),
    })
  });
});


events.on('basket:open', () => {
  modal.render({
    content: basket.render()
  });
  basket.total = `${appData.getTotalPrice()} синапсов`;
});

events.on('item:remove', (item: IProduct) => {
  appData.changeBasketList(item.id);
  events.emit('basket:changed');
  events.emit('counter:changed');
  basket.total = `${appData.getTotalPrice()} синапсов`;
});

events.on('basket:changed', () => {
  basket.items = appData.getBasketList().map(item => {
    const cardListItem = new CardListItem('card', cloneTemplate(cardListItemTemplate), {
      onClick: () => events.emit('item:remove', item)
    });
    cardListItem.index = String(appData.basketList.indexOf(item) + 1);

      return cardListItem.render({
        title: item.title,
        price: item.price === null ? 'Бесценно' : `${item.price} синапсов`,
      });       
  });
}); 

events.on('formOrderErrors:change', (errors: Partial<IOrderForm>) => {
  const { address } = errors;
  order.valid = !address;
  order.errors = Object.values({ address }).filter(i => !!i).join('; ');
});

events.on('formContactsErrors:change', (errors: Partial<IOrderForm>) => {
  const { email, phone } = errors;
  contacts.valid = !email && !phone;
  contacts.errors = Object.values({ phone, email }).filter(i => !!i).join('; ');
});

events.on(/^order\..*:change/, (data: { field: keyof IOrderForm, value: string }) => {
  appData.setOrderField(data.field, data.value);
});

events.on(/^contacts\..*:change/, (data: { field: keyof IOrderForm, value: string }) => {
  appData.setContactsField(data.field, data.value);
});

events.on('card:click', () => {
  appData.order.payment = 'card';
})

events.on('cash:click', () => {
  appData.order.payment = 'cash';
})

events.on('order:open', () => {
  appData.setOrderItems();
  modal.render({
    content: order.render({
      payment: '',
      address: '',
      valid: false,
      errors: []
    })
  });
});

events.on('contacts:open', () => {
  modal.render({
    content: contacts.render({
      email: '',
      phone: '',
      valid: false,
      errors: []
    })
  });
});

events.on('order:submit', () => {
  events.emit('contacts:open');
});

events.on('contacts:submit', () => {
  api.postOrder(appData.order)
  .then((result) => {
    
    const success = new Success(cloneTemplate(successTemplate), {
      onClick: () => {
        modal.close();
        appData.clearBasket();
        events.emit('counter:changed');
        events.emit('basket:changed');
      }
    });
  
    modal.render({
      content: success.render({})
      });
      success.total = `Списано ${appData.getTotalPrice()} синапсов`;
  })
  .catch(err => {
    console.error(err);
  });
});

events.on('modal:open', () => {
  page.locked = true;
});

events.on('modal:close', () => {
  page.locked = false;
});