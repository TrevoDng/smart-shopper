  // components/CartItem.tsx
import React, { useEffect, useRef } from 'react';
//import { CartItem as CartItemType } from '../types/cart.types';
//import { useCart } from '../context/CartContext';
import styles from './CartItem.module.css';
import { Product } from '../../../types/Product';
import { useNavigate } from 'react-router-dom';
import { cleanPrice } from '../../../utils/filterUtils';
import { useCartlist } from '../../context/CartlistContext';
import { CartlistItem } from '../../type/CartlistItem';
import { LoadingProduct } from '../../../LoadingProduct';
import { getFullImageUrl } from '../../../utils/getFullImageUrl';

interface CartCardProps {
    product: Product;
    quantity: number; /** challenge solved by adding quantity as props, type: number */
    currency?: string;
    onItemId: (id: string) => void;
    //onSelectedType: (type: string) => void;
    onLoading: (id: string | null) => void;
    loading?: string | null;
}

const CartItem: React.FC<CartCardProps> = ({ 
    product, 
    quantity,
    currency = "R ", 
    onItemId, 
    //onSelectedType,  
    onLoading,
    loading
 }) => {
           const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
           const navigate = useNavigate();

           const { removeFromCartlist, cartlist, updateQuantity } = useCartlist();
           
           const getItemId =(id: string): void=> {

               if(timeoutRef.current) //clearTimeout(timeoutRef.current);
               
               onLoading(id);
               
               timeoutRef.current = setTimeout(() => {
                   onItemId(id);
                   onLoading(null);
                   navigate(`/single-product-page/${id}`);
                   //onSelectedType(type);
               }, 1000);
           };
       
           const handleRemove=(id: string)=> {
                removeFromCartlist(id);
           }

           useEffect(() => {
                   return () => {
                       if(timeoutRef.current) clearTimeout(timeoutRef.current);
                       timeoutRef.current = null;
                   }
               }, []);

  return (
    <div className={styles.cartItem}>
      <img src={getFullImageUrl(product.imgSrc[0])} alt={product.title} className={styles.itemImage} 
          onClick={()=> getItemId(product.id)}/>
      <div className={styles.itemDetails} 
          onClick={()=> getItemId(product.id)}>
        <h3 className={styles.itemName}>{product.title}</h3>
        <p className={styles.itemPrice}>${product.price}</p>
      </div>
      <div className={styles.quantityControl}>
        <button className={styles.quantityBtn}
                disabled={quantity <= 1} 
                onClick={()=> updateQuantity(product.id, quantity - 1)}>-</button>
        <span className={styles.quantity}>{quantity}</span>
        <button  className={styles.quantityBtn} 
                onClick={()=> updateQuantity(product.id, quantity + 1)}>+</button>
      </div>
      <div className={styles.itemTotal}>
        R{(cleanPrice(product.price) * quantity).toFixed(2)}
      </div>
      <button
        onClick={()=> handleRemove(product.id)}
        className={styles.removeBtn}
        aria-label="Remove item"
      >
        ✕
      </button>
    </div>
  );
};

export default CartItem;
