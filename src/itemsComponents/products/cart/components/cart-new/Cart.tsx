  // components/Cart.tsx
import React, { useState } from 'react';
import { SearchProductCard } from "../../../../../search/SearchProductCard";
import { useSlider } from "../../../../../slider/slidercontext/SliderContext";
import { useCartlist } from "../../context/CartlistContext";
import { cleanPrice } from "../../../utils/filterUtils";
import styles from './Cart.module.css';
import CartItem from './CartItem';
import { useNavigate } from 'react-router-dom';
import PaymentMethodSelector from '../../checkout/all-payments-options/PaymentMethodSelector';

interface CartGridProps {
    currency?: string;
    onItemId: (id: string) => void;
    //onSelectedType: (type: string) => void;
    onLoading: (id: string | null) => void;
    loading?: string | null;
}

const Cart: React.FC<CartGridProps>=({
    currency = "R ", 
    onItemId,
    onLoading,
    loading
})=> {

    const [showPaymentPopup, setShowPaymentPopup] = useState<boolean>(false);
    const { removeFromCartlist, cartlist, updateQuantity, clearCartlist } = useCartlist();
         const {hideSlider} = useSlider();
         //hide slider
             hideSlider();

             const navigate = useNavigate();
        
            const handleRemove =(id: any)=> {
                removeFromCartlist(id);
            }
        
            const handleMoveToCart =(id: any)=> {
                console.log('Move to cart:', id);
            }

            const handleCheckout=()=> {
              navigate('/checkout')
            }
            
            const returnHome=()=> {
              navigate('/');
            }

            const handleSelect=(method: string)=> {
              setShowPaymentPopup(false);
            } 
    
            //calculate overroll total
            const overalTotal = cartlist.items.reduce(
                (sum, item) => sum + (cleanPrice(item.product.price) * item.quantity), 
                0
            );
    
 
  if (cartlist.items.length === 0) {
    return (
            <div className="max-w-4xl mx-auto px-4 py-8 empty-cart-message">
                <div className="text-center py-16">
                    <i className="mx-auto text-gray-300 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cartlist is empty</h2>
                    <p className="text-gray-600 mb-6">Start adding items you love!</p>
                    <a
                        href="/"
                        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <i className="mr-2" 
                        onClick={returnHome}/>
                        Continue Shopping
                    </a>
                </div>
            </div>
        )
  }
    

  return (
    <div className={styles.cartContainer}>
      <div className={styles.cartItems}>
        <h2>Shopping Cart ({cartlist.items.length} items)</h2>
        {cartlist.items.map(product => (
          <CartItem  
            key={product.id}
                product={{
                ...product.product,
                currency: product.product.currency,
                imgSrc: product.product.imgSrc,
                        }}
                onItemId={onItemId}
                onLoading={onLoading}
                loading={loading}
                quantity={product.quantity}
          />
        ))}
      </div>

      <div className={styles.cartSummary}>
        <h3>Order Summary</h3>
        <div className={styles.summaryRow}>
          <span>Subtotal ({cartlist.items.length} items)</span>
          <span>R{overalTotal.toFixed(2)}</span>
        </div>
        <div className={styles.summaryRow}>
          <span>Shipping</span>
          <span>Calculated at checkout</span>
        </div>
        <div className={`${styles.summaryRow} ${styles.totalRow}`}>
          <span>Total</span>
          <span>R{overalTotal.toFixed(2)}</span>
        </div>
        <button className={styles.checkoutBtn} 
                onClick={()=> setShowPaymentPopup(true)}>Proceed to Checkout</button>
        <button onClick={clearCartlist} className={styles.clearBtn}>
          Clear Cart
        </button>
      </div>
      {
        <PaymentMethodSelector 
          isOpen={showPaymentPopup}
          onSelect={handleSelect}
          onClose={()=> setShowPaymentPopup(false)} />
      }
    </div>
  );
};

export default Cart;