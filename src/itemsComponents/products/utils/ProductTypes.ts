import { ProductCategory, ProductModel } from "../types/Product";


// settign Productcategory[] and ProductModel[]
export type ProductTypes =(
    categories: ProductCategory[],
    selectedTypes?: string[],
    selectedBrands?: string[],
    priceRange?: [number , number],
    // filters?: {
    //     selectedTypes?: string[];
    //     selectedBrands?: string[];
    //     priceRange?: [number, number];
    // }
)=> ProductModel[];
