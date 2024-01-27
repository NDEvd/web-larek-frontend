import {Form} from "./common/Form";
import {IOrderForm} from "../types";
import {IEvents} from "./base/events";
import {ensureElement} from "../utils/utils";

export class Order extends Form<IOrderForm> {
  protected _buttonsCard: HTMLButtonElement;
  protected _buttonsCash: HTMLButtonElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this._buttonsCard = ensureElement<HTMLButtonElement>('#card', container);
    this._buttonsCash = ensureElement<HTMLButtonElement>('#cash', container);

    this._buttonsCard.addEventListener('click', () => {
      this._buttonsCard.classList.add('button_alt-active');
      this._buttonsCash.classList.remove('button_alt-active');
      events.emit('card:click');
    });
                   

    this._buttonsCash.addEventListener('click', () => {
      this._buttonsCard.classList.remove('button_alt-active');
      this._buttonsCash.classList.add('button_alt-active');
      events.emit('cash:click');
    });
  }

  set address(value: string) {
    (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
  }
}