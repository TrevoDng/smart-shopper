// components/ProductGrid.tsx
import React from 'react';
import { ProductCategory } from '../types/Product';
import ProductCard from '../ProductCard';

interface ProductGridProps {
  products: ProductCategory[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  // Flatten all models from all categories
  const allProducts = products.flatMap(category => category.models);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Our Products</h1>
        <p className="text-gray-600">Discover our amazing collection of products</p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {allProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Empty State */}
      {allProducts.length === 0 && (
        <div className="text-center py-12">
          <i className="fas fa-box-open text-6xl text-gray-300 mb-4"></i>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
          <p className="text-gray-500">Check back later for new products!</p>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;