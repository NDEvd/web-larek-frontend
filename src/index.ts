import './scss/styles.scss';

import {AuctionAPI} from "./components/AuctionAPI";
import {API_URL, CDN_URL} from "./utils/constants";
import {EventEmitter} from "./components/base/events";
import {AppState, CatalogChangeEvent, ProductItem} from "./components/AppData";
import {Page} from "./components/Page";
import {CardPreview, CardListItem, CardCatalodItem} from "./components/Card";
import {cloneTemplate, createElement, ensureElement} from "./utils/utils";
import {Modal} from "./components/common/Modal";
import {Basket} from "./components/common/Basket";


const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardListItemTemplate = ensureElement<HTMLTemplateElement>('#card-basket');

const events = new EventEmitter();
const api = new AuctionAPI(CDN_URL, API_URL);

const appData = new AppState({}, events);

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const basket = new Basket(cloneTemplate(basketTemplate), events);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
  console.log(eventName, data);
})

api.getProducts()
    .then(appData.setCatalog.bind(appData))
    .catch(err => {
        console.error(err);
    });

events.on<CatalogChangeEvent>('items:changed', () => {
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

events.on('card:select', (item: ProductItem) => {
    appData.setPreview(item);
});

events.on('preview:changed', (item: ProductItem) => {
    
    const card = new CardPreview('card', cloneTemplate(cardPreviewTemplate), {
        onClick: () => {
            events.emit('modal:close', item);
            modal.close();
            appData.addBasketList({
                id: item.id,
                title: item.title,
                price: item.price,
            });
    
            page.counter = String(appData.basketList.length);
            events.emit('basket:changed');
        }
    });

    modal.render({
        content: card.render({
            category: item.category,
            title: item.title,
            image: item.image,
            price: item.price === null ? 'Бесценно' : `${item.price} синапсов`,
            description: item.description,
        })
    });
});

events.on('basket:open', () => {
       modal.render({
        content: basket.render()
    });
    console.log(appData.basketList);
    basket.total = `${appData.getTotalPrice()} синапсов`;
});

events.on('basket:close', () => {
    page.counter = String(appData.basketList.length);
    // console.log(appData.basketList);
});

events.on('basket:changed', () => {
    basket.items = appData.getBasketList().map(item => {
        const cardListItem = new CardListItem('card', cloneTemplate(cardListItemTemplate), {
            onClick: () => {
              appData.changeBasketList(item);
              cardListItemTemplate.remove();
              page.counter = String(appData.basketList.length);
        }
        });
        return cardListItem.render({
            title: item.title,
            price: item.price === null ? 'Бесценно' : `${item.price} синапсов`,
        });
    });

});    

events.on('modal:open', () => {
    page.locked = true;
});

events.on('modal:close', () => {
    page.locked = false;
});