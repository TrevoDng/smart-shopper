import { useRef, useState } from "react";
import { useSlider } from "../../../../slider/slidercontext/SliderContext";
import { Product, Size } from "../../types/Product";
import { useCartlist } from "../context/CartlistContext";
import './CartlistButton.css';

interface CartlistButtonProps {
    selectedSize: Size | null;
    product: Product;
    //size?: 'sm' | 'md' | 'lg';
    className?: string;
    title?: string;
}

export const CartlistButton: React.FC<CartlistButtonProps>=({
    product,
    //size = 'md',
    className = '',
    title,
    selectedSize
})=> {

      const [isDisabled, setIsDisabled] = useState<boolean>(false);
      const [isHovered, setIsHovered] = useState<boolean>(false);
      const divRef = useRef<HTMLDivElement>(null);

    const { addToCartlist, removeFromCartlist, isInCartlist, cartlist } = useCartlist();

      const handleMouseEnter=(e: React.MouseEvent<HTMLDivElement>)=> {
        e.preventDefault()
        if (divRef.current) {
            if ((product.category[0].split("/")[0] === "clothing" && !selectedSize) ) {
                setIsHovered(true);
            }
        }

         setTimeout(()=> {
            setIsHovered(false);
        }, 3000);
      }

        const isCartlisted = isInCartlist(product.id);
        const { hideSlider } = useSlider();
    
        const handleClick = (e: React.MouseEvent, productId: string)=> {
            e.preventDefault();
            e.stopPropagation();
    
            if (isCartlisted ) {
                
                /*
                cartlist.items.some(item => {
                    console.log(item.product.sizes[0].code)
                });
                */
                console.log(product.sizes[0].code);
                console.log(product.category[0].split('/')[0] === "clothing");
                const clothing: string = product.category[0].split('/')[0];

                cartlist.items.some(item => {
                    if(clothing === "clothing" && item.selectedSize?.code === selectedSize?.code) {
                        removeFromCartlist(item.id, clothing, selectedSize);    
                    } else if (clothing === "clothing" && item.selectedSize?.code !== selectedSize?.code) {
                        addToCartlist(product, selectedSize);
                    }
                });

                /*if (product.category[0].split('/')[0] === "clothing" &&  cartlist.items.some(item => item.selectedSize?.code === selectedSize?.code)) {
                    //alert("hi");
                    removeFromCartlist(product.id, clothing, selectedSize);
                } else if (product.category[0].split('/')[0] === "clothing" &&  cartlist.items.some(item => item.selectedSize?.code !== selectedSize?.code)) {
                    addToCartlist(product, selectedSize);
                }*/
            } else {
                addToCartlist(product, selectedSize);
            }
        };
    
        const sizeClasses = {
            sm: 'w-6 h-6',
            md: 'w-6 h-6',
            lg: 'w-6 h-10',
        };

        if (product.category[0].split("/")[0] === "clothing") {
            console.log(selectedSize);
          //  alert("For Clothes, Open the item and select the size to add to Cart List");
        }
        
        return (
            <div 
                    ref={divRef}
                    onMouseEnter={(e)=> handleMouseEnter(e)}>
                {isHovered &&
                <div   
                    className="add-to-cart-popup">For Clothes, Open the item 
                        and select the size to add to Cart List
                </div>
                    }
            <button
          onClick={(e)=> handleClick(e, product.id)}
          disabled={product.category[0].split("/")[0] === "clothing"  ? !selectedSize : false}
          className={`
            
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
            <i className="fas fa-shopping-cart"></i> {title}
            {/*
          <Heart 
            className={isWishlisted ? 'fill-current' : ''} 
            size={size === 'sm' ? 14 : size === 'md' ? 16 : 18} 
          />
          */}
        </button>
        </div>
        )
}