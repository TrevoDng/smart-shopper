import { Product } from "../types/Product";

export const getUniqueBrands=(products: Product[]): string[] => {
    const allBrands = products.flatMap(product => product.brand) || [];
    return Array.from(new Set(allBrands.filter(brand => brand)));
}
    //[...new Set(products.map(product  => product.models))].filter(brand => brand); 