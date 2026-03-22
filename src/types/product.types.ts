// Product types
export interface ProductFormData {
  type: string;
  brand: string;
  title: string;
  description: string;
  price: string;
  size?: string;
  longDescription: string;
}

export interface Product extends ProductFormData {
  id: number;
  typeId: number;
  status: 'pending' | 'approved' | 'rejected' | 'active';
  createdAt: string;
  imgSrc: string[];
}

export interface ProductModel {
  id: number;
  type_id: number;
  type: string;
  category: string;
  brand: string;
  title: string;
  description: string;
  price: string;
  size: string | null;
  long_description: string;
  status: string;
  images: string[] | null;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface ProductSubmitResponse {
  id: number;
  message: string;
  status: string;
}