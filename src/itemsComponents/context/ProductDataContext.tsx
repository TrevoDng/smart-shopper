// src/context/ProductDataContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';
import { useAdaptedProducts } from '../../hooks/useAdaptedProducts';
import { ProductCategory } from '../../itemsComponents/products/types/Product';

interface ProductDataContextType {
  categories: ProductCategory[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  searchProducts: (query: string) => Promise<ProductCategory[]>;
}

const ProductDataContext = createContext<ProductDataContextType | undefined>(undefined);

export const useProductData = () => {
  const context = useContext(ProductDataContext);
  if (!context) {
    throw new Error('useProductData must be used within ProductDataProvider');
  }
  return context;
};

interface ProductDataProviderProps {
  children: ReactNode;
}

export const ProductDataProvider: React.FC<ProductDataProviderProps> = ({ children }) => {
  const { categories, products, loading, error, refresh, searchProducts: searchProductsApi } = useAdaptedProducts();

  // Convert ProductModel[] to ProductCategory[] format
  const productCategories = React.useMemo(() => {
    if (categories.length > 0) {
      return categories; // Already in ProductCategory format
    }
    return [];
  }, [categories]);

  // Search function that returns ProductCategory[]
  const searchProducts = async (query: string): Promise<ProductCategory[]> => {
    const results = await searchProductsApi(query);
    if (results.length === 0) return [];
    
    // Group search results by type/category
    const categoryMap = new Map<string, ProductCategory>();
    results.forEach(product => {
      if (!categoryMap.has(product.type)) {
        categoryMap.set(product.type, {
          type: product.type,
          icon: '', // Will be set by the component
          title: product.type,
          typeId: categoryMap.size + 1,
          models: []
        });
      }
      categoryMap.get(product.type)!.models.push(product);
    });
    
    return Array.from(categoryMap.values());
  };

  return (
    <ProductDataContext.Provider
      value={{
        categories: productCategories,
        loading,
        error,
        refresh,
        searchProducts,
      }}
    >
      {children}
    </ProductDataContext.Provider>
  );
};