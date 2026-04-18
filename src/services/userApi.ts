// src/services/userApi.ts
import { getToken } from '../account/context/AuthContext';
import { User as BaseUser } from '../account/types/user';

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

// Extend BaseUser for API-specific needs (without exposing literal types to the main app)
export interface ApiUser extends BaseUser {
  role: string;
  status: string;
  approvedAt?: Date;
}

export interface UpdateUserProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
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
  async getCurrentUser(): Promise<ApiUser> {
    const response = await fetch(`${API_BASE}/auth/me`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    
    return this.handleResponse<ApiUser>(response);
  }

  // Get user status
  async getUserStatus(): Promise<{ status: string; role: string; approvedAt?: Date }> {
    const user = await this.getCurrentUser();
    return {
      status: user.status,
      role: user.role,
      approvedAt: user.approvedAt,
    };
  }

  // Get user profile (alias for getCurrentUser)
  async getUserProfile(): Promise<{ success: boolean; data?: { user: ApiUser }; message?: string }> {
    try {
      const user = await this.getCurrentUser();
      return {
        success: true,
        data: { user },
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to fetch user profile',
      };
    }
  }

  // Update user profile
  async updateUserProfile(profileData: UpdateUserProfileData): Promise<{ success: boolean; data?: { user: ApiUser }; message?: string }> {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${API_BASE}/auth/update-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || data.error?.message || 'Failed to update profile');
      }
      
      const userData = data.data || data;
      return {
        success: true,
        data: { user: userData.user || userData },
        message: 'Profile updated successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'An error occurred while updating profile',
      };
    }
  }
}

// Export individual functions for convenience
export const getUserProfile = () => userApi.getUserProfile();
export const updateUserProfile = (data: UpdateUserProfileData) => userApi.updateUserProfile(data);
export const getCurrentUser = () => userApi.getCurrentUser();
export const getUserStatus = () => userApi.getUserStatus();

export const userApi = new UserApi();