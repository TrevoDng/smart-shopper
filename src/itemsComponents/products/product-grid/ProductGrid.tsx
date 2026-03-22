import React, { useEffect, useRef, useState } from "react";
import { ProductCategory, ProductModel } from "../types/Product";
//import { title } from "process";
import ProductsCards from "../product-card/ProductsCads";

import "./ProductGrid.css";
import { getFilteredProducts } from "../category-filter/filteredProducts";
import { combinedProducts } from "../data/demoData";
import { useContainerOverflow } from "./useContainerOverflow";

interface ProductGridProps {
    products: ProductModel[] | ProductCategory[];
   onSelectedType: (type: string | null) => void;
    selectedType: string | null;
    onItemId: (id: string) => void;
    onLoading: (id: string | null) => void;
    loading?: string | null;
}

// Helper function to get default icon (you'll need to implement this)
const getDefaultIcon = (type: string): string => {
    // Return a default icon URL based on the type
    const iconMap: {[key: string]: string } = {
        laptops: 'fa-laptop',
        desktops: 'fa-desktop',
        screens: 'fa-display',
        phones: 'fa-mobile',
        tablets: 'fa-tablet'
    };
    return iconMap[type] || 'fa-cube'; // Replace with actual logic
};

// Type guard to check if an item is a ProductCategory
const isProductCategory = (item: any): item is ProductCategory => {
  return item && Array.isArray(item.models);
};

const ProductGrid: React.FC<ProductGridProps>=({
    products, 
    onSelectedType, 
    selectedType,
    onItemId, 
    onLoading, 
    loading
})=> {

    const { containerRef, hasOverflow } = useContainerOverflow();


     const categories: ProductCategory[] = products.length > 0 && isProductCategory(products[0])  
    ? (products as ProductCategory[]) 
    : Object.values(
        (products as ProductModel[]).reduce((acc: { [key: string]: ProductCategory }, product: ProductModel) => ({
          ...acc,
          [product.type]: {
            type: product.type,
            icon: getDefaultIcon(product.type),
            title: product.type.toUpperCase(),
            typeId: acc[product.type]?.typeId || 0, // Default typeId
            models: [...(acc[product.type]?.models || []), product]
          }
        }), {})
    );

      const handleTypeClick=(type: string, e: React.MouseEvent<HTMLButtonElement, MouseEvent>)=> {
        e.preventDefault();
    
        const category = getFilteredProducts(combinedProducts, type);
    
        const timer = setTimeout(()=> {
          onSelectedType(category.length > 0 ? type : null);
        }, 2000);
    
        return ()=> {
          clearTimeout(timer);
        }
      }

    return (
        <div className="products-main-container">
      {categories.map((category) => (
        <section key={category.typeId || category.type} className="product-category">
          <h2 style={{textAlign: "center"}}>
            {category.title.toUpperCase()}
          </h2>
          
          <hr 
            className={`${category.type}-category-line`} 
            style={{ width: "150px", height: "2px", background: "#3498db", border: "none", borderRadius: "5px"}} 
          />
          
          <div className={`items-container ${selectedType === category.type ? 'column-alignment' : ''}`}
          ref={containerRef} 
          
          >        
            {category.models.map((product) => (
              <ProductsCards 
                    key={product.id}
                    product={{
                        ...product,
                        currency: product.currency || "R",
                        imgSrc: product.imgSrc
                    }}
                    loading={loading}
                    onLoading={onLoading}
                    onItemId={onItemId}
                    onSelectedType={onSelectedType} 
                                 />
            ))}

          {
              /*hasOverflow &&*/ !selectedType && (
                <div className="show-more-products-button-cover">
                <button className="show-more-products-button" 
                onClick={(e)=> {
                  handleTypeClick(category.type, e)
                }}>
                  More Products
                </button>
                </div>
              )
            }  
          </div>
          
        </section>
      ))}
    </div>
    )
}

export default ProductGrid;

/**
 * style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap'
          }}

          const checkOverFlow=()=> {
      if(containerRef.current) {
      const container = containerRef.current;
      const isOverFlow = container.scrollWidth > container.clientWidth;
      setShowMoreButton(isOverFlow);
      }
    }

    useEffect(()=> {
      checkOverFlow();
      window.addEventListener('resize', checkOverFlow);

      return ()=> {
        window.removeEventListener('resize', checkOverFlow);
      }
    }, []);
    
 */