import { useRef, useEffect } from "react";
import { ProductModel } from "../types/Product"

import "./ProductsCards.css";
import { LoadingProduct } from "../LoadingProduct";

interface ProductsCradsProps {
    product: ProductModel;
    currency?: string;
    onItemId: (id: string) => void;
    onSelectedItemId: (id: string | null) => void;
    selectedItemId?: string | null;
    onSelectedType: (type: string) => void;
    onLoading: (id: string | null) => void;
    loading?: string | null;   
}

const ProductsCards: React.FC<ProductsCradsProps> =({
    product, 
    currency = "R", 
    onItemId, 
    onSelectedType, 
    selectedItemId, 
    onLoading, 
    loading 
})=> {

    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    
    const getItemId =(type: string, id: string): void=> {
        if(timeoutRef.current) clearTimeout(timeoutRef.current);
        onLoading(id);
        timeoutRef.current = setTimeout(() => {
            onLoading(null);
            onItemId(id);
            onSelectedType(type);
        }, 3000);

        useEffect(() => {
            return () => {
                if(timeoutRef.current) clearTimeout(timeoutRef.current);
            }
        }, []);
    };

    return (
        <div 
      className={`item ${product.type}-item ${loading === product.id ? 'disabled' : ''}`} 
      onClick={() => getItemId(product.type, product.id)}
    >
      {loading === product.id && (
        <LoadingProduct loadingClass={"loading-product"}/> // Replace with your actual LoadingAnimation component
      )}
      <div className="img-container">
        <img src={product.imgSrc[0]} alt={product.model} />
        <button className="wishlist-btn item-icon-container">
          <i className="fa-regular fa-heart item-heart-icon" />
        </button>
      </div>
      <div className="product-info">
        <h3>
          {product.model} 
          <span className="price">{currency}{product.price}</span>
        </h3>
        <p>{product.description}</p>
        <button className="add-to-cart-btn">
          Add to Cart {selectedItemId}
        </button> 
      </div>
    </div>
    )
}

export default ProductsCards;