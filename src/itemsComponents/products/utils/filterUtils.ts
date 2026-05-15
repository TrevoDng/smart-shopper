//src/itemsComponents/products/utils/filterUtils.ts
import { Product } from "../types/Product";

// Get unique brands from products
export const getUniqueBrands = (products: Product[]): string[] => {
  if (!products || products.length === 0) return [];
  const allBrands = products
    .map(product => product.brand)
    .filter(brand => brand && brand.trim() !== "") // Filter out null/undefined/empty
    .map(brand => brand.toLowerCase());
  return Array.from(new Set(allBrands));
}

// Get all unique full category paths from products (e.g., "electronics/computers")
export const getUniqueCategoryPaths = (products: Product[]): string[] => {
  if (!products || products.length === 0) return [];
  const allCategories = products.flatMap(product => product.category);
  return Array.from(new Set(allCategories.filter(cat => cat && cat.trim() !== "")));
}

// Get unique main categories (before slash)
export const getUniqueMainCategories = (products: Product[]): string[] => {
  if (!products || products.length === 0) return [];
  const mainCategories = products
    .map(product => {
      if (Array.isArray(product.category) && product.category.length > 0) {
        return product.category[0].split('/')[0];
      }
      return null;
    })
    .filter((cat): cat is string => cat !== null && cat.trim() !== "");
  return Array.from(new Set(mainCategories));
}

// Get unique subcategories for a specific main category
export const getSubCategoriesByMainCategory = (products: Product[], mainCategory: string): string[] => {
  if (!products || products.length === 0 || !mainCategory) return [];
  const subCategories = products
    .filter(product => {
      if (Array.isArray(product.category) && product.category.length > 0) {
        const [mainCat] = product.category[0].split('/');
        return mainCat === mainCategory;
      }
      return false;
    })
    .map(product => {
      const [, subCat] = product.category[0].split('/');
      return subCat;
    })
    .filter((subCat): subCat is string => subCat !== null && subCat !== undefined);
  return Array.from(new Set(subCategories));
}

// Get unique categories for display (for backward compatibility)
export const getUniqueCategories = (products: Product[]): string[] => {
  if (!products || products.length === 0) return [];
  // Return subcategory names for display
  const subCategories = products
    .flatMap(product => product.category)
    .map(cat => {
      const parts = cat.split('/');
      return parts[1] || parts[0]; // Return subcategory or main if no sub
    })
    .filter(cat => cat && cat.trim() !== "");
  return Array.from(new Set(subCategories));
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

// Main filter function - applies all filters correctly
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
  
  // Apply category filter - checks if product category matches any selected full path
  if (selectedCategories && selectedCategories.length > 0) {
    filteredProducts = filteredProducts.filter(product => {
      if (!Array.isArray(product.category)) return false;
      // Check if any of the product's categories matches any selected category
      return product.category.some(cat => 
        selectedCategories.some(selectedCat => 
          cat.toLowerCase() === selectedCat.toLowerCase()
        )
      );
    });
  }
  
  // Apply brand filter
  if (selectedBrands && selectedBrands.length > 0) {
    filteredProducts = filteredProducts.filter(product => {
      if (!product.brand) return false;
      return selectedBrands.some(brand => 
        product.brand.toLowerCase() === brand.toLowerCase()
      );
    });
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

// Get filtered products by main category (for top navigation)
export const getProductsByMainCategory = (
  products: Product[],
  mainCategory: string | null
): Product[] => {
  if (!products || products.length === 0) return [];
  if (!mainCategory) return getAllProducts(products);
  
  return products.filter(product => {
    if (Array.isArray(product.category) && product.category.length > 0) {
      const productMainCategory = product.category[0].split('/')[0];
      return productMainCategory === mainCategory;
    }
    return false;
  });
};

export const filterProductsByMainCategory = (
  products: Product[],
  mainCategory: string | null,
): Product[] => {
  if (!products || products.length === 0) return [];
  if (!mainCategory) return getAllProducts(products);

  return products.filter(product => {
    if (Array.isArray(product.category) && product.category.length > 0) {
      return product.category.some(cat => 
        cat.toLowerCase().startsWith(mainCategory.toLowerCase() + '/')
      );
    }

    return false;
  });
}

// Get all products
export const getAllProducts = (products: Product[]): Product[] => {
  if (!products || products.length === 0) return [];
  return products;
};

// Clean price - remove currency symbols and convert to number
export const cleanPrice = (price: string | number): number => {
  if (typeof price === 'number') return price;
  if (!price) return 0;
  // Remove any non-numeric characters except decimal point and minus sign
  const cleaned = String(price).replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

// Get searched products
export const getSearchedProducts = (searchedResults: Product[]): Product[] => {
  return getAllProducts(searchedResults);
};

// Get price range for products
export const getPriceRange = (products: Product[]): { min: number; max: number } => {
  if (!products || products.length === 0) return { min: 0, max: 10000 };
  
  const prices = products.map(product => cleanPrice(product.price));
  return {
    min: Math.min(...prices),
    max: Math.max(...prices)
  };
};

// Get products count by category
export const getProductCountByCategory = (products: Product[], categoryPath: string): number => {
  if (!products || products.length === 0) return 0;
  return products.filter(product => 
    Array.isArray(product.category) && product.category.includes(categoryPath)
  ).length;
};

// Get products count by brand
export const getProductCountByBrand = (products: Product[], brand: string): number => {
  if (!products || products.length === 0) return 0;
  return products.filter(product => 
    product.brand && product.brand.toLowerCase() === brand.toLowerCase()
  ).length;
};