// user.ts
export interface User {
  id: string;
  uid?: string; // Firebase user ID
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
  lastLogin?: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  confirmPassword: string;
}