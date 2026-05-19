// src/itemsComponents/products/category-filter/CategoryMainFilter.tsx
import React from "react";
import { Product } from "../types/Product";
import { LoadingProduct } from "../LoadingProduct";
import "./CategoryMainFilter.css";

interface CategoryMainFilterProps {
    datas: Product[];
    selectedMainCategory: string | null ; // Changed from selectedCategory
    onSelectedMainCategory: (mainCategory: string | null) => void; // Changed to accept full path or null
}

const CategoryMainFilter: React.FC<CategoryMainFilterProps> = ({
        datas,
        selectedMainCategory,
        onSelectedMainCategory
    }) => {
        const [loadingItem, setLoadingItem] = React.useState<string | null>(null);

        const getUniqueMainCategories = (products: Product[]): string[]=> {
            const categories = products
                .map(product => {
                    if (Array.isArray(product.category) && product.category.length > 0) {
                        const mainCategory = product.category[0].split('/')[0];
                        return mainCategory;
                    }
                    return null;
                })
                .filter((category): category is string => category !== null);

                return [...new Set(categories)];
        }

        const uniqueMainCategories = getUniqueMainCategories(datas);

        const handleCategoryClick = (mainCategoryValue: string, e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
            e.preventDefault();
            
            setLoadingItem(mainCategoryValue);
            
            const timer = setTimeout(() => {
                setLoadingItem(null);
                
                const isSameCategory = selectedMainCategory === mainCategoryValue;
                onSelectedMainCategory(isSameCategory ? null : mainCategoryValue);
            }, 500);
            
            return () => clearTimeout(timer);
        };

        console.log("Selected Main Category: ", selectedMainCategory);

        return (
            <div className="item-services" data-page-id="top-slide-design">
                <ul className="item-services-list">
                    {uniqueMainCategories.map((category, index) => (
                        <li key={index}>
                            <a 
                                href={`#${category}`} 
                                className={`type-link ${selectedMainCategory === category ? 'active' : ''}`}
                                onClick={(e) => handleCategoryClick(category, e)}
                                aria-busy={loadingItem === category}
                            >
                                {loadingItem === category &&
                                    <LoadingProduct loadingClass={"loading-product"}/>
                                }
                                <i className={`fa-solid ${category}`}></i>
                            </a>
                            <p>{category.charAt(0).toUpperCase() + category.slice(1)}</p>
                        </li>
                    ))}
                </ul>
            </div> 
        )
}

export default CategoryMainFilter;