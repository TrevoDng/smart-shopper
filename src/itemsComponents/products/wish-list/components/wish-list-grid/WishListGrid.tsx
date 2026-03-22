import { useNavigate } from "react-router-dom";
import { SearchProductCard } from "../../../../../search/SearchProductCard"
import { useSlider } from "../../../../../slider/slidercontext/SliderContext";
//import { ProductCategory, ProductModel } from "../../../types/Product";
import { useWishlist } from "../../context/WishlistContext";

import './WishlistGrid.css';

interface WishListCardsProps {
    //product: ProductCategory[];
    currency?: string;
    onItemId: (id: string) => void;
    //onSelectedType: (type: string) => void;
    onLoading: (id: string | null) => void;
    loading?: string | null;
}

const WishListGrid: React.FC<WishListCardsProps>=({
    //product, 
    currency = "R ", 
    onItemId,   
    onLoading,
    loading
})=> {

    const { removeFromWishlist, wishlist } = useWishlist();
    const navigate = useNavigate();
    const {hideSlider} = useSlider();

    hideSlider();

    const handleRemove =(id: any)=> {
        removeFromWishlist(id);
    }

    const handleMoveToCart =(id: any)=> {
        console.log('Move to cart:', id);
    }
            
    const returnHome=()=> {
        navigate('/');
    }


   // console.log(JSON.stringify(wishlist));

   const testData = {
    name: "Trevor",
    surname: "Netshisaulu"
   };

   const saveTestData=(data: any)=> {
        localStorage.setItem("testData", JSON.stringify(data));
   }

   const getTestData=async (data: any)=> {
    const savedData = localStorage.getItem(`${data}`);
    const getData = await savedData;
    console.log(JSON.stringify(getData));
   }

   console.log(JSON.stringify(wishlist))

        if (wishlist.items.length === 0) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8 empty-cart-message">
                <div className="text-center py-16">
                    <i className="mx-auto text-gray-300 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
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
        );
    }



    return (
        <div className="wishlist-item border border-gray-200 rounded-lg p-4 mb-4 bg-white">
            {wishlist.items.map(product => (
          
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
                  <div className="flex justify-between items-center mt-4">
                      <div className="flex gap-2">
                          <button
                              onClick={()=>handleMoveToCart(product.product.id)}
                              className="wishlist-btn"
                          >
                              <i className='fas fa-shopping-cart item-cart-icon' />
                              Move to Cart
                          </button>

                          <button
                              onClick={()=> handleRemove(product.product.id)}
                              className="remove-btn"
                          >
                              <i className='fa-regular fa-trash-alt item-trash-icon' />
                              <span>Remove</span>
                          </button>
                      </div>
                  </div>
                  </div>
            
            ))}
        </div>
    )
}

export default WishListGrid;