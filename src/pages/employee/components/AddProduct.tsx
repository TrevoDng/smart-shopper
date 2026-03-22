import React, { useState, FormEvent, ChangeEvent } from 'react';
import { auth } from '../../../firebase';
//import { getAuth } from 'firebase/auth';
import { useImageUpload } from '../../../hooks/useImageUpload';
import { generateProductId } from '../../../utils/generateId';
import { createFirestoreDoc, productsCollection } from '../../../utils/firebaseReferences';
import { setDoc, serverTimestamp } from 'firebase/firestore';
import './AddProduct.css';
import { useSlider } from '../../../slider/slidercontext/SliderContext';

interface ProductFormData {
  type: string;
  brand: string;
  title: string;
  description: string;
  price: string;
  size?: string;
  longDescription: string;
}

const AddProduct: React.FC = () => {
  const [formData, setFormData] = useState<ProductFormData>({
    type: 'laptops',
    brand: '',
    title: '',
    description: '',
    price: '',
    size: '',
    longDescription: ''
  });

  const {
    previewUrls,
    isUploading,
    error: uploadError,
    addImages,
    removeImage,
    uploadToStorage,
    clearImages
  } = useImageUpload(5);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

      const {hideSlider} = useSlider();
        hideSlider();

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    addImages(e.target.files);
    e.target.value = '';
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSuccessMessage(null);

    try {
      // Step 1: Generate a unique product ID
      const productId = generateProductId();
      console.log('Generated product ID:', productId);

      // Step 2: Upload images using the generated product ID
      console.log('Uploading images...');
      const imageUrls = await uploadToStorage(productId);
      
      if (imageUrls.length === 0) {
        throw new Error('Please upload at least one image');
      }

      // Step 3: Get auth token
      //const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error('You must be logged in');
      }
      
      const token = await user.getIdToken();

      // Step 4: Save product to backend API (which will save to PostgreSQL)
      // Or save directly to Firestore using your flexible reference pattern
      const response = await fetch('/api/employee/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: productId, // Send the generated ID to backend
          ...formData,
          imgSrc: imageUrls,
          price: parseFloat(formData.price)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit product');
      }

      // Alternative: Save directly to Firestore (if you prefer)
      // const productDocRef = createFirestoreDoc('products', productId);
      // await setDoc(productDocRef, {
      //   id: productId,
      //   ...formData,
      //   imgSrc: imageUrls,
      //   price: parseFloat(formData.price),
      //   status: 'pending',
      //   createdBy: user.uid,
      //   createdAt: serverTimestamp()
      // });

      setSuccessMessage(`Product submitted for approval! Product ID: ${productId}`);
      
      // Reset form
      setFormData({
        type: 'laptops',
        brand: '',
        title: '',
        description: '',
        price: '',
        size: '',
        longDescription: ''
      });
      clearImages();

    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Submission failed');
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const productTypes = ['laptops', 'phones', 'tablets', 'accessories'];

  return (
    <div className="add-product-container">
      <h1>Add New Product</h1>
      
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      
      {(submitError || uploadError) && (
        <div className="error-message">
          {submitError || uploadError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label htmlFor="type">Product Type *</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            required
            disabled={isSubmitting || isUploading}
          >
            {productTypes.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="brand">Brand *</label>
          <input
            type="text"
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={handleInputChange}
            required
            disabled={isSubmitting || isUploading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="title">Product Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            disabled={isSubmitting || isUploading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Price ($) *</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            required
            min="0"
            step="0.01"
            disabled={isSubmitting || isUploading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="size">Size (optional)</label>
          <input
            type="text"
            id="size"
            name="size"
            value={formData.size}
            onChange={handleInputChange}
            disabled={isSubmitting || isUploading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Short Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows={3}
            disabled={isSubmitting || isUploading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="longDescription">Detailed Description *</label>
          <textarea
            id="longDescription"
            name="longDescription"
            value={formData.longDescription}
            onChange={handleInputChange}
            required
            rows={6}
            disabled={isSubmitting || isUploading}
          />
        </div>

        <div className="form-group">
          <label>Product Images * (Max 5)</label>
          
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageSelect}
            disabled={isSubmitting || isUploading || previewUrls.length >= 5}
            className="file-input"
          />

          {/*  hint */}
          <small className="hint">
            You can select up to 5 images. Each image max 5MB.
          </small>
          
          {isUploading && (
            <div className="upload-progress">Uploading images...</div>
          )}

          {previewUrls.length > 0 && (
            <div className="image-previews">
              {previewUrls.map((url, index) => (
                <div key={index} className="preview-item">
                  <img src={url} alt={`Preview ${index + 1}`} />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    disabled={isSubmitting || isUploading}
                    className="remove-image"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isUploading || previewUrls.length === 0}
        >
          {isUploading ? 'Uploading Images...' :
           isSubmitting ? 'Submitting...' :
           'Submit Product for Approval'}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;