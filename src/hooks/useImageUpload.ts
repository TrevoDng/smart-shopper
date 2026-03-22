import { useState, useCallback } from 'react';
import { uploadMultipleProductImages } from '../utils/imageUpload';

interface UseImageUploadReturn {
  images: File[];
  previewUrls: string[];
  uploadedUrls: string[];
  isUploading: boolean;
  error: string | null;
  addImages: (files: FileList | null) => void;
  removeImage: (index: number) => void;
  clearImages: () => void;
  uploadToStorage: (productId: string) => Promise<string[]>;
}

export const useImageUpload = (maxImages: number = 5): UseImageUploadReturn => {
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
    
    const validFiles = newFiles.filter(file => {
      if (!file.type.startsWith('image/')) {
        setError(`${file.name} is not an image`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError(`${file.name} is larger than 5MB`);
        return false;
      }
      return true;
    });
    
    setImages(prev => [...prev, ...validFiles]);
    
    const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  }, [images.length, maxImages]);

  const removeImage = useCallback((index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    setUploadedUrls(prev => prev.filter((_, i) => i !== index));
  }, [previewUrls]);

  const clearImages = useCallback(() => {
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    setImages([]);
    setPreviewUrls([]);
    setUploadedUrls([]);
    setError(null);
  }, [previewUrls]);

  const uploadToStorage = useCallback(async (productId: string): Promise<string[]> => {
    if (images.length === 0) {
      return [];
    }

    setIsUploading(true);
    setError(null);

    try {
      const urls = await uploadMultipleProductImages(images, productId);
      setUploadedUrls(urls);
      return urls;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      return [];
    } finally {
      setIsUploading(false);
    }
  }, [images]);

  return {
    images,
    previewUrls,
    uploadedUrls,
    isUploading,
    error,
    addImages,
    removeImage,
    clearImages,
    uploadToStorage
  };
};