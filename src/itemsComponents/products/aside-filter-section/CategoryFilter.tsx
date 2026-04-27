// src/itemsComponents/products/aside-filter-section/CategoryFilter.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { Product } from '../types/Product';
import './CategoryFilter.css'; // Reuse same CSS
import { cleanPrice, getAllProducts, getUniqueBrands, getUniqueCategories } from '../utils/filterUtils';

interface CategoryFilterProps {
  products: Product[];
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
  selectedBrands: string[];
  priceRange: [number, number];
  onBrandChange: (brands: string[]) => void;
  onPriceRangeChange: (range: [number, number]) => void;
  loading?: string | null;
}

export const textCase = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const getIconForCategory = (category: string): string => {
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
  return iconMap[category] || 'fa-folder';
};

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  products,
  selectedCategories,
  selectedBrands,
  priceRange,
  onCategoryChange,
  onBrandChange,
  onPriceRangeChange,
  loading
}) => {
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>(priceRange);
  
  // Extract unique categories
  const allCategories = useMemo(() => getUniqueCategories(products), [products]);
  
  // Extract unique brands
  const allBrands = useMemo(() => getUniqueBrands(products), [products]);

  // Calculate price limits
  const priceLimits = useMemo(() => {
    if (!products || products.length === 0) {
      return { min: 0, max: 10000 };
    }
    const allProductsList = getAllProducts(products);
    if (allProductsList.length === 0) {
      return { min: 0, max: 10000 };
    }
    const prices = allProductsList.map(product => cleanPrice(product.price));
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  }, [products]);

  // Sync local price range with prop
  useEffect(() => {
    setLocalPriceRange(priceRange);
  }, [priceRange]);

  const handleCategoryToggle = (category: string) => {
    const newSelectedCategories = [...selectedCategories];
    if (newSelectedCategories.includes(category)) {
      const index = newSelectedCategories.indexOf(category);
      newSelectedCategories.splice(index, 1);
    } else {
      newSelectedCategories.push(category);
    }
    onCategoryChange(newSelectedCategories);
  };

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

  const handlePriceChange = (index: number, value: number) => {
    const newRange = [...localPriceRange] as [number, number];
    newRange[index] = value;
    if (index === 0 && value > localPriceRange[1]) {
      newRange[1] = value;
    } else if (index === 1 && value < localPriceRange[0]) {
      newRange[0] = value;
    }
    setLocalPriceRange(newRange);
    onPriceRangeChange(newRange);
  };

  const handleSelectAllCategories = () => {
    const allSelected = selectedCategories.length === allCategories.length && allCategories.length > 0;
    onCategoryChange(allSelected ? [] : [...allCategories]);
  };

  const handleClearAllCategories = () => {
    onCategoryChange([]);
  };

  const handleSelectAllBrands = () => {
    const allSelected = selectedBrands.length === allBrands.length && allBrands.length > 0;
    onBrandChange(allSelected ? [] : [...allBrands]);
  };

  const handleClearAllBrands = () => {
    onBrandChange([]);
  };

  const handleResetPrice = () => {
    onPriceRangeChange([priceLimits.min, priceLimits.max]);
  };

  if (!products || products.length === 0) {
    return (
      <div className="type-filter">
        <div className="filter-section">
          <div className="filter-header">
            <h3>Filter by Category</h3>
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
      {/* Category Filter Section */}
      <div className="filter-section">
        <div className="filter-header">
          <h3>Filter by Category</h3>
          <div className="filter-actions">
            {allCategories.length > 0 && (
              <>
                <button 
                  onClick={handleSelectAllCategories}
                  className={`select-all-btn ${selectedCategories.length === allCategories.length ? 'active' : ''}`}
                  disabled={loading !== null}
                >
                  {selectedCategories.length === allCategories.length ? 'Deselect All' : 'Select All'}
                </button>
                <button 
                  onClick={handleClearAllCategories}
                  className="clear-btn"
                  disabled={selectedCategories.length === 0 || loading !== null}
                >
                  Clear All
                </button>
              </>
            )}
          </div>
        </div>

        <div className="type-list">
          {allCategories.map((category) => {
            const isSelected = selectedCategories.includes(category);
            const productCount = products.filter(p => p.category.includes(category)).length;
            const iconClass = getIconForCategory(category);
            
            return (
              <div key={category} className="type-item">
                <label className={`type-label ${isSelected ? 'selected' : ''}`}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleCategoryToggle(category)}
                    className="type-checkbox"
                    disabled={loading !== null}
                  />
                  <span className="type-info">
                    <span className="type-name">{textCase(category)}</span>
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

        {selectedCategories.length > 0 && (
          <div className="selected-summary">
            <div className="selected-tags">
              {selectedCategories.map(category => (
                <span key={category} className="selected-tag">
                  {textCase(category)}
                  <button 
                    onClick={() => handleCategoryToggle(category)}
                    className="remove-tag"
                    disabled={loading !== null}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Brand Filter Section */}
      {allBrands.length > 0 && (
        <div className="filter-section">
          <div className="filter-header">
            <h3>Filter by Brand</h3>
            <div className="filter-actions">
              <button 
                onClick={handleSelectAllBrands}
                className={`select-all-btn ${selectedBrands.length === allBrands.length ? 'active' : ''}`}
                disabled={loading !== null}
              >
                {selectedBrands.length === allBrands.length ? 'Deselect All' : 'Select All'}
              </button>
              <button 
                onClick={handleClearAllBrands}
                className="clear-btn"
                disabled={selectedBrands.length === 0 || loading !== null}
              >
                Clear All
              </button>
            </div>
          </div>

          <div className="type-list">
  {allBrands.map(brand => {
    const isSelected = selectedBrands.includes(brand);
    // FIXED: Safe check for brand existence
    const brandProductCount = products.filter(product => 
      product.brand && product.brand.toLowerCase() === brand
    ).length;
    
    const displayBrandName = brand.length < 3 ? brand.toUpperCase() : textCase(brand);
    
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
            <span className="type-name">{displayBrandName}</span>
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
        </div>
      )}

      {/* Price Filter Section */}
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
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;