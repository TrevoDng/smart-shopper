//src/itemsComponents/products/utils/filterUtils.ts
import { ProductCategory, ProductModel } from "../types/Product";
import { ProductTypes } from "./ProductTypes";

//get unique brand
const getUniqueBrands=(categories: ProductCategory[]): string[]=> {
    if (!categories || categories.length === 0) return [];
    
    const allBrands = categories.flatMap(category => 
        category.models?.map(model => model.brand) || []);
    
    return Array.from(new Set(allBrands.filter(brand => brand && brand.trim() !== "")));
}

//get all unique types from categories
const getUniqueTypes =(categories: ProductCategory[]): string[]=> {
    if (!categories || categories.length === 0) return [];
    return Array.from(new Set(categories.map(category => category.type)));
}

//Filter products by type
export const filterProductsByType = (
    categories: ProductCategory[],
    selectedTypes: string[],
    selectedBrands: string[],
    priceRange: [number, number]
): ProductModel[]=> {
    if (!categories || categories.length === 0) return [];
    if (selectedTypes?.length === 0) return [];

    const [minPrice, maxPrice] = priceRange;
    
    return categories.filter(category => 
         selectedTypes?.includes(category.type.toLowerCase()))
         .flatMap(category => category.models || [])
         .filter(product => {
            const price = cleanPrice(product.price);
            const brandMatch = selectedBrands.length > 0 ? selectedBrands?.includes(product.brand.toLowerCase()) : true;
            const priceMatch = price >= minPrice && price <= maxPrice;
            return brandMatch && priceMatch;
         });
};

export const filterProductsByBrand=(
    categories: ProductCategory[],
    selectedBrands: string[],
    priceRange: [number, number]
): ProductModel[]=> {
    if (!categories || categories.length === 0) return [];
    if (selectedBrands?.length === 0) return [];

    const [minPrice, maxPrice] = priceRange; 
    const allProducts = getAllProducts(categories);
    return allProducts.filter(product => 
         selectedBrands?.includes(product.brand.toLowerCase()))
         .filter(product => {
            const price = cleanPrice(product.price);
            return price >= minPrice && price <= maxPrice;
         });
};

export const filterProductsByPrice=(
    categories: ProductCategory[],
    priceRange: [number, number]
): ProductModel[]=> {
    if (!categories || categories.length === 0) return [];
    
    const [minPrice, maxPrice] = priceRange;
    return getAllProducts(categories).filter(product => {
        const price = cleanPrice(product.price);
        return price >= minPrice && price <= maxPrice;
    });
}

export const applyMultipleFilters = (
    categories: ProductCategory[],
    filters?: {
        selectedTypes: string[];
        selectedBrands: string[];
        priceRange: [number, number];
    }
): ProductModel[] => {
    if (!categories || categories.length === 0) return [];

    // If no filters, return all products
    if (!filters) return getAllProducts(categories);
    
    const { selectedTypes, selectedBrands, priceRange } = filters;
    
    // Start with all products
    let filteredProducts = getAllProducts(categories);
    
    // Apply type filter
    if (selectedTypes && selectedTypes.length > 0) {
        filteredProducts = filteredProducts.filter(product => 
            selectedTypes.includes(product.type.toLowerCase())
        );
    }
    
    // Apply brand filter
    if (selectedBrands && selectedBrands.length > 0) {
        filteredProducts = filteredProducts.filter(product => 
            selectedBrands.includes(product.brand.toLowerCase())
        );
    }
    
    // Apply price filter
    if (priceRange) {
        const [minPrice, maxPrice] = priceRange;
        filteredProducts = filteredProducts.filter(product => {
            const price = cleanPrice(product.price);
            return price >= minPrice && price <= maxPrice;
        });
    }
    
    return filteredProducts;
};

export const getAllProducts = (categories: ProductCategory[]): ProductModel[] => {
    if (!categories || categories.length === 0) return [];
    return categories.flatMap(category => category.models || []);
};

export const cleanPrice = (price: string | number): number => {
    if (typeof price === 'number') return price;
    if (!price) return 0;
    return parseInt(String(price).replace(/,/g, ''), 10) || 0;
};

export const getSearchedProducts = (
    searchedResults: ProductCategory[]
): ProductModel[] => {
    return getAllProducts(searchedResults);
};