// src/services/productsApi.ts
import { getToken } from '../account/context/AuthContext';

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

export interface Product {
  id: string;
  mainType: string;
  subType: string;
  brand: string;
  title: string;
  description: string;
  longDescription: string;
  price: number;
  stockQuantity: number;
  imgSrc: string[];
  status: 'pending' | 'approved' | 'rejected' | 'deactivated';
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  approvedBy?: string;
  approvedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  limit: number;
  offset: number;
}

class ProductsApi {
  private getHeaders(): HeadersInit {
    const token = getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || data.error?.message || 'Request failed');
    }
    
    // Handle wrapped response
    return data.data || data;
  }

  // Get all products for the current employee
  async getMyProducts(status?: string, limit: number = 50, offset: number = 0): Promise<ProductsResponse> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    params.append('limit', limit.toString());
    params.append('offset', offset.toString());
    
    const response = await fetch(`${API_BASE}/products/my-products?${params}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    
    return this.handleResponse<ProductsResponse>(response);
  }

  // Get product by ID
  async getProductById(productId: string): Promise<Product> {
    const response = await fetch(`${API_BASE}/products/${productId}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    
    return this.handleResponse<Product>(response);
  }

  // Create new product
  async createProduct(productData: Partial<Product>): Promise<Product> {
    const response = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(productData),
    });
    
    return this.handleResponse<Product>(response);
  }

  // Update product
  async updateProduct(productId: string, productData: Partial<Product>): Promise<Product> {
    const response = await fetch(`${API_BASE}/products/${productId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(productData),
    });
    
    return this.handleResponse<Product>(response);
  }

  // Get all products (admin only) or filtered by status
async getAllProducts(status?: string, limit: number = 100, offset: number = 0): Promise<ProductsResponse> {
  const params = new URLSearchParams();
  if (status) params.append('status', status);
  params.append('limit', limit.toString());
  params.append('offset', offset.toString());
  
  const response = await fetch(`${API_BASE}/products/admin/all?${params}`, {
    method: 'GET',
    headers: this.getHeaders(),
  });
  
  return this.handleResponse<ProductsResponse>(response);
}

  // Delete product
  async deleteProduct(productId: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE}/products/${productId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    
    return this.handleResponse<{ message: string }>(response);
  }

  // Get product statistics for employee
  async getProductStats(): Promise<{
    total: number;
    approved: number;
    pending: number;
    rejected: number;
    outOfStock: number;
  }> {
    const [allProducts, approvedProducts, pendingProducts, rejectedProducts] = await Promise.all([
      this.getMyProducts(),
      this.getMyProducts('approved'),
      this.getMyProducts('pending'),
      this.getMyProducts('rejected'),
    ]);

    return {
      total: allProducts.total,
      approved: approvedProducts.total,
      pending: pendingProducts.total,
      rejected: rejectedProducts.total,
      outOfStock: allProducts.products.filter(p => p.stockQuantity === 0).length,
    };
  }
}

export const productsApi = new ProductsApi();