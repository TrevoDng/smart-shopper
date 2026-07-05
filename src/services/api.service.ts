// src/services/api.service.ts
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
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