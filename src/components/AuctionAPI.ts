import { Api, ApiListResponse } from './base/api';
import {IProduct, IOrder} from "../types/index";

export interface IAuctionAPI {
  getProducts: () => Promise<IProduct[]>;
  postOrder: (order: IOrder) => Promise<IOrder>;  
}

export class AuctionAPI extends Api implements IAuctionAPI {
  readonly cdn: string;

  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
    this.cdn = cdn;
  }

  getProducts(): Promise<IProduct[]> {
    return this.get('/product').then((data: ApiListResponse<IProduct>) =>
      data.items.map((item) => ({
        ...item,
        image: this.cdn + item.image
      }))
    );
  }

  postOrder(order: IOrder): Promise<IOrder> {
    return this.post('/order', order).then(
      (data: IOrder) => data
    );
  }
}