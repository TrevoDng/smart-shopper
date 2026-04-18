// src/services/enquiriesApi.ts
import { getToken } from '../account/context/AuthContext';

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

export interface Enquiry {
  id: string;
  subject: string;
  message: string;
  status: 'pending' | 'in_progress' | 'resolved';
  createdById: string;
  createdByName: string;
  createdByEmail: string;
  createdByRole: 'ADMIN' | 'EMPLOYEE' | 'CLIENT';
  resolvedAt?: string;
  resolvedBy?: string;
  resolutionNote?: string;
  createdAt: string;
  updatedAt: string;
}

class EnquiriesApi {
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

  async getEnquiries(): Promise<{ enquiries: Enquiry[] }> {
    const response = await fetch(`${API_BASE}/enquiries`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async createEnquiry(subject: string, message: string): Promise<{ enquiry: Enquiry }> {
    const response = await fetch(`${API_BASE}/enquiries`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ subject, message }),
    });
    return this.handleResponse(response);
  }

  async resolveEnquiry(id: string, note?: string): Promise<{ enquiry: Enquiry }> {
    const response = await fetch(`${API_BASE}/enquiries/${id}/resolve`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ note }),
    });
    return this.handleResponse(response);
  }
}

export const enquiriesApi = new EnquiriesApi();