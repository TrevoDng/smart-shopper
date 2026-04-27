// src/hooks/useDiscounts.ts
import { useState, useCallback } from 'react';
import { discountApi, Discount } from '../services/discountApi';

export const useDiscounts = () => {
  const [discounts, setDiscounts] = useState<{ [key: string]: Discount }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDiscounts = useCallback(async (productIds: string[]) => {
    if (!productIds || productIds.length === 0) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await discountApi.getProductsDiscounts(productIds);
      setDiscounts(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch discounts');
    } finally {
      setLoading(false);
    }
  }, []);

  const getDiscountedPrice = useCallback((productId: string, originalPrice: number) => {
    const discount = discounts[productId];
    if (!discount || discount.status !== 'approved') return null;
    
    // Check if discount is still valid
    const now = new Date();
    const startDate = new Date(discount.startDate);
    const endDate = new Date(discount.endDate);
    
    if (now < startDate || now > endDate) return null;
    
    const discountAmount = discount.discountAmount;
    const discountedPrice = originalPrice * (1 - discountAmount / 100);
    
    return {
      discountedPrice: Math.round(discountedPrice * 100) / 100,
      discountAmount,
    };
  }, [discounts]);

  return {
    discounts,
    loading,
    error,
    fetchDiscounts,
    getDiscountedPrice,
  };
};