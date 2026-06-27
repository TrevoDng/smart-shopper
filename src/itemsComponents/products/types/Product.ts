// src/itemsComponents/products/types/Product.ts

export interface Size {
  code: string;
  name: string;
  quantity: number;
  type: "string" | "number";
}

export interface Product {
  id: string;
  category: string[];
  brand: string;
  title: string;
  description: string;
  price: string;
  currency?: string;
  sizes: Size[];
  imgSrc: string[];
  longDescription: string;
}