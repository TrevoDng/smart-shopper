// components/FilterSection.tsx
import React, { useState } from 'react';

import './FilterSection.css';
import { ProductCategory, ProductModel } from '../types/Product';
import { getUniqueBrands } from './getUniqueBrands';
import { useNavigate } from 'react-router-dom';

interface FilterSectionProps {
  products: ProductCategory[];
  onSelectedType: (type: string | null)=> void;
} 

const FilterSection: React.FC<FilterSectionProps> = ({
  products,
  onSelectedType
}) => {
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const navigate = useNavigate();

  const categories = [
    "Electronics",
    "Clothing",
    "Home & Kitchen",
    "Beauty",
    "Sports",
    "Books"
  ];

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
      navigate(`/${category}`);
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const uniqueBrands = getUniqueBrands(products);
  console.log("unique brands:", JSON.stringify( uniqueBrands));

  return (
    <div className="filter-section">
      <div className="filter-header">
        <h3>Filters</h3>
        <button className="clear-filters">Clear All</button>
      </div>
      
      <div className="filter-group">
        <h4>Price Range</h4>
        <div className="price-range">
          <div className="range-values">
            <span>${priceRange[0]}</span> - <span>${priceRange[1]}</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="500" 
            value={priceRange[0]}
            onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
            className="range-slider"
          />
          <input 
            type="range" 
            min="0" 
            max="500" 
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
            className="range-slider"
          />
        </div>
      </div>
      
      <div className="filter-group">
        <h4>Categories</h4>
        <div className="category-list">
          {products.map(category => (
            <div key={category.typeId} className="category-item">
              <input 
                type="checkbox" 
                id={`cat-${category.type}`}
                checked={selectedCategories.includes(category.type)}
                onChange={() => toggleCategory(category.type)}
              />
              <label htmlFor={`cat-${category.type}`}>{category.type.charAt(0).toUpperCase() + category.type.slice(1)}</label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="filter-group">
        <h4>Brand</h4>
        <div className="brand-list">
          <div>
            {uniqueBrands.map((product)=> (
              <div className="brand-item">
            <input type="checkbox" id="brand1" />
            <label htmlFor="brand1">{product}</label>
          </div>
            ))
          }
          </div>

          {/*
          <div className="brand-item">
            <input type="checkbox" id="brand2" />
            <label htmlFor="brand2">Brand B</label>
          </div>
          <div className="brand-item">
            <input type="checkbox" id="brand3" />
            <label htmlFor="brand3">Brand C</label>
          </div>
          */}
        </div>
      </div>
      
      <div className="filter-group">
        <h4>Customer Rating</h4>
        <div className="rating-filters">
          <div className="rating-item">
            <input type="radio" id="rating5" name="rating" />
            <label htmlFor="rating5">
              <i className="fas fa-star filled"></i>
              <i className="fas fa-star filled"></i>
              <i className="fas fa-star filled"></i>
              <i className="fas fa-star filled"></i>
              <i className="fas fa-star filled"></i>
              <span>& Up</span>
            </label>
          </div>
          <div className="rating-item">
            <input type="radio" id="rating4" name="rating" />
            <label htmlFor="rating4">
              <i className="fas fa-star filled"></i>
              <i className="fas fa-star filled"></i>
              <i className="fas fa-star filled"></i>
              <i className="fas fa-star filled"></i>
              <i className="fas fa-star"></i>
              <span>& Up</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSection;