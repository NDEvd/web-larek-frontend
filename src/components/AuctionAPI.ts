import { Api, ApiListResponse } from './base/api';
import {IProduct} from "../types/index";

export interface IAuctionAPI {
  getProducts: () => Promise<IProduct[]>;
    
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
  }