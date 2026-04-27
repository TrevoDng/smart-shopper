// src/itemsComponents/products/category-filter/CategoryMainFilter.tsx
import React from "react";
import { Product } from "../types/Product";
import { getFilteredProducts } from "./filteredProducts";
import { LoadingProduct } from "../LoadingProduct";

import "./CategoryMainFilter.css";

interface ProductFilterProps {
    datas: Product[];
    onSelectedCategory: (category: string[]) => void;
    selectedCategory: string[];
}
const CategoryMainFilter: React.FC<ProductFilterProps> = ({
        datas,
        onSelectedCategory,
        selectedCategory
    }) => {
        const [loadingItem, setLoadingItem] = React.useState<string[] | null>(null);

const handleCategoryClick = (category: string[], e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
   const filteredProducts = getFilteredProducts(datas, category);
   
   setLoadingItem(filteredProducts.length > 0 ? category : null);
    
   const timer = setTimeout(()=> {
        setLoadingItem(null);
        onSelectedCategory(selectedCategory === category ? [] : category); // Toggle if same category clicked
       
    }, 2000);
    
    return ()=> {
        clearTimeout(timer);
    }
  };

  return (
      <div className="item-services" data-page-id="top-slide-design">
        <ul className="item-services-list">
          {datas.map((item, index) => (
            <li key={index}>
              <a 
                href={`#${item.category[0]}`} 
                className={`type-link ${selectedCategory === item.category ? 'active' : ''}`}
                onClick={(e) => {
                     handleCategoryClick(item.category, e);
                } }
                aria-busy={loadingItem === item.category}
             >
              {loadingItem === item.category &&
          <LoadingProduct loadingClass={"loading-product"}/>
      }
                <i className={`fa-solid ${item.category[0]}`}></i>
              </a>
              <p>{item.category[0].charAt(0).toUpperCase() + item.category[0].slice(1)}</p>
            </li>
          ))}
        </ul>
      </div> 
      )
}

export default CategoryMainFilter;