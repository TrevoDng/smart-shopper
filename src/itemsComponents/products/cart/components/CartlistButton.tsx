import { useSlider } from "../../../../slider/slidercontext/SliderContext";
import { Product } from "../../types/Product";
import { useCartlist } from "../context/CartlistContext";
import './CartlistButton.css';

interface CartlistButtonProps {
    product: Product;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const CartlistButton: React.FC<CartlistButtonProps>=({
    product,
    size = 'md',
    className = ''
})=> {

    const { addToCartlist, removeFromCartlist, isInCartlist } = useCartlist();
        const isCartlisted = isInCartlist(product.id);
        const { hideSlider } = useSlider();
    
        const handleClick = (e: React.MouseEvent)=> {
            e.preventDefault();
            e.stopPropagation();
    
            if (isCartlisted) {
                removeFromCartlist(product.id);
            } else {
                addToCartlist(product);
            }
        };
    
        const sizeClasses = {
            sm: 'w-6 h-6',
            md: 'w-6 h-6',
            lg: 'w-6 h-10',
        };
    
        return (
            <button
          onClick={(e)=> handleClick(e)}
          className={`
            ${sizeClasses[size]}
            flex items-center justify-center
            bg-white rounded-full shadow-sm
            hover:shadow-md transition-all duration-200
            border border-gray-200
            ${isCartlisted ? 'text-red-500' : 'text-gray-600 hover:text-red-500'}
            ${className} 
            add-to-cart-btn ${isCartlisted ? 'cartlist-active' : 'add-to-cart-btn'}
          `}
          aria-label={isCartlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
            <i className="fas fa-shopping-cart"></i>
            {/*
          <Heart 
            className={isWishlisted ? 'fill-current' : ''} 
            size={size === 'sm' ? 14 : size === 'md' ? 16 : 18} 
          />
          */}
        </button>
        )
}