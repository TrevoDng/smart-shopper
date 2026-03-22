import React, { useEffect, useRef } from 'react';
import './SearchProductCard.css';
import { ProductModel } from "../itemsComponents/products/types/Product";
import { LoadingProduct } from '../itemsComponents/products/LoadingProduct';
import { useNavigate } from 'react-router-dom';

interface SearchProductsCardsProps {
    product: ProductModel;
    currency?: string;
    onItemId: (id: string) => void;
    //onSelectedType: (type: string) => void;
    onLoading: (id: string | null) => void;
    loading?: string | null;
}

export const SearchProductCard: React.FC<SearchProductsCardsProps> =({
    product, 
    currency = "R ", 
    onItemId, 
    //onSelectedType,  
    onLoading,
    loading
})=> {

           const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
           const navigate = useNavigate();
           
           const getItemId =(type: string, id: string): void=> {

               if(timeoutRef.current) //clearTimeout(timeoutRef.current);
               
               onLoading(id);
               
               timeoutRef.current = setTimeout(() => {
                   onItemId(id);
                   onLoading(null);
                   navigate(`/single-product-page/${id}`);
                   //onSelectedType(type);
               }, 3000);
           };
       
           
           useEffect(() => {
                   return () => {
                       if(timeoutRef.current) clearTimeout(timeoutRef.current);
                       timeoutRef.current = null;
                   }
               }, []);
    
    return (
        <div className="search-popup-container" 
        onClick={()=> getItemId(product.type, product.id)}>
            {loading === product.id && (
                    <LoadingProduct loadingClass={"loading-product"}/> // Replace with your actual LoadingAnimation component
                  )}
            <div className='search-img-container'>
            <img className="search-popup-img" 
            src={product.imgSrc[0]} alt={product.type}/>
            </div>
            <div className="search-popup-text-container">
                <h3>{product.title} <span style={{float: "right", color:"tomato"}}>{currency}{product.price}</span></h3>
                <p style={{color: "gray"}}>{product.description} Product description</p>
                <p>type: {product.type}</p>
                <p>{currency}{product.price}</p>
            </div>
        </div>
    )
}