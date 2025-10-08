
export interface ProductModel {
  id: string;
  type: string;
  model: string;
  description: string;
  price: string;
  size: string;
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