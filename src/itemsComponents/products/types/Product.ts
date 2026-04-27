// src/itemsComponents/products/types/Product.ts
export interface Product {
  id: string;
  category: string[];
  brand: string;
  title: string;
  description: string;
  price: string;
  currency?: string;
  size?: string;
  imgSrc: string[];
  longDescription: string;
}