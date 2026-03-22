import { ProductCategory, ProductModel } from "../types/Product";

export const getUniqueBrands=(products: ProductCategory[]): string[] => {
    const allBrands = products.flatMap(category=> category.models.map(product => product.brand));
    return Array.from(new Set(allBrands.filter(brand => brand)));
}
    //[...new Set(products.map(product  => product.models))].filter(brand => brand); 