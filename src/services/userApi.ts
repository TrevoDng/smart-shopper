// src/services/userApi.ts
 import { getToken } from '../account/context/AuthContext';

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'ADMIN' | 'EMPLOYEE' | 'CLIENT';
  status: 'pending_email' | 'email_verified' | 'pending_approval' | 'active' | 'rejected' | 'deactivated';
  createdAt: Date;
  approvedAt?: Date;
  lastLogin?: Date;
}

class UserApi {
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

  // Get current user info
  async getCurrentUser(): Promise<User> {
    const response = await fetch(`${API_BASE}/auth/me`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    
    return this.handleResponse<User>(response);
  }

  // Get user status (for checking approval status)
  async getUserStatus(): Promise<{ status: string; role: string; approvedAt?: Date }> {
    const user = await this.getCurrentUser();
    return {
      status: user.status,
      role: user.role,
      approvedAt: user.approvedAt,
    };
  }
}

export const userApi = new UserApi();