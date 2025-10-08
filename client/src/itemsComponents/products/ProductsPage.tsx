// pages/ProductsPage.tsx
import React from 'react';
import ProductGrid from './products-grid/ProductGrid';
import { productsList } from './data/demoData';

const ProductsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <ProductGrid products={productsList} />
    </div>
  );
};

export default ProductsPage;