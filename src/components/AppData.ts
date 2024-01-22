import {Model} from "./base/Model";
import {IProduct, IAppState, IOrder} from "../types/index";

export type CatalogChangeEvent = {
  catalog: ProductItem[]
};

export class ProductItem extends Model<IProduct> {
  id: string; 
  title: string; 
  price: number | null; 
  description?: string; 
  category?: string; 
  image?: string;

}

export class AppState extends Model<IAppState> {
  catalog: IProduct [];
  basketList: IProduct [] = [];
  preview: string | null;
  order: IOrder | null;

  getTotal() {
    return this.basketList.length;
  }

  getTotalPrice(): number {
    const totalPrice = this.basketList.reduce((sum, item) => sum + item.price, 0)
    return totalPrice; 
  }

  setCatalog(items: IProduct[]) {
    this.catalog = items.map(item => new ProductItem(item, this.events));
    this.emitChanges('items:changed', { catalog: this.catalog });
  }

  setPreview(item: ProductItem) {
    this.preview = item.id;
    this.emitChanges('preview:changed', item);
  }

  addBasketList(item: IProduct) {
    this.basketList = [item, ...this.basketList];
  }

  getBasketList(): IProduct[] {
    return this.basketList
}

changeBasketList(card: IProduct) {
  
  this.basketList = this.basketList.filter(item => item.id !== card.id);
  console.log(this.basketList);
      // return this.basketList
      // .filter(item => item.id !== id);
}

}
