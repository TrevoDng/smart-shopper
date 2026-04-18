// Updated AddProduct.tsx - Using the useImageUpload hook

import React, { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useImageUpload } from '../../../hooks/useImageUpload';
import { productTypes, ProductMainType, ProductSubType } from '../../../utils/productTypes';
import './AddProduct.css';
import { useSlider } from '../../../slider/slidercontext/SliderContext';
import EmployeeLayout from '../layout/EmployeeLayout';

interface ProductFormData {
  mainType: string;
  subType: string;
  brand: string;
  title: string;
  description: string;
  price: string;
  stockQuantity: string;
  longDescription: string;
}

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

const AddProduct: React.FC = () => {
  const { user, getToken } = useAuth();
  const [formData, setFormData] = useState<ProductFormData>({
    mainType: productTypes[0]?.value || '',
    subType: productTypes[0]?.subTypes[0]?.value || '',
    brand: '',
    title: '',
    description: '',
    price: '',
    stockQuantity: '1',
    longDescription: ''
  });

  const {
    previewUrls,
    isUploading,
    error: uploadError,
    addImages,
    removeImage,
    clearImages,
    uploadImages,
    hasImages
  } = useImageUpload(10);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedMainType, setSelectedMainType] = useState<ProductMainType>(productTypes[0]);
  const [availableSubTypes, setAvailableSubTypes] = useState<ProductSubType[]>(productTypes[0]?.subTypes || []);

  const { hideSlider } = useSlider();
  hideSlider();

  // Update subTypes when main type changes
  useEffect(() => {
    const mainType = productTypes.find(t => t.value === formData.mainType);
    if (mainType) {
      setSelectedMainType(mainType);
      setAvailableSubTypes(mainType.subTypes);
      if (mainType.subTypes.length > 0) {
        setFormData(prev => ({ ...prev, subType: mainType.subTypes[0].value }));
      }
    }
  }, [formData.mainType]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setSubmitError(null);
  };

  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    addImages(e.target.files);
    e.target.value = '';
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);
    setSuccessMessage(null);
    
    // Validate form
    if (!formData.title.trim()) {
      setSubmitError('Product title is required');
      return;
    }
    
    if (!formData.brand.trim()) {
      setSubmitError('Brand is required');
      return;
    }
    
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setSubmitError('Valid price is required');
      return;
    }
    
    if (!hasImages) {
      setSubmitError('Please upload at least one product image');
      return;
    }
    
    if (!user?.id) {
      setSubmitError('User not authenticated');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      // Upload images first
      const imageUrls = await uploadImages({
        userId: user.id,
        productType: formData.mainType,
        productSubType: formData.subType,
        token: token
      });
      
      if (imageUrls.length === 0) {
        throw new Error('Failed to upload images');
      }
      
      // Submit product to backend
      const response = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stockQuantity: parseInt(formData.stockQuantity),
          imgSrc: imageUrls,
          status: 'pending',
          employeeId: user?.id,
          employeeName: user ? `${user.firstName} ${user.lastName}` : 'Unknown',
          employeeEmail: user?.email,
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || data.error?.message || 'Failed to create product');
      }
      
      setSuccessMessage('Product submitted successfully! It will be reviewed by an administrator.');
      
      // Reset form
      setFormData({
        mainType: productTypes[0]?.value || '',
        subType: productTypes[0]?.subTypes[0]?.value || '',
        brand: '',
        title: '',
        description: '',
        price: '',
        stockQuantity: '1',
        longDescription: ''
      });
      
      // Clear images
      clearImages();
      
      // Scroll to top
      window.scrollTo(0, 0);
      
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to submit product');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Error display (combine both hook error and submit error)
  const displayError = submitError || uploadError;

  return (
    <EmployeeLayout>
    <div className="add-product-container">
      <div className="add-product-header">
        <h1>Add New Product</h1>
        <p>Fill in the details below to add a new product for review</p>
      </div>
      
      {successMessage && (
        <div className="success-message">
          <span className="success-icon">✅</span>
          <span>{successMessage}</span>
        </div>
      )}
      
      {displayError && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <span>{displayError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="product-form">
        {/* Product Type Selection */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="mainType">Product Category *</label>
            <select
              id="mainType"
              name="mainType"
              value={formData.mainType}
              onChange={handleInputChange}
              required
              disabled={isSubmitting || isUploading}
            >
              {productTypes.map(type => (
                <option key={type.id} value={type.value}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="subType">Product Sub-Category *</label>
            <select
              id="subType"
              name="subType"
              value={formData.subType}
              onChange={handleInputChange}
              required
              disabled={isSubmitting || isUploading}
            >
              {availableSubTypes.map(subType => (
                <option key={subType.id} value={subType.value}>
                  {subType.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="brand">Brand *</label>
            <input
              type="text"
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              required
              placeholder="e.g., Samsung, Dell, Nike"
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
              placeholder="Enter product name"
              disabled={isSubmitting || isUploading}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="price">Price (R) *</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
              placeholder="0.00"
              disabled={isSubmitting || isUploading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="stockQuantity">Stock Quantity *</label>
            <input
              type="number"
              id="stockQuantity"
              name="stockQuantity"
              value={formData.stockQuantity}
              onChange={handleInputChange}
              required
              min="0"
              step="1"
              placeholder="1"
              disabled={isSubmitting || isUploading}
            />
          </div>
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
            placeholder="Brief description of the product (max 200 characters)"
            maxLength={200}
            disabled={isSubmitting || isUploading}
          />
          <small className="char-count">{formData.description.length}/200</small>
        </div>

        <div className="form-group">
          <label htmlFor="longDescription">Detailed Description *</label>
          <textarea
            id="longDescription"
            name="longDescription"
            value={formData.longDescription}
            onChange={handleInputChange}
            required
            rows={8}
            placeholder="Detailed product description, features, specifications..."
            disabled={isSubmitting || isUploading}
          />
        </div>

        {/* Image Upload Section */}
        <div className="form-group">
          <label>Product Images * (Max 10)</label>
          
          <div className="image-upload-area">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
              disabled={isSubmitting || isUploading}
              className="file-input"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="upload-label">
              <span className="upload-icon">📷</span>
              <span>Click or drag to upload images</span>
              <small>PNG, JPG, WebP up to 5MB each</small>
            </label>
          </div>
          
          {isUploading && (
            <div className="upload-progress">
              <div className="spinner"></div>
              <span>Uploading images...</span>
            </div>
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
                    title="Remove image"
                  >
                    ×
                  </button>
                  <span className="image-order">{index + 1}</span>
                </div>
              ))}
            </div>
          )}
          
          <small className="hint">
            First image will be used as the main product image
          </small>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            disabled={isSubmitting || isUploading || !hasImages}
            className="submit-button"
          >
            {isUploading ? (
              <>
                <span className="spinner-small"></span>
                Uploading Images...
              </>
            ) : isSubmitting ? (
              <>
                <span className="spinner-small"></span>
                Submitting Product...
              </>
            ) : (
              'Submit Product for Approval'
            )}
          </button>
          
          <button
            type="button"
            onClick={clearImages}
            className="cancel-button"
            disabled={isSubmitting || isUploading}
          >
            Clear Form
          </button>
        </div>
      </form>
      
      {/* Preview Section */}
      {previewUrls.length > 0 && (
        <div className="preview-section">
          <h3>Image Preview</h3>
          <div className="preview-main">
            <img src={previewUrls[0]} alt="Main preview" />
            <div className="preview-badge">Main Image</div>
          </div>
        </div>
      )}
    </div>
    </EmployeeLayout>
  );
};

export default AddProduct;