import React, { useEffect, useRef, useState } from "react";
import { ProductCategory, ProductModel } from "../types/Product";

import './OpenedProductPage.css';
import ImagePopup from "../image-popup/ImagePopup";
import { handleDescriptionHeight } from "./descriptionHeight/getDescriptionheight";
import { useSlider } from "../../../slider/slidercontext/SliderContext";
import { useNavigate, useParams } from "react-router-dom";
import { getPaymentMethodSelector } from "../cart/checkout/all-payments-options/getPaymentMethod";
import PaymentMethodSelector from "../cart/checkout/all-payments-options/PaymentMethodSelector";

interface OpenedProductPageProps {
    itemsData: ProductCategory[];
    setSelectedItemId: (id: string | null)=> void;
    itemId: string | null;
    itemType?: string; // Made optional since it's not used in the component
} 

interface Size {
  code: string;
  name: string;
  inStock: boolean;
  type: "string" | "number";
}

interface Notification {
  message: string;
  type: string;
  visible: boolean;
}

const SingleOpenedProductPage: React.FC<OpenedProductPageProps>=({
    itemsData, 
    setSelectedItemId,
    itemId
})=> {

  const [imgIndex, setImgIndex] = useState(0);
  const [isDescriptioExpand, setIsDescriptioExpand] = useState(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);

  const descriptionRef = React.useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [notification, setNotification] = useState<Notification>({
    message: '',
    type: '',
    visible: false
  });
    const {hideSlider} = useSlider();
      hideSlider();

    //popup image
    const [showImagePopup, setShowImagePopup] = useState<boolean>(false);
  const [productImages, setProductImages] = useState<string[]>([]);

  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  useEffect(()=> {
    const loadProducts = async()=> {
      if (id) {
      setSelectedItemId(id);
      
      try {
        setLoading(true);

      } catch {
        console.log("id not found");
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
    }

    loadProducts();
    
  }, [id]);

  if (loading) return(<div>Loading...</div>);


   const matchedProduct: any = itemsData
  .flatMap((product: ProductCategory) => product.models)
  .find((model: ProductModel) => model.id === itemId);

  if(!matchedProduct) {
    return <div>Product not found</div>
  }
  // Handle Image Click to show popup
  const handleImageClick=()=> {
    if (matchedProduct) {
      setProductImages(matchedProduct.imgSrc);
      setShowImagePopup(true);
    }
  }

  const closeImagePopup =()=> {
    setShowImagePopup(false);
  };
    
  
  const changeImage=(index: number)=> {
    setImgIndex(index);
  }

   const hasSizeOptions = matchedProduct?.size && matchedProduct?.size.length > 0;

  // Sample size data - in a real app this would come from props or API
  const sizeData: { sizes: Size[] } = {
    sizes: [
      { code: "XS", name: "Extra Small (US 5)", inStock: true, type: "string" },
      { code: "S", name: "Small (US 6-7)", inStock: true, type: "string" },
      { code: "M", name: "Medium (US 8-9)", inStock: true, type: "string" },
      { code: "L", name: "Large (US 10-11)", inStock: false, type: "string" },
      { code: "6", name: "Size 6 (EU 39)", inStock: true, type: "number" },
      { code: "7", name: "Size 7 (EU 40)", inStock: true, type: "number" },
      { code: "8.5", name: "Size 8.5 (EU 42)", inStock: true, type: "number" },
      { code: "10", name: "Size 10 (EU 44)", inStock: false, type: "number" },
      { code: "One Size", name: "One Size Fits All", inStock: true, type: "string" }
    ]
  };

  const handleSizeChange =(e: React.ChangeEvent<HTMLSelectElement>): void=> {
    const selectedValue = e.target.value;

    if (selectedValue) {
      const size = sizeData.sizes.find(s => 
        s.code === selectedValue || s.code.toString() === selectedValue);
        if (size) {
          setSelectedSize(size);
          showNotification(`Size ${size.code} selected`, 'success');
        }
    } else {
      setSelectedSize(null);
    }
  };

  const handleSizeGuideClick= (): void => {
    alert("Size Conversion Guide:\n\n"
      + "XS - US 5 / EU 36\n"
      + "S - US 6-7 / EU 37-38\n"
      + "M - US 8-9 / EU 39-40\n"
      + "L - US 10-11 / EU 41-42\n"
      + "Numeric sizes correspond to US sizes\n"
      + "Half sizes available for some models");
  } 

  const handleAddToCart = (): void => {
    if (selectedSize) {
      showNotification(`Added ${matchedProduct!.title} (Size: ${selectedSize.code}) to cart`, 'success');
      //data will be sent to database from here. 
    }
  }

  const showNotification=(message: string, type: string): void => {
    setNotification({message, type, visible: true});
    setTimeout(()=> {
      setNotification(prev => ({...prev, visible: false}));
    }, 3000);
  }

  const closeDescriptionDropdown=(): void =>{
      if (isDescriptioExpand && descriptionRef.current) {
            descriptionRef.current.style.height = '0px';
            setIsDescriptioExpand(false);
      }
  }

  const handleCheckout=()=> {
    navigate('/checkout')
  }

  const handleSelect=(method: string)=> {
    setShowPopup(false);
  }

    
    return (
        <div className="products-container">
              <div className="items-container">
                
                <div className="inner-items-container active">
                  {/**navigate images */}
                  <div className="img-choice-container">
                      {matchedProduct.imgSrc.map((image: string, index: number)=> {
                        return <img src={image} key={index} onClick={(e)=> changeImage(index)}/>
                      })
                    }
                  </div>

                    <div className="item-img-container">
                      <img 
                        src={matchedProduct.imgSrc[imgIndex]} 
                        data-img={matchedProduct.imgSrc} 
                        className="inner-item-img" 
                        alt={matchedProduct.title}
                        onClick={handleImageClick}
                      />
                    </div>

                  <div className="items-data" data-target={matchedProduct.id}>
                    
                    {/* Image container was here*/}
                    
                    <h4 className="inner-item-description">
                      {matchedProduct.title.toUpperCase()} 
                      <span className="inner-item-price">{matchedProduct.price}</span>
                    </h4>
                    
                    <span className="inner-item-description" style={{ padding: '10px' }}>
                      {matchedProduct.description}
                    </span>

                    
                      <div className="product-container">
                        {hasSizeOptions && (
                        <div className="size-selector">
                          <span className="size-title">Select Size</span>
                          <div className="custom-dropdown">
                            <select 
                              className="dropdown-select" 
                              id="sizeDropdown"
                              onChange={handleSizeChange}
                              defaultValue=""
                            >
                              <option value="" disabled>Choose your size</option>
                              {sizeData.sizes.map(size => (
                                <option 
                                  key={size.code} 
                                  value={size.code}
                                  disabled={!size.inStock}
                                >
                                  {size.code} - {size.name}{!size.inStock && " (Out of Stock)"}
                                </option>
                              ))}
                            </select>
                          </div>
                          <span 
                            className="size-guide" 
                            id="sizeGuide"
                            onClick={handleSizeGuideClick}
                            style={{ cursor: 'pointer' }}
                          >
                            Size Guide
                          </span>
                          
                          {selectedSize && (
                            <div className="size-display" id="sizeDisplay">
                              Selected: {selectedSize.name}
                            </div>
                          )}
                        </div>
                          )}

                        <div className="action-buttons-container">
                          <button 
                            className="add-to-cart" 
                            id="addToCart" 
                            disabled={!selectedSize}
                            onClick={handleAddToCart}
                          >
                            <i className="fas fa-shopping-cart"></i>Add to Cart
                          </button>
                          <button className="buy-now" 
                          onClick={()=> setShowPopup(true)}>
                            <i className="fas fa-bolt"></i> Buy Now
                          </button>
                          <button className="wishlist">
                            <i className="far fa-heart"></i> Wishlist
                          </button>
                        </div>
                        {notification.visible && (
                          <div className={`notification ${notification.type}`} id="notification">
                            {notification.message}
                          </div>
                        )}
                      </div>
                    
                        {
                          <div>
                    <div className="button-container" 
                    onClick={(e)=> handleDescriptionHeight(
                            e,
                            descriptionRef as React.RefObject<HTMLDivElement>,
                            isDescriptioExpand,
                            setIsDescriptioExpand,
                            closeDescriptionDropdown
                          )}>
                      <button className="item-description-btn">
                        Product details<span 
                        className="item-description-icon" 
                        >{isDescriptioExpand ? <i className="fa-solid fa-minus"></i> : <i className="fa-solid fa-plus"></i>}</span></button>
                      
                    
                      
                    <div className="item-long-description"
                          ref={descriptionRef}>
                      <p>{matchedProduct.longDescription}</p>
                    </div>
                    </div>
                    </div>
                    }
                  </div>
                </div>
              </div>
              {showImagePopup && (
                <ImagePopup 
                  images={productImages} 
                  onClose={closeImagePopup} 
                />
              )}

              {
                <PaymentMethodSelector 
                  onSelect={handleSelect}  
                  isOpen={showPopup} 
                  onClose={()=> setShowPopup(false)}/>
              }
    </div>
    )
}

export default SingleOpenedProductPage;