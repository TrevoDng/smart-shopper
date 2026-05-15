// src/itemsComponents/products/aside-filter-section/CategoryFilter.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { Product } from '../types/Product';
import './CategoryFilter.css';
import { cleanPrice } from '../utils/filterUtils';

interface CategoryFilterProps {
  products: Product[];
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
  selectedMaincategory?: string | null;
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
    'computers': 'fa-computer',
    'computer-components': 'fa-microchip',
    'monitors': 'fa-display',
    'smartphones': 'fa-mobile-alt',
    'tablets': 'fa-tablet-alt',
    'audio': 'fa-headphones',
    'cameras': 'fa-camera',
    'refrigerators': 'fa-thermometer-half',
    'washing-machines': 'fa-jug-detergent',
    'air-fryers': 'fa-fire',
    'microwaves': 'fa-temperature-high',
    'coffee-makers': 'fa-mug-hot',
    'vacuums': 'fa-broom',
    'jeans': 'fa-shopping-cart',
    'shirts': 'fa-shirt',
    't-shirts': 'fa-tshirt',
    'dresses': 'fa-female',
    'jackets': 'fa-vest',
    'shoes': 'fa-shoe-prints',
    'chairs': 'fa-chair',
    'tables': 'fa-table',
    'sofas': 'fa-couch',
    'beds': 'fa-bed',
    'desks': 'fa-desk',
    'miscellaneous': 'fa-box'
  };
  return iconMap[category] || 'fa-folder';
};

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  products,
  selectedCategories,
  selectedMaincategory,
  selectedBrands,
  priceRange,
  onCategoryChange,
  onBrandChange,
  onPriceRangeChange,
  loading,
}) => {
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>(priceRange);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Build complete category hierarchy from all products
  const categoryHierarchy = useMemo(() => {

    let filteredProducts = products;
    if (selectedMaincategory) {
      filteredProducts = products.filter(product => 
        Array.isArray(product.category) && product.category.length > 0 && 
        product.category[0].startsWith(selectedMaincategory + '/')
      );
    }

    if (filteredProducts.length === 0) return [];

    const hierarchy = new Map<string, Map<string, { fullPath: string; count: number }>>();
    
    console.log("Filtered Products:", filteredProducts);

    filteredProducts.forEach(product => {
      if (Array.isArray(product.category) && product.category.length > 0) {
        const fullPath = product.category[0];
        const [mainCat, subCat] = fullPath.split('/');
        
        if (mainCat && subCat) {
          if (!hierarchy.has(mainCat)) {
            hierarchy.set(mainCat, new Map());
          }
          
          const subMap = hierarchy.get(mainCat)!;
          const existing = subMap.get(subCat);
          if (existing) {
            existing.count++;
          } else {
            subMap.set(subCat, { fullPath, count: 1 });
          }
        }
      }
    });
    
    // Convert to array and sort
    const result = Array.from(hierarchy.entries())
      .map(([mainCat, subMap]) => ({
        mainCategory: mainCat,
        subCategories: Array.from(subMap.entries())
          .map(([subCat, { fullPath, count }]) => ({
            name: subCat,
            fullPath,
            count
          }))
          .sort((a, b) => a.name.localeCompare(b.name))
      }))
      .sort((a, b) => a.mainCategory.localeCompare(b.mainCategory));
    
    return result;
  }, [products, selectedMaincategory]);

  console.log("Filtered Products:", selectedMaincategory);

  // Auto-expand categories that have selected subcategories
  useEffect(() => {
    const categoriesToExpand = new Set<string>();
    selectedCategories.forEach(selectedPath => {
      const mainCat = selectedPath.split('/')[0];
      if (mainCat) {
        categoriesToExpand.add(mainCat);
      }
    });
    
    if (categoriesToExpand.size > 0) {
      setExpandedCategories(prev => new Set([...prev, ...categoriesToExpand]));
    }
  }, [selectedCategories]);

  // Calculate price limits based on filtered products (consider selected categories)
  const priceLimits = useMemo(() => {
    let filteredProducts = products;
    
    // Apply category filter if any categories are selected
    if (selectedCategories.length > 0) {
      filteredProducts = products.filter(product => 
        Array.isArray(product.category) && 
        product.category.some(cat => selectedCategories.includes(cat))
      );
    }
    
    if (filteredProducts.length === 0) {
      return { min: 0, max: 10000 };
    }
    
    const prices = filteredProducts.map(product => cleanPrice(product.price));
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  }, [products, selectedCategories]);

  // Sync local price range with prop
  useEffect(() => {
    setLocalPriceRange(priceRange);
  }, [priceRange]);

  const toggleCategoryExpand = (categoryName: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryName)) {
      newExpanded.delete(categoryName);
    } else {
      newExpanded.add(categoryName);
    }
    setExpandedCategories(newExpanded);
  };

  const handleSubCategoryToggle = (fullPath: string) => {
    const newSelectedCategories = [...selectedCategories];
    if (newSelectedCategories.includes(fullPath)) {
      const index = newSelectedCategories.indexOf(fullPath);
      newSelectedCategories.splice(index, 1);
    } else {
      newSelectedCategories.push(fullPath);
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

  const handleClearAllCategories = () => {
    onCategoryChange([]);
  };

  const handleResetPrice = () => {
    setLocalPriceRange([priceLimits.min, priceLimits.max]);
    onPriceRangeChange([priceLimits.min, priceLimits.max]);
  };

  // Get unique brands from products (consider selected categories)
  const allBrands = useMemo(() => {
    let filteredProducts = products;
    
    // Apply category filter if any categories are selected
    if (selectedCategories.length > 0) {
      filteredProducts = products.filter(product => 
        Array.isArray(product.category) && 
        product.category.some(cat => selectedCategories.includes(cat))
      );
    }
    
    const brands = filteredProducts
      .map(product => product.brand)
      .filter((brand, index, self) => brand && self.indexOf(brand) === index)
      .sort();
    
    return brands;
  }, [products, selectedCategories]);

  // Count how many subcategories are selected
  const selectedCount = selectedCategories.length;

  if (categoryHierarchy.length === 0) {
    return (
      <div className="type-filter">
        <div className="filter-section">
          <div className="filter-header">
            <h3>Filter by Category</h3>
          </div>
          <div className="no-data-message">
            <p>No categories available</p>
          </div>
        </div>
      </div>
    );
  }


        //console.log("Selected Categories:", selectedCategories);

  return (
    <div className="type-filter">
      {/* Category Filter Section */}
      <div className="filter-section">
        <div className="filter-header">
          <h3>Filter by Category</h3>
          {selectedCount > 0 && (
            <button 
              onClick={handleClearAllCategories}
              className="clear-all-btn"
              disabled={loading !== null}
            >
              Clear All ({selectedCount})
            </button>
          )}
        </div>

        {/* All Main Categories with their Subcategories */}
        {categoryHierarchy.map(({ mainCategory, subCategories }) => {
          const isExpanded = expandedCategories.has(mainCategory);
          const hasSelectedSubcategories = selectedCategories.some(cat => cat.startsWith(mainCategory + '/'));
          const mainCategoryCount = subCategories.reduce((sum, sub) => sum + sub.count, 0);
          
          return (
            <div key={mainCategory} className="category-group">
              {/* Main Category Button */}
              <div 
                className={`main-category-button ${hasSelectedSubcategories ? 'has-selected' : ''}`}
                onClick={() => toggleCategoryExpand(mainCategory)}
              >
                <div className="main-category-info">
                  <i className={`fas ${getIconForCategory(mainCategory)}`}></i>
                  <span className="main-category-name">{textCase(mainCategory)}</span>
                  <span className="main-category-count">({mainCategoryCount})</span>
                </div>
                <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} arrow-icon`}></i>
              </div>

              {/* Subcategories - shown when expanded */}
              {isExpanded && (
                <div className="subcategories-container">
                  {subCategories.map(({ name, fullPath, count }) => {
                    const isSelected = selectedCategories.includes(fullPath);
                    
                    return (
                      <div key={fullPath} className="subcategory-item">
                        <label className={`subcategory-label ${isSelected ? 'selected' : ''}`}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSubCategoryToggle(fullPath)}
                            className="subcategory-checkbox"
                            disabled={loading !== null}
                          />
                          <span className="subcategory-info">
                            <span className="subcategory-name">{textCase(name)}</span>
                            <span className="subcategory-count">({count})</span>
                          </span>
                          <span className="subcategory-icon">
                            <i className={`fas ${getIconForCategory(name)}`}></i>
                          </span>
                        </label>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Selected categories summary */}
        {selectedCategories.length > 0 && (
          <div className="selected-summary">
            <div className="selected-tags">
              {selectedCategories.map(fullPath => {
                const parts = fullPath.split('/');
                const subCatName = parts[1] || parts[0];
                return (
                  <span key={fullPath} className="selected-tag">
                    {textCase(subCatName)}
                    <button 
                      onClick={() => handleSubCategoryToggle(fullPath)}
                      className="remove-tag"
                      disabled={loading !== null}
                    >
                      ×
                    </button>
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Brand Filter Section - Always shows brands from currently visible products */}
      {allBrands.length > 0 && (
        <div className="filter-section">
          <div className="filter-header">
            <h3>Filter by Brand</h3>
          </div>

          <div className="brands-list">
            {allBrands.map(brand => {
              const isSelected = selectedBrands.includes(brand);
              // Count products for this brand based on current category selection
              let brandProductCount = products.filter(product => {
                if (selectedCategories.length > 0) {
                  // If categories are selected, only count brands from those categories
                  return product.brand === brand && 
                         Array.isArray(product.category) && 
                         product.category.some(cat => selectedCategories.includes(cat));
                }
                return product.brand === brand;
              }).length;
              
              const displayBrandName = brand.length < 3 ? brand.toUpperCase() : textCase(brand);
              
              return (
                <div key={brand} className="brand-item">
                  <label className={`brand-label ${isSelected ? 'selected' : ''}`}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleBrandToggle(brand)}
                      className="brand-checkbox"
                      disabled={loading !== null}
                    />
                    <span className="brand-info">
                      <span className="brand-name">{displayBrandName}</span>
                      <span className="brand-count">({brandProductCount})</span>
                    </span>
                    <span className="brand-icon">
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