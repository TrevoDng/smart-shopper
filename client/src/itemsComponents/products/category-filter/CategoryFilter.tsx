import React from "react";
import { ProductCategory } from "../types/Product";
import { getFilteredProducts } from "./filteredProducts";
import { LoadingProduct } from "../LoadingProduct";

import "./CategoryFilter.css";

interface ProductFilterProps {
    datas: ProductCategory[];
    onSelectedType: (type: string | null) => void;
    selectedType: string | null;
}
const CategoryFilter: React.FC<ProductFilterProps> = ({
        datas,
        onSelectedType,
        selectedType
    }) => {
        const [loadingItem, setLoadingItem] = React.useState<string | null>(null);

const handleTypeClick = (type: string, e: React.MouseEvent<HTMLAnchorElement, MouseEvent> ) => {
    e.preventDefault();
   const category = getFilteredProducts(datas, type);
   
   setLoadingItem(category.length > 0 ? type : null);
    
   const timer = setTimeout(()=> {
        setLoadingItem(null);
        onSelectedType(selectedType === type ? null : type); // Toggle if same type clicked
       
    }, 2000);
    
    return ()=> {
        clearTimeout(timer);
    }
  };

  return (
     <div>
      <div className="item-services" data-page-id="top-slide-design">
      
        <ul className="item-services-list">
          {datas.map((item, index) => (
            <li key={index}>
              <a 
                href={`#${item.type}`} 
                className={`type-link ${selectedType === item.type ? 'active' : ''}`}
                onClick={(e) => {
                     handleTypeClick(item.type, e);
                } }
                aria-busy={loadingItem === item.type}
              >
              {loadingItem == item.type &&
          <LoadingProduct loadingClass={"overlay"}/>
      }
                <i className={`fa-solid ${item.icon}`}></i>
              </a>
              <p>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</p>
            </li>
          ))}
        </ul>
      </div> 
      </div>
      )
}

export default CategoryFilter;