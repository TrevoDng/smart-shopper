// src/hooks/useAdaptedProducts.ts
import { useState, useEffect, useCallback } from 'react';
import { productAdapter } from '../services/productAdapter';
import { ProductCategory, ProductModel } from '../itemsComponents/products/types/Product';

interface UseAdaptedProductsReturn {
  categories: ProductCategory[];
  products: ProductModel[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  searchProducts: (query: string) => Promise<ProductModel[]>;
  getProductsByType: (type: string) => Promise<ProductModel[]>;
}

export const useAdaptedProducts = (): UseAdaptedProductsReturn => {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [allProducts, productCategories] = await Promise.all([
        productAdapter.fetchApprovedProducts(),
        productAdapter.getProductCategories()
      ]);
      
      setProducts(allProducts);
      setCategories(productCategories);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    productAdapter.clearCache();
    await loadProducts();
  }, [loadProducts]);

  const searchProducts = useCallback(async (query: string) => {
    return productAdapter.searchProducts(query);
  }, []);

  const getProductsByType = useCallback(async (type: string) => {
    return productAdapter.getProductsByType(type);
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return {
    categories,
    products,
    loading,
    error,
    refresh,
    searchProducts,
    getProductsByType
  };
};