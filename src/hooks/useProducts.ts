// Remove the discount fetch useEffect from ProductPage.tsx entirely
// Add this to useProducts.ts instead:

// src/hooks/useProducts.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { productsApi, Product } from '../services/productsApi';
import { discountApi } from '../services/discountApi';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [discounts, setDiscounts] = useState<{ [key: string]: any }>({});
  const discountsFetchedRef = useRef(false);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await productsApi.getPublicApprovedProducts();
      setProducts(response.products);
      
      // Fetch discounts once after products load
      if (!discountsFetchedRef.current && response.products.length > 0) {
        discountsFetchedRef.current = true;
        const productIds = response.products.map(p => p.id);
        const discountData = await discountApi.getProductsDiscounts(productIds);
        setDiscounts(discountData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return { products, loading, error, refresh: loadProducts, discounts };
};