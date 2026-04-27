// src/services/searchProducts.ts
import { productsApi } from './productsApi';
import { Product } from '../itemsComponents/products/types/Product';

export const searchProducts = async (query: string): Promise<Product[]> => {
  if (query.length < 2) return [];
  
  try {
    // Use existing API method
    const response = await productsApi.getPublicApprovedProducts(1000);
    const products = response.products;
    const searchTerm = query.toLowerCase().trim();
    
    // Filter products locally
    return products.filter(product => 
      product.title.toLowerCase().includes(searchTerm) ||
      product.brand.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.category?.some(cat => cat.toLowerCase().includes(searchTerm))
    ).map(product => ({
      ...product,
      price: String(product.price)
    }));
  } catch (error) {
    console.error('Search failed:', error);
    return [];
  }
};

// Optional: If you add server-side search endpoint later
export const searchProductsOnServer = async (query: string): Promise<Product[]> => {
  if (query.length < 2) return [];
  
  try {
    const params = new URLSearchParams({ q: query });
    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/public/products/search?${params}`);
    const result = await response.json();
    return result.data?.products || result.products || [];
  } catch (error) {
    console.error('Search failed:', error);
    return [];
  }
};