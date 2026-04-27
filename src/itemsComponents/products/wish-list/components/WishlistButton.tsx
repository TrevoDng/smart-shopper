import { useSlider } from "../../../../slider/slidercontext/SliderContext";
import { Product } from "../../types/Product";
import { useWishlist } from "../context/WishlistContext";
//import { Heart } from 'lucide-react';

import './WishlistButton.css';

interface WishlistButtonProps {
    product: Product;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const WishlistButton: React.FC<WishlistButtonProps> =({
    product,
    size = 'md',
    className = ''
})=> {

    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const isWishlisted = isInWishlist(product.id);
     const { showSlider, hideSlider, toggleSlider, isSliderVisible } = useSlider();

    const handleClick = (e: React.MouseEvent)=> {
        e.preventDefault();
        e.stopPropagation();

        if (isWishlisted) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }

        hideSlider();
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
        ${isWishlisted ? 'text-red-500' : 'text-gray-600 hover:text-red-500'}
        ${className} 
        add-to-wishlist-btn ${isWishlisted ? 'wishlist-active' : 'add-to-wishlist-btn'}
      `}
      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    ><i className='fa-regular fa-heart item-heart-icon' />
        {/*
      <Heart 
        className={isWishlisted ? 'fill-current' : ''} 
        size={size === 'sm' ? 14 : size === 'md' ? 16 : 18} 
      />
      */}
    </button>
    )

}