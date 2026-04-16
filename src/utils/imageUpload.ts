// src/utils/imageUpload.ts

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
  fileName?: string;
  filePath?: string;
}

export interface UploadOptions {
  userId: string;
  productType: string;      // e.g., 'electronics'
  productSubType: string;   // e.g., 'computers'
  token: string; // JWT token for authentication
}

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

/**
 * Generate a unique filename for uploaded images
 */
export const generateFileName = (originalName: string, index: number): string => {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop() || 'jpg';
  const baseName = originalName.split('.').slice(0, -1).join('.').replace(/[^a-zA-Z0-9]/g, '_');
  
  return `${timestamp}_${randomStr}_${index}_${baseName.substring(0, 30)}.${extension}`;
};

/**
 * Upload a single image to the server
 * @param file - The image file to upload
 * @param options - Upload options with userId, productType, productSubType
 * @param index - Image index for ordering
 * @returns UploadResult with URL and metadata
 */
export const uploadProductImage = async (
  file: File,
  options: UploadOptions,
  index: number
): Promise<UploadResult> => {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      return { 
        success: false, 
        error: 'File must be an image' 
      };
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return { 
        success: false, 
        error: 'Image must be less than 5MB' 
      };
    }

    // Create form data
    const formData = new FormData();
    formData.append('image', file);
    formData.append('userId', options.userId);
    formData.append('productType', options.productType);
    formData.append('productSubType', options.productSubType);
    formData.append('index', index.toString());

    // Debug: Log FormData contents
console.log('FormData contents:');
for (let pair of formData.entries()) {
  console.log(pair[0], pair[1]);
}

    // Upload to server
    const response = await fetch(`${API_BASE}/upload/product-image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${options.token}`
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || data.error?.message || 'Upload failed'
      };
    }

    return {
      success: true,
      url: data.data.url,
      fileName: data.data.fileName,
      filePath: data.data.filePath
    };
  } catch (error) {
    console.error('Upload failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown upload error'
    };
  }
};

/**
 * Upload multiple images for a product
 * @param files - Array of image files
 * @param options - Upload options with userId, productType, productSubType
 * @returns Array of successful image URLs
 */
export const uploadMultipleProductImages = async (
  files: File[],
  options: UploadOptions
): Promise<string[]> => {
  const uploadPromises = files.map((file, index) => 
    uploadProductImage(file, options, index)
  );
  
  const results = await Promise.all(uploadPromises);
  
  // Filter successful uploads and return URLs
  const successfulUrls = results
    .filter((result): result is UploadResult & { url: string } => 
      result.success === true && result.url !== undefined
    )
    .map(result => result.url);
  
  const failures = results.filter(r => !r.success);
  if (failures.length > 0) {
    console.warn(`${failures.length} images failed to upload:`, failures);
  }
  
  return successfulUrls;
};

/**
 * Delete a product image from the server
 * @param imageUrl - The URL of the image to delete
 */
export const deleteProductImage = async (imageUrl: string, token: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE}/upload/product-image`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
       },
      body: JSON.stringify({ imageUrl }),
    });

    const data = await response.json();
    return response.ok && data.success;
  } catch (error) {
    console.error('Delete failed:', error);
    return false;
  }
};

/**
 * Delete all images for a product
 * @param imageUrls - Array of image URLs to delete
 */
export const deleteMultipleProductImages = async (imageUrls: string[], token: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE}/upload/product-images`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
       },
      body: JSON.stringify({ imageUrls }),
    });

    const data = await response.json();
    return response.ok && data.success;
  } catch (error) {
    console.error('Delete all failed:', error);
    return false;
  }
};