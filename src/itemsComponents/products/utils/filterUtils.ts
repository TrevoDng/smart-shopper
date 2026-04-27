//src/itemsComponents/products/utils/filterUtils.ts
import { Product } from "../types/Product";

// Get unique brands
export const getUniqueBrands = (products: Product[]): string[] => {
  if (!products || products.length === 0) return [];
  const allBrands = products
    .map(product => product.brand)
    .filter(brand => brand && brand.trim() !== "") // Filter out null/undefined/empty
    .map(brand => brand.toLowerCase());
  return Array.from(new Set(allBrands));
}

// Get all unique categories from products
export const getUniqueCategories = (products: Product[]): string[] => {
  if (!products || products.length === 0) return [];
  const allCategories = products.flatMap(product => product.category);
  return Array.from(new Set(allCategories.filter(cat => cat && cat.trim() !== "")));
}

// Filter products by category
export const filterProductsByCategory = (
  products: Product[],
  selectedCategory: string[],
  selectedBrands: string[],
  priceRange: [number, number]
): Product[] => {
  if (!products || products.length === 0) return [];
  if (selectedCategory?.length === 0) return [];

  const [minPrice, maxPrice] = priceRange;
  
  return products.filter(product => 
    selectedCategory.some(cat => product.category.includes(cat)))
    .filter(product => {
      const price = cleanPrice(product.price);
      const brandMatch = selectedBrands.length > 0 ? selectedBrands.includes(product.brand.toLowerCase()) : true;
      const priceMatch = price >= minPrice && price <= maxPrice;
      return brandMatch && priceMatch;
    });
};

export const filterProductsByBrand = (
  products: Product[],
  selectedBrands: string[],
  priceRange: [number, number]
): Product[] => {
  if (!products || products.length === 0) return [];
  if (selectedBrands?.length === 0) return [];

  const [minPrice, maxPrice] = priceRange;
  return getAllProducts(products).filter(product => 
    selectedBrands.includes(product.brand.toLowerCase()))
    .filter(product => {
      const price = cleanPrice(product.price);
      return price >= minPrice && price <= maxPrice;
    });
};

export const filterProductsByPrice = (
  products: Product[],
  priceRange: [number, number]
): Product[] => {
  if (!products || products.length === 0) return [];
  
  const [minPrice, maxPrice] = priceRange;
  return getAllProducts(products).filter(product => {
    const price = cleanPrice(product.price);
    return price >= minPrice && price <= maxPrice;
  });
}

export const applyMultipleFilters = (
  products: Product[],
  filters?: {
    selectedCategories: string[];
    selectedBrands: string[];
    priceRange: [number, number];
  }
): Product[] => {
  if (!products || products.length === 0) return [];

  if (!filters) return getAllProducts(products);
  
  const { selectedCategories, selectedBrands, priceRange } = filters;
  
  let filteredProducts = getAllProducts(products);
  
  // Apply category filter (checks if any product category matches)
  if (selectedCategories && selectedCategories.length > 0) {
    filteredProducts = filteredProducts.filter(product => 
      product.category.some(cat => selectedCategories.includes(cat.toLowerCase()))
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

export const getAllProducts = (products: Product[]): Product[] => {
  if (!products || products.length === 0) return [];
  return products;
};

export const cleanPrice = (price: string | number): number => {
  if (typeof price === 'number') return price;
  if (!price) return 0;
  return parseFloat(String(price).replace(/,/g, '')) || 0;
};

export const getSearchedProducts = (searchedResults: Product[]): Product[] => {
  return getAllProducts(searchedResults);
};