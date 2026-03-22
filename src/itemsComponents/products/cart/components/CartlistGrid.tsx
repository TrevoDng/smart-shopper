import { useState } from "react";
import { SearchProductCard } from "../../../../search/SearchProductCard";
import { useSlider } from "../../../../slider/slidercontext/SliderContext";
import { useCartlist } from "../context/CartlistContext";
import './CartlistGrid.css';
import { cleanPrice } from "../../utils/filterUtils";

interface CartGridProps {
    currency?: string;
    onItemId: (id: string) => void;
    //onSelectedType: (type: string) => void;
    onLoading: (id: string | null) => void;
    loading?: string | null;
} 

const CartlistGrid: React.FC<CartGridProps>=({
    currency = "R ", 
    onItemId,   
    onLoading,
    loading
})=> {

     const { removeFromCartlist, cartlist, updateQuantity } = useCartlist();
     const {hideSlider} = useSlider();
     
     //hide slider
         hideSlider();
     
    
        const handleRemove =(id: any)=> {
            removeFromCartlist(id);
        }
    
        const handleMoveToCart =(id: any)=> {
            console.log('Move to cart:', id);
        }

        //calculate overroll total
        const overalTotal = cartlist.items.reduce(
            (sum, item) => sum + (cleanPrice(item.product.price) * item.quantity), 
            0
        );

    
    if(cartlist.items.length === 0) {
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
                        <i className="mr-2" />
                        Continue Shopping
                    </a>
                </div>
            </div>
        )
    }
    
    
    return (
        <div className="cartlist-cover-container">
            <div className="wishlist-item border border-gray-200 rounded-lg p-4 mb-4 bg-white">
                        {/*wise (product.product) from function parameter and type/CartlistItem interface */}
                        {cartlist.items.map(product => (
                        <div className="wishlist-grid-container">
                        <SearchProductCard
                              key={product.id}
                               product={{
                                  ...product.product,
                                  currency: product.product.currency,
                                  imgSrc: product.product.imgSrc,
                              }}
                              onItemId={onItemId}
                              onLoading={onLoading}
                              loading={loading} />

                              <div className="flex justify-between items-center mt-4" 
                                    style={{margin:"10px"}}>
                                  <div className="flex gap-2">
                                      <button
                                          onClick={()=>updateQuantity(product.product.id, product.quantity - 1)}
                                          disabled={product.quantity <= 1}
                                          className={`wishlist-btn decement ${product.quantity <= 1 ? 'disabled' : ''}`}
                                          aria-label="Decrease quantity"
                                      >-
                                      </button>
                                        <span style={{margin: "10px"}}>{product.quantity}</span>
                                      <button
                                          onClick={()=>updateQuantity(product.product.id, product.quantity + 1)}
                                          className="wishlist-btn"
                                      >+
                                      </button>
                                      <button
                                          onClick={()=> handleRemove(product.product.id)}
                                          className="remove-btn"
                                      >
                                          <i className='fa-regular fa-trash-alt item-trash-icon' />
                                          <span style={{margin: "10px"}}>Remove</span>
                                      </button>
                                  </div>
                              </div>
                              </div>
                        ))}
                    </div>
                    
                    {/*total and Checkout*/}
                    <div className="checkout-section">
                            <h3>Order summary</h3>
                        <p>Subtotal: {currency} {overalTotal}.00</p>
                        <button>Checkout now</button>
                    </div>
        </div>
    )
}

export default CartlistGrid;