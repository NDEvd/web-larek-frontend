export interface IProduct {
  id: string; 
  title: string; 
  price: number | null; 
  description?: string; 
  category?: string; 
  image?: string;
}

export interface ICard {
    index: number;
    title: string; 
    price: string; 
    description: string; 
    category: string; 
    image: string;
    button: string;
  }
  
export interface IAppState {
  catalog: IProduct [];
  basketList: IProduct [];
  preview: string | null;
  order: IOrder | null;
  loading: boolean;
}

export interface IOrderForm {
  payment?: string,
  address?: string,
  email?: string,
  phone?: string,
  total?: number | string,
};
  
export interface IOrder extends IOrderForm {
  items: IProduct[]
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;