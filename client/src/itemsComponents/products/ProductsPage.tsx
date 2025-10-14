// pages/ProductsPage.tsx
import React from 'react';
//import ProductGrid from './products-grid/ProductGrid';
import { productsList } from './data/demoData';
import CategoryFilter from './category-filter/CategoryFilter';
import ProductGrid from './product-grid/ProductGrid';

const ProductsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      
      {<ProductGrid products={productsList} />}
    </div>
  );
};

export default ProductsPage;