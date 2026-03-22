import { uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { productImageRef, productImagesFolderRef, tempImageRef, generateStorageFileName } from './firebaseReferences';
import { generateProductId } from './generateId';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
  fileName?: string;
  storagePath?: string;
}

/**
 * Upload a single image to Firebase Storage using flexible reference
 * @param file - The image file to upload
 * @param productId - The product ID (can be 'temp' for new products)
 * @param index - Image index for ordering
 * @returns UploadResult with URL and metadata
 */
export const uploadProductImage = async (
  file: File,
  productId: string,
  index: number
): Promise<UploadResult> => {
  try {
    // Validate file
    if (!file.type.startsWith('image/')) {
      return { 
        success: false, 
        error: 'File must be an image' 
      };
    }

    if (file.size > 5 * 1024 * 1024) {
      return { 
        success: false, 
        error: 'Image must be less than 5MB' 
      };
    }

    // Generate unique filename
    const fileName = generateStorageFileName(file.name, index);
    
    // Create storage reference using the flexible pattern
    // If productId is 'temp', store in temp folder; otherwise in products folder
    const storageRef = productId === 'temp' 
      ? tempImageRef(productId, fileName)
      : productImageRef(productId, fileName);
    
    // Upload file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return {
      success: true,
      url: downloadURL,
      fileName: fileName,
      storagePath: snapshot.ref.fullPath
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
 * Upload multiple images
 */
export const uploadMultipleProductImages = async (
  files: File[],
  productId: string
): Promise<string[]> => {
  const uploadPromises = files.map((file, index) => 
    uploadProductImage(file, productId, index)
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
 * Move images from temp folder to permanent product folder
 * Useful when product is created after images were uploaded
 */
export const moveTempImagesToProduct = async (
  tempId: string,
  productId: string,
  imageUrls: string[]
): Promise<string[]> => {
  // Note: Firebase Storage doesn't have a direct "move" operation
  // You would need to download and re-upload, or better: upload directly to final location
  // This function is a placeholder for the logic if you need it
  console.log(`Moving images from temp/${tempId} to products/${productId}`);
  return imageUrls; // Return the same URLs or new ones after moving
};

/**
 * Delete a product image from storage
 */
export const deleteProductImage = async (imageUrl: string): Promise<boolean> => {
  try {
    // Extract path from URL (you might need to parse it)
    // This is simplified - you'd need to get the reference from the URL
    console.log('Delete image:', imageUrl);
    return true;
  } catch (error) {
    console.error('Delete failed:', error);
    return false;
  }
};

/**
 * Delete all images for a product
 */
export const deleteAllProductImages = async (productId: string): Promise<boolean> => {
  try {
    const folderRef = productImagesFolderRef(productId);
    console.log('Delete all images in:', folderRef.fullPath);
    // Note: Firebase Storage doesn't have a bulk delete
    // You'd need to list and delete each file
    return true;
  } catch (error) {
    console.error('Delete all failed:', error);
    return false;
  }
};