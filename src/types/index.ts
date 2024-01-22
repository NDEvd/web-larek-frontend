export interface IProduct { 
  id: string; 
  title: string; 
  price: number | null; 
  description?: string; 
  category?: string; 
  image?: string;
}
  
export interface IAppState {
  catalog: IProduct [];
  basketList: IProduct [];
  // basket: string[];
  preview: string | null;
  order: IOrder | null;
}
  
export interface IOrderForm {
  paymentMethod: boolean;
  address: string;
  email: string;
  phone: string;
  }
  
export interface IOrder extends IOrderForm {
  items: string[]
}
  
export type FormErrors = Partial<Record<keyof IOrder, string>>;
  