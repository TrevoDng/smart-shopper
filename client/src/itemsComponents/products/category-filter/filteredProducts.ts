import { ProductCategory, ProductModel } from "../types/Product";

export const getFilteredProducts = (datas: ProductCategory[], type: string): ProductModel[]=> {
    const category = datas.find(category => category.type === type);
    return category ? category.models : [];
}