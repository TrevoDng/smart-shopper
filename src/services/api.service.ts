// src/services/api.service.ts
// ✅ Auto-detect API URL - no hardcoded ports!
// Uses window.location.origin to get current domain
const getApiBaseUrl = (): string => {
    // If in production, use the same domain with /api
    if (window.location.hostname !== 'localhost' && 
        window.location.hostname !== '127.0.0.1') {
        return `${window.location.origin}/api`;
    }
    
    // Development: use environment variable or default
    return process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';
};

const API_BASE_URL = getApiBaseUrl();

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        "Origin": window.location.origin,
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  async payfastInitiate(data: any) {
    return this.request('/payfast/initiate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async yocoCreatePayment(data: any) {
    return this.request('/yoco/create-payment', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async ozowInitiate(data: any) {
    return this.request('/ozow/initiate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

    async checkPaymentStatus(orderId: string) {
    return this.request(`/payments/status/${orderId}`, {
      method: 'GET',
    });
  }
}

export const api = new ApiService();