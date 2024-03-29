import {Model} from "./base/Model";
import {IProduct, IAppState, IOrder, IOrderForm, FormErrors} from "../types/index";

export class AppState extends Model<IAppState> {
  catalog: IProduct [];
  basketList: IProduct [] = [];
  preview: string | null;
  order: IOrder = {
    payment: 'card',
    address: '',
    email: '',
    phone: '',
    total: 0,
    items: []
  };
  formErrors: FormErrors = {};
  buttonName: 'Купить' | 'Убрать';

  getButtonName(value: string): string {
    if (this.basketList.some(obj => obj.title === value)) {
        this.buttonName = 'Убрать';
      } else {
        this.buttonName = 'Купить';
      }
    return this.buttonName;
  }

  getTotal() {
    return this.basketList.length;
  }

  getTotalPrice() {
    const totalPrice = this.basketList.reduce((sum, item) => sum + item.price, 0)
    return totalPrice; 
  }

  setCatalog(items: IProduct[]) {
    this.catalog = items;
    this.emitChanges('items:changed', this.catalog);
  }

  setPreview(item: IProduct) {
    this.preview = item.id;
    this.emitChanges('preview:changed', item);
  }

  clearBasket() {
    this.basketList = [];
  }

  addBasketList(item: IProduct) {
    this.basketList = [item, ...this.basketList];
  }

  getBasketList(): IProduct[] {
    return this.basketList
  }

  changeBasketList(id: string) {
    this.basketList = this.basketList.filter(item => item.id !== id);
  }

  setOrderItems() {
    this.order.items = this.basketList.map(item => item.id);
    this.order.total = this.getTotalPrice();
  }

  setOrderField(field: keyof IOrderForm, value: string) {
    this.order[field] = value;

    if (this.validateOrder()) {
      this.events.emit('order:ready', this.order);
    }
  }

  setContactsField(field: keyof IOrderForm, value: string) {
    this.order[field] = value;

    if (this.validateContacts()) {
      this.events.emit('contacts:ready', this.order);
    }
  }

  validateOrder() {
      const errors: typeof this.formErrors = {};
      if (!this.order.address) {
        errors.address = 'Необходимо указать адрес';
      }
      
      this.formErrors = errors;
      this.events.emit('formOrderErrors:change', this.formErrors);
      return Object.keys(errors).length === 0;
  }

  validateContacts() {
    const errors: typeof this.formErrors = {};
    
    if (!this.order.email) {
        errors.email = 'Необходимо указать email';
    }

    if (!this.order.phone) {
        errors.phone = 'Необходимо указать телефон';
    }

    this.formErrors = errors;
    this.events.emit('formContactsErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
  }
}

