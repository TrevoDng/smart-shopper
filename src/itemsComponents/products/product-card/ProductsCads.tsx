import { useRef, useEffect } from "react";
import { Product } from "../types/Product"
import { LoadingProduct } from "../LoadingProduct";

import "./ProductsCads.css";
import ProductsCardsProps from "./ProductsCardsProps";
import { useNavigate } from "react-router-dom";



const ProductsCards: React.FC<ProductsCardsProps> =({
    product, 
    currency = "R ", 
    onItemId, 
  
    onLoading, 
    loading 
})=> {

    const navigate = useNavigate();
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    
    const getItemId =(category: string[], id: string): void=> {
        if(timeoutRef.current) clearTimeout(timeoutRef.current);
        onLoading(id);
        timeoutRef.current = setTimeout(() => {
            onLoading(null);
            onItemId(id);
            //onSelectedType(type);
            navigate(`/single-product-page/${id}`);
        }, 3000);
    };

    useEffect(() => {
            return () => {
                if(timeoutRef.current) clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        }, []);

    return (
        <div 
      className={`item ${product.category}-item ${loading === product.id ? 'disabled' : ''}`} 
      onClick={() => getItemId(product.category, product.id)}
    >
      {loading === product.id && (
        <LoadingProduct loadingClass={"loading-product"}/> // Replace with your actual LoadingAnimation component
      )}
      <div className="img-container">
        <img src={product.imgSrc[0]} alt={product.title} />
        <button className="wishlist-btn item-icon-container">
          <i className="fa-regular fa-heart item-heart-icon" />
        </button>
      </div>
      <div className="product-info" 
      style={{padding:"0", margin:"0"}}>
        <h3>
          {product.title.toUpperCase()} 
          <span className="price">{currency}{product.price}</span>
        </h3>
        <p>{product.description}</p>
        <button className="add-to-cart-btn" 
          style={{padding:"10px", width:"100%", marginLeft:"0"}}>
            <i className="fas fa-shopping-cart" 
            style={{marginRight:"10px"}}></i>
          Add to Cart 
        </button> 
      </div>
    </div>
    )
}

export default ProductsCards;