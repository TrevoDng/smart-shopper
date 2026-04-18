// pages/ProductsPage.tsx
import React, { useState } from 'react';
//import ProductGrid from './products-grid/ProductGrid';
import { combinedProducts } from './data/demoData';
import ProductGrid from './product-grid/ProductGrid';
import SingleOpenedProductPage from './single-opened-product/SingleOpenedProductPage';
//import { useSlider } from '../../slider/slidercontext/SliderContext';
//import Slider from '../../slider/Slider';
import { BackButton } from './back-button/BackButton';

import './ProductsPage.css';

/*
const SliderConditionalRenderer: React.FC = () => {
	const { isSliderVisible } = useSlider();
	return isSliderVisible ? <Slider /> : null;
}
*/

interface ProductsPageProps {
  selectedItemId: string | null; 
  setSelectedItemId: (id: string | null)=> void;
  setSelectedType: (type: string | null)=> void;
  selectedType: string | null;
  onLoading: (id: string | null)=> void;
  loading?: string | null;
}

//main products page
const ProductsPage: React.FC<ProductsPageProps> = ({
  selectedItemId, 
  setSelectedItemId,
  selectedType, 
  setSelectedType,
  onLoading,
  loading
}) => {
  //const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  //const [selectedType, setSelectedType] = useState<string | null>(null);
  const [typeById, setTypeById] = useState<number | null>(null);
  const [showSingleItem, setShowSingleItem] = useState(false);
  const [showCart, setShowCart] = useState(false);
  
  return (
    <div className="" id='products-grid-container'>

      { (selectedItemId || selectedType) &&
           ( <BackButton 
              selectedType={selectedType}
              selectedItemId={selectedItemId}
              onItemId={setSelectedItemId}
              onSelectedType={setSelectedType}
              onTypeById={setTypeById}
              onShowCart={setShowCart}
              showCart={showCart}
            />)
            }
      
      {!selectedItemId &&
        <ProductGrid 
          products={selectedType ? combinedProducts.filter(p => p.type === selectedType): combinedProducts} 
          onSelectedType={setSelectedType} 
          selectedType={selectedType}   
          onItemId={setSelectedItemId} 
          onLoading={onLoading}
          loading={loading} />}

      {/*selectedItemId &&
        <SingleOpenedProductPage itemsData={combinedProducts} itemId={selectedItemId} />
        */}
    </div>
  );
};

export default ProductsPage;

/**
 * <div className="min-h-screen bg-gray-50" id='products-grid-container'>
 */