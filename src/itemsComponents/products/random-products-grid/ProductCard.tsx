// src/itemsComponents/products/product-card/ProductCard.tsx (new file)
import React from 'react';
import { Product } from '../types/Product';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
  discount?: {
    discountedPrice: number;
    discountAmount: number;
  } | null;
  loading?: string | null;
  onClick: () => void;
  onLoading?: (id: string) => void;
  CartlistButton: React.ComponentType<{ product: Product }>;
  WishlistButton: React.ComponentType<{ product: Product }>;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  discount,
  loading,
  onClick,
  CartlistButton,
  WishlistButton,
}) => {
  const originalPrice = parseFloat(product.price);
  const hasDiscount = discount && discount.discountAmount > 0;
  const displayPrice = hasDiscount ? discount.discountedPrice : originalPrice;

  return (
    <div className="product-card" onClick={onClick}>
      {loading === product.id && (
        <div className="loading-overlay">
          <div className="loading-spinner-small"></div>
        </div>
      )}
      
      {/* Product Image */}
      {product.imgSrc && product.imgSrc.length > 0 && (
        <div className="product-image-container">
          <img 
            src={product.imgSrc[0]} 
            alt={product.title}
            className="product-image"
            loading="lazy"
          />
          
          {/* Discount Badge */}
          {hasDiscount && (
            <div className="discount-badge">
              <LocalOfferIcon className="discount-icon" />
              <span>-{discount.discountAmount}%</span>
            </div>
          )}
        </div>
      )}
      
      {/* Product Info */}
      <div className="product-info">
        <h3 className="product-title">{product.title}</h3>
        
        {/* Price Section */}
        <div className="product-price-section">
          {hasDiscount ? (
            <>
              <span className="original-price">R{originalPrice.toLocaleString()}</span>
              <span className="discounted-price">R{displayPrice.toLocaleString()}</span>
            </>
          ) : (
            <span className="regular-price">R{originalPrice.toLocaleString()}</span>
          )}
        </div>
        
        <p className="product-description">{product.description}</p>
        
        <div className="product-meta">
          <span className="product-type">{product.category[0]}</span>
          <span className="product-brand">{product.brand}</span>
        </div>
        
        {/* Action Buttons */}
        <div className="product-actions" onClick={(e) => e.stopPropagation()}>
          <CartlistButton product={product} />
          <WishlistButton product={product} />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;