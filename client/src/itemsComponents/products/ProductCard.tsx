

// components/ProductCard.tsx
import React, { useState } from 'react';
import { ProductModel } from './types/Product';

interface ProductCardProps {
  product: ProductModel;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === product.imgSrc.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? product.imgSrc.length - 1 : prev - 1
    );
  };

  return (
    <div className="product-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Image Section */}
      <div className="relative h-48 bg-gray-200">
        {product.imgSrc.length > 0 ? (
          <>
            <img 
              src={product.imgSrc[currentImageIndex]} 
              alt={product.model}
              className="w-full h-full object-cover"
            />
            {product.imgSrc.length > 1 && (
              <>
                <button 
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 transition-colors"
                >
                  ‹
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70 transition-colors"
                >
                  ›
                </button>
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                  {product.imgSrc.map((_, index) => (
                    <div 
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <i className="fas fa-image text-4xl"></i>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-800 mb-2">
          {product.model}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex justify-between items-center mb-3">
          <span className="text-green-600 font-bold text-lg">
            {product.price}
          </span>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {/*product.size*/}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors text-sm font-medium">
            Add to Cart
          </button>
          <button className="bg-gray-200 text-gray-700 p-2 rounded hover:bg-gray-300 transition-colors">
            <i className="fas fa-heart"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;