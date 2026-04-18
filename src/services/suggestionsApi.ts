// src/services/suggestionsApi.ts
import { getToken } from '../account/context/AuthContext';

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

export interface Suggestion {
  id: string;
  title: string;
  content: string;
  status: 'pending' | 'under_review' | 'forwarded';
  createdById: string;
  createdByName: string;
  createdByEmail: string;
  createdByRole: 'ADMIN' | 'EMPLOYEE' | 'CLIENT';
  forwardedAt?: string;
  forwardedBy?: string;
  forwardedNote?: string;
  createdAt: string;
  updatedAt: string;
}

class SuggestionsApi {
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

  async getSuggestions(): Promise<{ suggestions: Suggestion[] }> {
    const response = await fetch(`${API_BASE}/suggestions`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async createSuggestion(title: string, content: string): Promise<{ suggestion: Suggestion }> {
    const response = await fetch(`${API_BASE}/suggestions`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ title, content }),
    });
    return this.handleResponse(response);
  }

  async forwardSuggestion(id: string, note?: string): Promise<{ suggestion: Suggestion }> {
    const response = await fetch(`${API_BASE}/suggestions/${id}/forward`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ note }),
    });
    return this.handleResponse(response);
  }
}

export const suggestionsApi = new SuggestionsApi();