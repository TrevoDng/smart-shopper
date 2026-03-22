
export interface ProductModel {
  id: string;
  type: string;
  brand: string;
  title: string; //model must be chnaged to title
  description: string;
  price: string;
  currency?: string;
  size?: string;
  imgSrc: string[];
  longDescription: string;
}


 export interface ProductCategory {
  type: string;
  icon: string;
  title: string;
  typeId: number;
  models: ProductModel[];
}