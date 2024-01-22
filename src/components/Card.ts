import {Component} from "./base/Component";
import {IProduct} from "../types";
import {bem, createElement, ensureElement} from "../utils/utils";

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export interface ICard<T> {
  title: string; 
  price: number | string; 
  description?: string; 
  category?: string; 
  image?: string;
}

export class Card<T> extends Component<ICard<T>> {
    protected _category?: HTMLElement;
    protected _title: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _price?: HTMLElement;

    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
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

    // set description(value: string | string[]) {
    //     if (Array.isArray(value)) {
    //         this._description.replaceWith(...value.map(str => {
    //             const descTemplate = this._description.cloneNode() as HTMLElement;
    //             this.setText(descTemplate, str);
    //             return descTemplate;
    //         }));
    //     } else {
    //         this.setText(this._description, value);
    //     }
    // }
}

export class CardCatalodItem extends Card<HTMLElement> {
    protected _category?: HTMLElement;
    protected _image?: HTMLImageElement;

    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
        super(blockName, container, actions);

        this._category = ensureElement<HTMLElement>(`.${blockName}__category`, container);
        
        this._image = ensureElement<HTMLImageElement>(`.${blockName}__image`, container);
        
        container.addEventListener('click', actions.onClick);

       
    }
}

export class CardPreview extends Card<HTMLElement> {
    protected _button?: HTMLButtonElement;
    protected _description?: HTMLElement;
    protected _image?: HTMLImageElement;

    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
        super(blockName, container, actions);

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
}

export class CardListItem extends Card<HTMLElement> {
    protected _button?: HTMLButtonElement;

    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
        super(blockName, container, actions);

        this._button = container.querySelector(`.${blockName}__button`);
      
        this._button.addEventListener('click', () => {
            this.container.remove();
            
        });
          
        }
    }
