// src/services/discountApi.ts
import { getToken } from '../account/context/AuthContext';

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

export interface Discount {
  id: string;
  productId: string;
  discountAmount: number;
  createdBy: string;
  createdByName: string;
  createdByEmail: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  startDate: string;
  endDate: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  product?: {
    id: string;
    title: string;
    brand: string;
    price: number;
    mainType: string;
  };
}

export interface DiscountWithCalculated extends Discount {
  discountedPrice?: number;
}

export interface DiscountsResponse {
  discounts: Discount[];
  total: number;
  limit: number;
  offset: number;
}

class DiscountApi {
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
    
    return data.data || data;
  }

  // ==================== PUBLIC METHODS ====================

  // Get discount for a single product
  async getProductDiscount(productId: string): Promise<Discount | null> {
    try {
      const response = await fetch(`${API_BASE}/discounts/public/product/${productId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      const data = await response.json();
      return data.data || data;
    } catch (error) {
      return null;
    }
  }

  // Get discounts for multiple products (for listing pages)
  async getProductsDiscounts(productIds: string[]): Promise<{ [key: string]: Discount }> {
    if (productIds.length === 0) return {};
    
    const response = await fetch(`${API_BASE}/discounts/public/products/batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productIds }),
    });
    
    return this.handleResponse<{ [key: string]: Discount }>(response);
  }

  // ==================== PROTECTED METHODS ====================

  // Create discount
  async createDiscount(data: {
    productId: string;
    discountAmount: number;
    startDate: string;
    endDate: string;
  }): Promise<Discount> {
    const response = await fetch(`${API_BASE}/discounts`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    
    return this.handleResponse<Discount>(response);
  }

  // Get my discounts
  async getMyDiscounts(status?: string, limit: number = 100, offset: number = 0): Promise<DiscountsResponse> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    params.append('limit', limit.toString());
    params.append('offset', offset.toString());
    
    const response = await fetch(`${API_BASE}/discounts/my-discounts?${params}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    
    return this.handleResponse<DiscountsResponse>(response);
  }

  // Update discount
  async updateDiscount(discountId: string, data: {
    discountAmount?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<Discount> {
    const response = await fetch(`${API_BASE}/discounts/${discountId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    
    return this.handleResponse<Discount>(response);
  }

  // Delete discount
  async deleteDiscount(discountId: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE}/discounts/${discountId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    
    return this.handleResponse<{ message: string }>(response);
  }

  // ==================== ADMIN METHODS ====================

  // Get pending discounts
  async getPendingDiscounts(limit: number = 100, offset: number = 0): Promise<DiscountsResponse> {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    params.append('offset', offset.toString());
    
    const response = await fetch(`${API_BASE}/discounts/admin/pending?${params}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    
    return this.handleResponse<DiscountsResponse>(response);
  }

  // Get all discounts
  async getAllDiscounts(status?: string, productId?: string, limit: number = 100, offset: number = 0): Promise<DiscountsResponse> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (productId) params.append('productId', productId);
    params.append('limit', limit.toString());
    params.append('offset', offset.toString());
    
    const response = await fetch(`${API_BASE}/discounts/admin/all?${params}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    
    return this.handleResponse<DiscountsResponse>(response);
  }

  // Approve discount
  async approveDiscount(discountId: string): Promise<Discount> {
    const response = await fetch(`${API_BASE}/discounts/admin/${discountId}/approve`, {
      method: 'POST',
      headers: this.getHeaders(),
    });
    
    return this.handleResponse<Discount>(response);
  }

  // Reject discount
  async rejectDiscount(discountId: string, reason?: string): Promise<Discount> {
    const response = await fetch(`${API_BASE}/discounts/admin/${discountId}/reject`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ reason }),
    });
    
    return this.handleResponse<Discount>(response);
  }
}

export const discountApi = new DiscountApi();