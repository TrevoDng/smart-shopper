// src/hooks/useImageUpload.ts
import { useState, useCallback } from 'react';
import { uploadMultipleProductImages, UploadOptions } from '../utils/imageUpload';

interface UseImageUploadReturn {
  images: File[];
  previewUrls: string[];
  uploadedUrls: string[];
  isUploading: boolean;
  error: string | null;
  addImages: (files: FileList | null) => void;
  removeImage: (index: number) => void;
  clearImages: () => void;
  uploadImages: (options: UploadOptions) => Promise<string[]>;
  getImageCount: () => number;
  hasImages: boolean;
}

export const useImageUpload = (maxImages: number = 10): UseImageUploadReturn => {
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addImages = useCallback((fileList: FileList | null) => {
    if (!fileList) return;
    
    setError(null);
    
    const newFiles = Array.from(fileList);
    
    if (images.length + newFiles.length > maxImages) {
      setError(`You can only upload up to ${maxImages} images`);
      return;
    }
    
    const validFiles: File[] = [];
    
    for (const file of newFiles) {
      if (!file.type.startsWith('image/')) {
        setError(`${file.name} is not an image`);
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError(`${file.name} is larger than 5MB`);
        continue;
      }
      validFiles.push(file);
    }
    
    if (validFiles.length === 0) return;
    
    setImages(prev => [...prev, ...validFiles]);
    
    const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  }, [images.length, maxImages]);

  const removeImage = useCallback((index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    // Revoke object URL to avoid memory leaks
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    // Also remove from uploaded URLs if it was already uploaded
    setUploadedUrls(prev => prev.filter((_, i) => i !== index));
  }, [previewUrls]);

  const clearImages = useCallback(() => {
    // Revoke all object URLs to avoid memory leaks
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    setImages([]);
    setPreviewUrls([]);
    setUploadedUrls([]);
    setError(null);
  }, [previewUrls]);

  const uploadImages = useCallback(async (options: UploadOptions): Promise<string[]> => {
    if (images.length === 0) {
      setError('No images to upload');
      return [];
    }

    setIsUploading(true);
    setError(null);

    try {
      const urls = await uploadMultipleProductImages(images, options);
      
      if (urls.length === 0) {
        throw new Error('Failed to upload images');
      }
      
      setUploadedUrls(urls);
      return urls;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      return [];
    } finally {
      setIsUploading(false);
    }
  }, [images]);

  const getImageCount = useCallback(() => {
    return images.length;
  }, [images.length]);

  const hasImages = images.length > 0;

  return {
    images,
    previewUrls,
    uploadedUrls,
    isUploading,
    error,
    addImages,
    removeImage,
    clearImages,
    uploadImages,
    getImageCount,
    hasImages
  };
};