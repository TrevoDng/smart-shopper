// src/itemsComponents/products/aside-filter-section/TypeFilter.tsx
import React, { useEffect, useState } from 'react';
import { ProductCategory } from '../types/Product';
import './TypeFilter.css';
import { cleanPrice, getAllProducts } from '../utils/filterUtils';

interface TypeFilterProps {
  categories: ProductCategory[];
  selectedTypes: string[];
  onTypeChange: (types: string[]) => void;
  selectedBrands: string[];
  priceRange: [number, number];
  onBrandChange: (brands: string[]) => void;
  onPriceRangeChange: (range: [number, number]) => void;
  loading?: string | null;
}

export const textCase = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

// Helper function to get icon class with fallback
const getIconForType = (type: string, originalIcon?: string): string => {
  if (originalIcon && originalIcon !== '') return originalIcon;
  
  // Fallback icons based on type
  const iconMap: { [key: string]: string } = {
    'electronics': 'fa-microchip',
    'home-appliances': 'fa-home',
    'clothes': 'fa-tshirt',
    'furniture': 'fa-couch',
    'other': 'fa-box',
    'laptops': 'fa-laptop',
    'desktop': 'fa-computer',
    'screens': 'fa-display',
    'smartphones': 'fa-mobile-alt',
    'audio': 'fa-headphones',
    'cameras': 'fa-camera'
  };
  
  return iconMap[type] || 'fa-cube';
};

const TypeFilter: React.FC<TypeFilterProps> = ({
  categories,
  selectedTypes,
  selectedBrands,
  priceRange,
  onTypeChange,
  onBrandChange,
  onPriceRangeChange,
  loading
}) => {
  const [selectAll, setSelectAll] = React.useState<boolean>(true);
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>(priceRange);
  
  // Extract unique types from categories (filter out empty categories)
  const allTypes = React.useMemo(() => {
    return categories
      .filter(category => category && category.type)
      .map(category => category.type);
  }, [categories]);

  // Extract unique brands from products
  const allBrands = React.useMemo(() => {
    if (!categories || categories.length === 0) return [];
    
    const brands = categories.flatMap(category => 
      category.models?.map(product => product.brand?.toLowerCase() || '') || []
    );
    return Array.from(new Set(brands.filter(brand => brand && brand.trim() !== "")));
  }, [categories]);

  // Calculate price limits from available products
  const priceLimits = React.useMemo(() => {
    if (!categories || categories.length === 0) {
      return { min: 0, max: 10000 };
    }
    
    const allProducts = getAllProducts(categories);
    if (allProducts.length === 0) {
      return { min: 0, max: 10000 };
    }
    
    const prices = allProducts.map(product => cleanPrice(product.price));
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  }, [categories]);

  // Sync local price range with prop
  useEffect(() => {
    setLocalPriceRange(priceRange);
  }, [priceRange]);

  // Handle type checkbox toggle
  const handleTypeToggle = (type: string) => {
    const newSelectedTypes = [...selectedTypes];
    
    if (newSelectedTypes.includes(type)) {
      const index = newSelectedTypes.indexOf(type);
      newSelectedTypes.splice(index, 1);
    } else {
      newSelectedTypes.push(type);
    }
    
    onTypeChange(newSelectedTypes);
  };

  // Handle brand checkbox toggle
  const handleBrandToggle = (brand: string) => {
    const newSelectedBrands = [...selectedBrands];

    if (newSelectedBrands.includes(brand)) {
      const index = newSelectedBrands.indexOf(brand);
      newSelectedBrands.splice(index, 1);
    } else {
      newSelectedBrands.push(brand);
    }
    onBrandChange(newSelectedBrands);
  };

  // Handle price range slider changes
  const handlePriceChange = (index: number, value: number) => {
    const newRange = [...localPriceRange] as [number, number];
    newRange[index] = value;

    // Ensure min <= max
    if (index === 0 && value > localPriceRange[1]) {
      newRange[1] = value;
    } else if (index === 1 && value < localPriceRange[0]) {
      newRange[0] = value;
    }

    setLocalPriceRange(newRange);
    onPriceRangeChange(newRange);
  };

  // Select/Deselect all types
  const handleSelectAll = (filterType: 'types' | 'brands') => {
    if (filterType === 'types') {
      const allSelected = selectedTypes.length === allTypes.length && allTypes.length > 0;
      onTypeChange(allSelected ? [] : [...allTypes]);
    } else {
      const allSelected = selectedBrands.length === allBrands.length && allBrands.length > 0;
      onBrandChange(allSelected ? [] : [...allBrands]);
    }
  };

  // Clear all selections for a filter type
  const handleClearAll = (filterType: 'types' | 'brands') => {
    if (filterType === 'types') {
      onTypeChange([]);
    } else {
      onBrandChange([]);
    }
  };

  // Reset price range to min/max
  const handleResetPrice = () => {
    onPriceRangeChange([priceLimits.min, priceLimits.max]);
  };

  // Show message if no categories available
  if (!categories || categories.length === 0) {
    return (
      <div className="type-filter">
        <div className="filter-section">
          <div className="filter-header">
            <h3>Filter by Type</h3>
          </div>
          <div className="no-data-message">
            <p>No product categories available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="type-filter">
      {/* Type Filter Section */}
      <div className="filter-section">
        <div className="filter-header">
          <h3>Filter by Type</h3>
          <div className="filter-actions">
            {allTypes.length > 0 && (
              <>
                <button 
                  onClick={() => handleSelectAll('types')}
                  className={`select-all-btn ${selectedTypes.length === allTypes.length ? 'active' : ''}`}
                  disabled={loading !== null}
                >
                  {selectedTypes.length === allTypes.length ? 'Deselect All' : 'Select All'}
                </button>
                <button 
                  onClick={() => handleClearAll('types')}
                  className="clear-btn"
                  disabled={selectedTypes.length === 0 || loading !== null}
                >
                  Clear All
                </button>
              </>
            )}
          </div>
        </div>

        <div className="type-list">
          {categories.map(category => {
            if (!category || !category.type) return null;
            
            const isSelected = selectedTypes.includes(category.type);
            const productCount = category.models?.length || 0;
            const iconClass = getIconForType(category.type, category.icon);
            
            return (
              <div key={category.type} className="type-item">
                <label className={`type-label ${isSelected ? 'selected' : ''}`}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleTypeToggle(category.type)}
                    className="type-checkbox"
                    disabled={loading !== null}
                  />
                  <span className="type-info">
                    <span className="type-name">{category.title || textCase(category.type)}</span>
                    <span className="type-count">({productCount})</span>
                  </span>
                  <span className="type-icon">
                    <i className={`fas ${iconClass}`}></i>
                  </span>
                </label>
              </div>
            );
          })}
        </div>

        {selectedTypes.length > 0 && (
          <div className="selected-summary">
            <div className="selected-tags">
              {selectedTypes.map(type => {
                const category = categories.find(c => c.type === type);
                return (
                  <span key={type} className="selected-tag">
                    {category?.title || textCase(type)}
                    <button 
                      onClick={() => handleTypeToggle(type)}
                      className="remove-tag"
                      disabled={loading !== null}
                    >
                      ×
                    </button>
                  </span>
                );
              })}
            </div>
            <p className="selected-count">
              Showing {selectedTypes.length} of {allTypes.length} types
            </p>
          </div>
        )}
      </div>

      {/* Brand Filter Section - Only show if brands exist */}
      {allBrands.length > 0 && (
        <div className="filter-section">
          <div className="filter-header">
            <h3>Filter by Brand</h3>
            <div className="filter-actions">
              <button 
                onClick={() => handleSelectAll('brands')}
                className={`select-all-btn ${selectedBrands?.length === allBrands?.length ? 'active' : ''}`}
                disabled={loading !== null}
              >
                {selectedBrands?.length === allBrands?.length ? 'Deselect All' : 'Select All'}
              </button>
              <button 
                onClick={() => handleClearAll('brands')}
                className="clear-btn"
                disabled={selectedBrands?.length === 0 || loading !== null}
              >
                Clear All
              </button>
            </div>
          </div>

          <div className="type-list">
            {allBrands.map(brand => {
              const isSelected = selectedBrands?.includes(brand);
              const brandProductCount = categories
                .flatMap(category => category.models || [])
                .filter(product => product.brand?.toLowerCase() === brand).length;
              
              return (
                <div key={brand} className="type-item">
                  <label className={`type-label ${isSelected ? 'selected' : ''}`}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleBrandToggle(brand)}
                      className="type-checkbox"
                      disabled={loading !== null}
                    />
                    <span className="type-info">
                      <span className="type-name">{brand.length < 3 ? brand.toUpperCase() : textCase(brand)}</span>
                      <span className="type-count">({brandProductCount})</span>
                    </span>
                    <span className="type-icon">
                      <i className="fas fa-tag"></i>
                    </span>
                  </label>
                </div>
              );
            })}
          </div>

          {selectedBrands?.length > 0 && (
            <div className="selected-summary">
              <div className="selected-tags">
                {selectedBrands?.map(brand => (
                  <span key={brand} className="selected-tag">
                    {brand}
                    <button 
                      onClick={() => handleBrandToggle(brand)}
                      className="remove-tag"
                      disabled={loading !== null}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <p className="selected-count">
                Showing {selectedBrands.length} of {allBrands.length} brands
              </p>
            </div>
          )}
        </div>
      )}

      {/* Price Filter Section - Only show if products exist */}
      {priceLimits.min !== priceLimits.max && (
        <div className="filter-section">
          <div className="filter-header">
            <h3>Price Range</h3>
            <button 
              onClick={handleResetPrice}
              className="clear-btn"
              disabled={(priceRange[0] !== priceLimits.min || priceRange[1] !== priceLimits.max) && loading !== null}
            >
              Reset
            </button>
          </div>
          
          <div className="price-filter">
            <div className="price-range-values">
              <span>R{priceRange[0].toLocaleString()}</span> - <span>R{priceRange[1].toLocaleString()}</span>
            </div>
            
            <div className="range-sliders">
              <div className="range-slider-container">
                <span className="range-label">Min: R{localPriceRange[0].toLocaleString()}</span>
                <input
                  type="range"
                  min={priceLimits.min}
                  max={priceLimits.max}
                  value={localPriceRange[0]}
                  onChange={(e) => handlePriceChange(0, parseInt(e.target.value) || 0)}
                  className="range-slider"
                  disabled={loading !== null}
                />
              </div>
              
              <div className="range-slider-container">
                <span className="range-label">Max: R{localPriceRange[1].toLocaleString()}</span>
                <input
                  type="range"
                  min={priceLimits.min}
                  max={priceLimits.max}
                  value={localPriceRange[1]}
                  onChange={(e) => handlePriceChange(1, parseInt(e.target.value) || 0)}
                  className="range-slider"
                  disabled={loading !== null}
                />
              </div>
            </div>
            
            <div className="price-limits">
              <span>Min: R{priceLimits.min.toLocaleString()}</span> - 
              <span> Max: R{priceLimits.max.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TypeFilter;