// Updated AddProduct.tsx - Using new category array structure

import React, { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useImageUpload } from '../../../hooks/useImageUpload';
import { productTypes, ProductMainType, ProductSubType } from '../../../utils/productTypes';
import './AddProduct.css';
import { useSlider } from '../../../slider/slidercontext/SliderContext';
import EmployeeLayout from '../layout/EmployeeLayout';

interface ProductFormData {
  category: string[];  // Changed from mainType/subType to array
  brand: string;
  title: string;
  description: string;
  price: string;
  sizes: Size[];
  stockQuantity: string;
  longDescription: string;
}

interface Notification {
  message: string;
  type: string;
  visible: boolean;
}

interface Size {
  code: string;
  name: string;
  quantity: number; 
  type: "string" | "number";
}

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

const AddProduct: React.FC = () => {
  const { user, getToken } = useAuth();
  
  // Build category path from selected mainType and subType
  const [selectedMainType, setSelectedMainType] = useState<ProductMainType>(productTypes[0]);
  const [selectedSubType, setSelectedSubType] = useState<ProductSubType>(productTypes[0]?.subTypes[0]);
  const [availableSubTypes, setAvailableSubTypes] = useState<ProductSubType[]>(productTypes[0]?.subTypes || []);
  const [selectedSizes, setSelectedSizes] = useState<Size[]>([]);
  const [notification, setNotification] = useState<Notification>({
    message: '',
    type: '',
    visible: false
  })
  
  const [formData, setFormData] = useState<ProductFormData>({
    category: [`${productTypes[0]?.value}/${productTypes[0]?.subTypes[0]?.value}`],
    brand: '',
    title: '',
    description: '',
    price: '',
    sizes: [],
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

  const { hideSlider } = useSlider();
  hideSlider();

  // Available size options (without stock info)
const availableSizes: Size[] = [
  { code: "XS", name: "Extra Small (US 5)", type: "string", quantity: 0 },
  { code: "S", name: "Small (US 6-7)", type: "string", quantity: 0 },
  { code: "M", name: "Medium (US 8-9)", type: "string", quantity: 0 },
  { code: "L", name: "Large (US 10-11)", type: "string", quantity: 0 },
  { code: "XL", name: "Extra Large (US 12-13)", type: "string", quantity: 0 },
  { code: "6", name: "Size 6 (EU 39)", type: "number", quantity: 0 },
  { code: "7", name: "Size 7 (EU 40)", type: "number", quantity: 0 },
  { code: "8.5", name: "Size 8.5 (EU 42)", type: "number", quantity: 0 },
  { code: "10", name: "Size 10 (EU 44)", type: "number", quantity: 0 },
  { code: "One Size", name: "One Size Fits All", type: "string", quantity: 0 }
];

/*
  const handleSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedSize = e.target.value;
    if (selectedSize) {
      const size = availableSizes.find(s => 
        s.code === selectedSize || s.code.toString() === selectedSize);
      
        if (size) {
          setSelectedSizes([size]);
          setFormData(prev => ({...prev, sizes: size.code }));
          showNotification(`Size ${size} is selected`, 'success');
        }
        console.log('Form Data:', formData);
    } else {
      setSelectedSizes([]);
      setFormData(prev => ({...prev, sizes: []}));
    }
  }
  */

  const handleAddSize = (sizeCode: string, quantity: number) => {
  // Check if size already exists
  const existingSizeIndex = selectedSizes.findIndex(s => s.code === sizeCode);
  
  if (existingSizeIndex >= 0) {
    // Update quantity if size already exists
    const updatedSizes = [...selectedSizes];
    updatedSizes[existingSizeIndex] = {
      ...updatedSizes[existingSizeIndex],
      quantity: quantity
    };
    setSelectedSizes(updatedSizes);
    // Update formData as well
    setFormData(prev => ({ ...prev, sizes: updatedSizes }));
    showNotification(`Updated ${sizeCode} quantity to ${quantity}`, 'success');
  } else {
    // Add new size
    const sizeToAdd = availableSizes.find(s => s.code === sizeCode);
    if (sizeToAdd) {
      const newSize = { ...sizeToAdd, quantity };
      const updatedSizes = [...selectedSizes, newSize];
      setSelectedSizes(updatedSizes);
      setFormData(prev => ({ ...prev, sizes: updatedSizes }));
      showNotification(`Added ${sizeCode} with quantity ${quantity}`, 'success');
    }
  }
};

const handleRemoveSize = (sizeCode: string) => {
  const updatedSizes = selectedSizes.filter(s => s.code !== sizeCode);
  setSelectedSizes(updatedSizes);
  setFormData(prev => ({ ...prev, sizes: updatedSizes }));
  showNotification(`Removed ${sizeCode}`, 'info');
};

// Update quantity for an existing size
const handleUpdateQuantity = (sizeCode: string, newQuantity: number) => {
  const updatedSizes = selectedSizes.map(s => 
    s.code === sizeCode ? { ...s, quantity: newQuantity } : s
  );
  setSelectedSizes(updatedSizes);
  console.log('Updated Sizes:', updatedSizes);
  setFormData(prev => ({ ...prev, sizes: updatedSizes }));
};

  const showNotification = (message: string, type: string): void => {
    setNotification({message, type, visible: true});
    setTimeout(() => {
      setNotification(prev => ({...prev, visible: false}));
    }, 3000)
  }

  // Update subTypes when main type changes
  useEffect(() => {
    const mainType = productTypes.find(t => t.value === selectedMainType?.value);
    if (mainType) {
      setSelectedMainType(mainType);
      setAvailableSubTypes(mainType.subTypes);
      if (mainType.subTypes.length > 0) {
        const firstSubType = mainType.subTypes[0];
        setSelectedSubType(firstSubType);
        // Update category array with new path
        setFormData(prev => ({
          ...prev,
          category: [`${mainType.value}/${firstSubType.value}`]
        }));
      }
    }
  }, [selectedMainType?.value]);

  useEffect(() => {
    if (selectedMainType.value === "clothing") {
      const totalStock = selectedSizes.reduce((sum, size) => sum + size.quantity, 0);
      setFormData(prev => ({ ...prev, stockQuantity: totalStock.toString() }));
    }
  }, [selectedSizes, selectedMainType.value]);

  // Handle main type change
  const handleMainTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const mainTypeValue = e.target.value;
    const mainType = productTypes.find(t => t.value === mainTypeValue);
    if (mainType) {
      setSelectedMainType(mainType);
    }
  };

  // Handle sub type change
  const handleSubTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const subTypeValue = e.target.value;
    const subType = availableSubTypes.find(st => st.value === subTypeValue);
    if (subType) {
      setSelectedSubType(subType);
      // Update category array with new path
      setFormData(prev => ({
        ...prev,
        category: [`${selectedMainType.value}/${subType.value}`]
      }));
    }
  };

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

    if (selectedMainType.value === "clothing" && formData.sizes.length === 0) {
  setSubmitError('Please add at least one size for clothing items');
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
        productType: selectedMainType.value,
        productSubType: selectedSubType.value,
        token: token
      });
      
      if (imageUrls.length === 0) {
        throw new Error('Failed to upload images');
      }
      
      // Submit product to backend with new category array structure
      const response = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          category: formData.category,  // Array like ["electronics/computers"]
          brand: formData.brand,
          title: formData.title,
          description: formData.description,
          longDescription: formData.longDescription,
          price: parseFloat(formData.price),
          sizes: formData.sizes,
          stockQuantity: parseInt(formData.stockQuantity),
          imgSrc: imageUrls
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || data.error?.message || 'Failed to create product');
      }
      
      setSuccessMessage('Product submitted successfully! It will be reviewed by an administrator.');
      
      // Reset form
      const defaultMainType = productTypes[0];
      const defaultSubType = productTypes[0]?.subTypes[0];
      setSelectedMainType(defaultMainType);
      setSelectedSubType(defaultSubType);
      setFormData({
        category: [`${defaultMainType?.value}/${defaultSubType?.value}`],
        brand: '',
        title: '',
        description: '',
        price: '',
        sizes: [],
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
        {/* Product Category Selection - Creates path like "electronics/computers" */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="mainType">Product Category *</label>
            <select
              id="mainType"
              name="mainType"
              value={selectedMainType?.value || ''}
              onChange={handleMainTypeChange}
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
              value={selectedSubType?.value || ''}
              onChange={handleSubTypeChange}
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

        {/* Display the category path that will be saved */}
        <div className="form-row">
          <div className="form-group full-width">
            <small className="category-path-hint">
              Category Path: <strong>{formData.category[0] || 'Not selected'}</strong>
            </small>
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
              
          { /*selectedMainType.value !== "clothing" && */ 
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
          }
        </div>

        {selectedMainType.value === "clothing" && (
  <div className="form-row">
    <div className="form-group full-width">
      <label>Product Sizes & Quantities</label>
      
      {/* Size selection and quantity input */}
      <div className="size-input-row">
        <select 
          className="dropdown-select" 
          id="sizeDropdown"
          defaultValue=""
          style={{ flex: 2, marginRight: '10px' }}
        >
          <option value="" disabled>Select a size to add</option>
          {availableSizes
            .filter(size => !selectedSizes.some(s => s.code === size.code))
            .map(size => (
              <option key={size.code} value={size.code}>
                {size.name}
              </option>
            ))}
        </select>
        
        <input
          type="number"
          placeholder="Quantity"
          min="0"
          step="1"
          defaultValue="1"
          style={{ flex: 1, marginRight: '10px', padding: '10px' }}
          id="sizeQuantityInput"
        />
        
        <button
          type="button"
          onClick={() => {
            const select = document.getElementById('sizeDropdown') as HTMLSelectElement;
            const quantityInput = document.getElementById('sizeQuantityInput') as HTMLInputElement;
            const sizeCode = select.value;
            const quantity = parseInt(quantityInput.value) || 1;
            
            if (sizeCode && quantity > 0) {
              handleAddSize(sizeCode, quantity);
              select.value = '';
              quantityInput.value = '1';
            } else {
              showNotification('Please select a size and enter a valid quantity', 'error');
            }
          }}
          className="add-size-button"
          style={{ flex: 0.5, padding: '10px 20px' }}
        >
          Add Size
        </button>
      </div>
      
      {/* Display selected sizes with quantities */}
      {selectedSizes.length > 0 && (
        <div className="selected-sizes-list">
          <h4>Added Sizes:</h4>
          {selectedSizes.map((size, index) => (
            <div key={index} className="size-item">
              <span className="size-name">{size.name}</span>
              <div className="size-quantity-control">
                <input
                  type="number"
                  value={size.quantity}
                  min="0"
                  step="1"
                  onChange={(e) => handleUpdateQuantity(size.code, parseInt(e.target.value) || 0)}
                  className="quantity-input-small"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveSize(size.code)}
                  className="remove-size-button"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <small className="hint">
        Add each size variant with its available quantity. You can add multiple sizes for clothing items.
      </small>
    </div>
  </div>
)}

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