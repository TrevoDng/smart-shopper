// src/itemsComponents/products/category-filter/filteredProducts.ts
import { Product } from "../types/Product";

export const getFilteredProducts = (datas: Product[], category: string[]): Product[] => {
    if (!category.length) return datas;
    
    const categoryValue = category[0];
    // Check if we have a full path (contains slash) or just main category
    const isMainCategoryOnly = !categoryValue.includes('/');
    
    if (isMainCategoryOnly) {
        // Filter products whose category starts with the main category
        return datas.filter(product => 
            Array.isArray(product.category) && 
            product.category.length > 0 &&
            product.category[0].startsWith(categoryValue + '/')
        );
    } else {
        // Original behavior - exact match
        return datas.filter(product => 
            Array.isArray(product.category) && 
            product.category.includes(categoryValue)
        );
    }
}