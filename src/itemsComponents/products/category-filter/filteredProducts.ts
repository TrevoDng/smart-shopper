import { Product } from "../types/Product";

export const getFilteredProducts = (datas: Product[], category: string[]): Product[]=> {
    return datas.filter(product => Array.isArray(product.category) && product.category.includes(category[0]));
}