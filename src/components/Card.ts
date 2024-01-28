import {Component} from "./base/Component";
import {ICard} from "../types";
import {ensureElement} from "../utils/utils";

interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

export class Card extends Component<ICard> {
  protected _category?: HTMLElement;
  protected _title: HTMLElement;
  protected _image?: HTMLImageElement;
  protected _price: HTMLElement;

  constructor(protected blockName: string, container: HTMLElement) {
    super(container);
        
    this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
    this._price = ensureElement<HTMLImageElement>(`.${blockName}__price`, container);
  }

  set id(value: string) {
    this.container.dataset.id = value;
  }

  get id(): string {
    return this.container.dataset.id || '';
  }

  set title(value: string) {
    this.setText(this._title, value);
  }

  get title(): string {
    return this._title.textContent || '';
  }

  set image(value: string) {
    this.setImage(this._image, value, this.title)
  }

  set price(value: string) {
    this.setText(this._price, value)
  }

  set category(value: string) {
    this.setText(this._category, value)
  }
}

export class CardCatalodItem extends Card {
  protected _category?: HTMLElement;
  protected _image?: HTMLImageElement;

  constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
    super(blockName, container);

    this._category = ensureElement<HTMLElement>(`.${blockName}__category`, container);
    this._image = ensureElement<HTMLImageElement>(`.${blockName}__image`, container);
        
    container.addEventListener('click', actions.onClick);
  }
}

export class CardPreview extends Card {
  protected _button: HTMLButtonElement;
  protected _description: HTMLElement;
  protected _image: HTMLImageElement;

  constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
    super(blockName, container);

    this._description = ensureElement<HTMLElement>(`.${blockName}__text`, container);
    this._button = container.querySelector(`.${blockName}__button`);
    this._image = ensureElement<HTMLImageElement>(`.${blockName}__image`, container);
  

    if (actions?.onClick) {
      if (this._button) {
        this._button.addEventListener('click', actions.onClick);
      } else {
        container.addEventListener('click', actions.onClick);
      }
    }
  }

  set description(value: string) {
    this.setText(this._description, value);
  }

  set button(value: string) {
    this.setText(this._button, value);
  }
}

export class CardListItem extends Card {
  protected _button?: HTMLButtonElement;
  protected _index: HTMLElement;
    
  constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
    super(blockName, container);

    this._button = container.querySelector(`.${blockName}__button`);
    this._index = ensureElement<HTMLElement>('.basket__item-index', container);
      
    this._button.addEventListener('click', actions.onClick);
  }

  set index(indexItem: string) {
    this._index.textContent = indexItem;
  }     
}
