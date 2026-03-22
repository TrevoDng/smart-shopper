import { ProductCategory, ProductModel } from "../types/Product";
import { ProductTypes } from "./ProductTypes";

//get unique brand
const getUniqueBrands=(categories: ProductCategory[]): string[]=> {
    const allBrands = categories.flatMap(category => 
        category.models.map(model => model.brand));
    
        return Array.from(new Set(allBrands.filter(brand => brand && brand.trim() !=="")));
}


//get all unique types from categories
const getUniqueTypes =(categories: ProductCategory[]): string[]=> {
    return Array.from(new Set(categories.map(category => category.type)));
}

//Filter products by type
export const filterProductsByType = (
    categories: ProductCategory[],
    selectedTypes: string[],
    selectedBrands: string[],
    priceRange: [number, number]
): ProductModel[]=> {
    if (selectedTypes?.length === 0) return [];

    const [minPrice, maxPrice] = priceRange;
    
    return categories.filter(category => 
         selectedTypes?.includes(category.type.toLowerCase()))
         .flatMap(category => category.models)
         .filter(product => 
            selectedBrands.length > 0 ? selectedBrands?.includes(product.brand.toLowerCase()) && 
            cleanPrice(product.price) >= minPrice && cleanPrice(product.price) <= maxPrice 
            : cleanPrice(product.price) >= minPrice && cleanPrice(product.price) <= maxPrice);
            //Math.trunc(Number(product.price)) >= minPrice 
            //&& Math.trunc(Number(product.price)) <= maxPrice);

    // return categories.filter(category => 
    //     selectedTypes?.includes(category.type))
    //     .flatMap(category => category.models);
    };


export const filterProductsByBrand=(
    categories: ProductCategory[],
    selectedBrands: string[],
    priceRange: [number, number]
): ProductModel[]=> {
    if (selectedBrands?.length === 0) return [];

    const [minPrice, maxPrice] = priceRange; 
        const allProducts = getAllProducts(categories);
        return allProducts.filter(product => 
             selectedBrands?.includes(product.brand.toLowerCase()))
             .filter(prices => 
               cleanPrice(prices.price) >= minPrice && cleanPrice(prices.price) <= maxPrice);
               // Math.trunc(Number(prices.price)) >= minPrice && Math.trunc(Number(prices.price)) <= maxPrice);
        
                // return allProducts.filter(product => 
        //     selectedBrands?.includes(product.brand));
};

export const filterProductsByPrice=(
    categories: ProductCategory[],
    priceRange: [number, number]
): ProductModel[]=> {
    const allProducts = getAllProducts(categories);

    //if(!priceRange) return allProducts; 

    const [minPrice, maxPrice] = priceRange;
    return getAllProducts(categories).filter(product => 
        cleanPrice(product.price) >= minPrice && cleanPrice(product.price) <= maxPrice
        //Math.trunc(Number(product.price)) >= minPrice && Math.trunc(Number(product.price)) <= maxPrice
    );
}

export const applyMultipleFilters=(
     categories: ProductCategory[],
     filters?: {
        selectedTypes: string[];
        selectedBrands: string[];
        priceRange: [number, number];
    }
): ProductModel[]=> {
    let filterdProducts = getAllProducts(categories);

    if(!filters) return filterdProducts;

    //apply type filter
    if (filters.selectedTypes && filters.selectedTypes.length > 0) {
        return filterProductsByType(categories, filters.selectedTypes, filters.selectedBrands, filters.priceRange);

        /*filterdProducts.filter(product => 
             filters.selectedTypes.includes(product.type)
        );*/
    }

        //apply brand filter
    if (filters.selectedBrands && filters.selectedBrands.length > 0) {
        return filterProductsByBrand(categories, filters.selectedBrands, filters.priceRange); /*filterdProducts.filter(product => 
            filters.selectedBrands.includes(product.brand)
        );*/
    }

    //apply price filter
    if (filters.priceRange) {
        //const [minPrice, maxPrice] = filters.priceRange;
        return filterProductsByPrice(categories, filters.priceRange); 
        
        /*filterdProducts.filter(product => 
            parseInt(product.price) >= minPrice && parseInt(product.price) <= maxPrice
        );*/
    }
        

     console.log("filters: ", JSON.stringify(filterdProducts));

    return filterdProducts;
}

export const getAllProducts=(categories: ProductCategory[]): ProductModel[]=> {
    return categories.flatMap(category => category.models);
}

export const cleanPrice=(price: string)=> {
    return parseInt(price.replace(/,/g, ''), 10) || 0;
}

export const getSearchedProducts=(
    searchedResults: ProductCategory[]
): ProductModel[]=> {
    return getAllProducts(searchedResults);
}