import React, { useEffect, useRef } from 'react';

import { ProductCategory, ProductModel } from '../itemsComponents/products/types/Product';
import { SearchProductCard } from './SearchProductCard';
//import './search.css';

interface SearchProductsProps {
    products:  ProductCategory[];
    setSearchQuery: (query: string) => void;
    searchQuery: string; 
    //onSelectedType: (type: string | null) => void;
    //selectedType: string | null;
    onItemId: (id: string) => void;
    onLoading: (id: string | null) => void;
    loading?: string | null;
}

// Helper function to get default icon (you'll need to implement this)
const getDefaultIcon = (type: string): string => {
    // Return a default icon URL based on the type
    const iconMap: {[key: string]: string } = {
        laptops: 'fa-laptop',
        desktops: 'fa-desktop',
        screens: 'fa-display',
        phones: 'fa-mobile',
        tablets: 'fa-tablet'
    };
    return iconMap[type] || 'fa-cube'; // Replace with actual logic
};

// Type guard to check if an item is a ProductCategory
const isProductCategory = (item: any): item is ProductCategory => {
  return item && Array.isArray(item.models);
};

const SearchForm: React.FC<SearchProductsProps> = ({
    products, 
    searchQuery, 
    setSearchQuery,
    onItemId, 
    //onSelectedType
    onLoading,
    loading
}) => {
  // You can add state for the search input if needed

  const closePopupRef = useRef<ReturnType<typeof setTimeout> | null>(null);

      let productPopup = false;

      if(products.length > 0) {
           productPopup = true;
      } else {
        productPopup = false;
      }

  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    if(searchQuery) {
    console.log('Form submitted', searchQuery);
    } else{
        console.log("Type something to search items")
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const closeSearchPopup=()=> {
    if(closePopupRef.current) clearTimeout(closePopupRef.current);
    
    closePopupRef.current = setTimeout(()=> {
      setSearchQuery('');
    }, 3000);
  }

  return (
    <form 
      className="search-form" 
      data-page-id="top-slide-design"
      onSubmit={handleSubmit}
    >
      <input 
        type="search"
        id='serach-products' 
        placeholder="Search products"
         value={searchQuery}
         onChange={handleInputChange}
      />

      {productPopup && 
      <div className='search-popup-outer-container' 
      onClick={closeSearchPopup}>
        {products.map(category => (
          category.models.map(product => (
            <SearchProductCard 
            key={product.id}
          product={{
            ...product,
            currency: product.currency,
            imgSrc: product.imgSrc,
          }}
          onItemId={onItemId}
          //onSelectedType={onSelectedType}
          //setSearchQuery={setSearchQuery}
          //searchQuery={searchQuery}
          onLoading={onLoading}
          loading={loading}
    />
          ))
        ))}
        </div>
      }

      <button 
        type="submit" 
        className="submit-btn"
      >
        <i className="fa-solid fa-magnifying-glass"></i>
      </button>
    </form>
  );
};

//export default SearchForm;
