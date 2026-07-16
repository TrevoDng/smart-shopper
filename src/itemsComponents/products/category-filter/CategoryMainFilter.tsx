// src/itemsComponents/products/category-filter/CategoryMainFilter.tsx
import React, { useCallback } from "react";
import { Product } from "../types/Product";
import { LoadingProduct } from "../LoadingProduct";
// @ts-ignore
import "./CategoryMainFilter.css";
//import { Category } from "@mui/icons-material";

export interface CategoryMainFilterProps {
    datas: Product[];
    selectedMainCategory: string | null;
    onSelectedMainCategory: (mainCategory: string | null) => void;
    onSelectedCategories: (categories: string[]) => void;
    onBrandChange: (brands: string[]) => void;
}

const CategoryMainFilter: React.FC<CategoryMainFilterProps> = ({
    datas,
    selectedMainCategory,
    onSelectedMainCategory,
    onSelectedCategories,
    onBrandChange,
}) => {
    const [loadingItem, setLoadingItem] = React.useState<string | null>(null);
    const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    const getUniqueMainCategories = useCallback((products: Product[]): string[] => {
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
    }, []);

    const uniqueMainCategories = getUniqueMainCategories(datas);

    const handleCategoryClick = useCallback((
        mainCategoryValue: string, 
        e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
    ) => {
        e.preventDefault();
        console.log("Clicked Main Category: ", mainCategoryValue);
        
        // Clear any existing timer
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        
        // Reset filters when changing main category
        onSelectedCategories([]);
        onBrandChange([]);
        
        // Show loading state
        setLoadingItem(mainCategoryValue);
        
        // Set timer to simulate loading and update category
        timerRef.current = setTimeout(() => {
            setLoadingItem(null);
            
            // If clicking the same category, keep it selected (or you could deselect)
            // To allow deselecting, uncomment the line below and comment the next one
            // const isSameCategory = selectedMainCategory === mainCategoryValue;
            // onSelectedMainCategory(isSameCategory ? null : mainCategoryValue);
            // Current behavior: selecting same category does nothing (keeps it selected)

            if (mainCategoryValue === "All") {
                datas.map((category, index) => {
                    //return onSelectedMainCategory(category);
                return onSelectedMainCategory(category.category[index])
            })
            } else {
                onSelectedMainCategory(mainCategoryValue);
            }

            
        }, 500);
    }, [onSelectedCategories, onBrandChange, onSelectedMainCategory, selectedMainCategory]);

    // Cleanup timer on unmount
    React.useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    const showAllCategories =(category: string)=> {
        onSelectedCategories([]);
        onSelectedMainCategory(null);
    }

    const allCategories = ["All"];

    // If no categories, don't render
    if (uniqueMainCategories.length === 0) {
        return null;
    }

    return (
        <div className="item-services" data-page-id="top-slide-design">
            <ul className="item-services-list">
                {allCategories.map((category, index)=> {
                    const isLoading = loadingItem === category;

                    return (
                        <li>
                            <a 
                                className={`type-link 'active'`}
                                onClick={(e) => handleCategoryClick(category, e)}
                                style={{cursor: "pointer"}}
                            >
                                {isLoading && (
                                    <LoadingProduct loadingClass={"loading-product"} />
                                )}
                                    <span className="category-name">
                                        All
                                    </span>
                                </a>
                            </li>
                            )
                    })
                }

                {uniqueMainCategories.map((category, index) => {
                    const isActive = selectedMainCategory === category;
                    const isLoading = loadingItem === category;
                    
                    return (
                        <li key={index}>
                            <a 
                                href={`#${category}`} 
                                className={`type-link ${isActive ? 'active' : ''}`}
                                onClick={(e) => handleCategoryClick(category, e)}
                                aria-busy={isLoading}
                                aria-label={`Filter by ${category}`}
                            >
                                {isLoading && (
                                    <LoadingProduct loadingClass={"loading-product"} />
                                )}
                                <span className="category-name">
                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                </span>
                            </a>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default CategoryMainFilter;

/*
// src/itemsComponents/products/category-filter/CategoryMainFilter.tsx
import React from "react";
import { Product } from "../types/Product";
import { LoadingProduct } from "../LoadingProduct";
import "./CategoryMainFilter.css";

interface CategoryMainFilterProps {
    datas: Product[];
    selectedMainCategory: string | null ; // Changed from selectedCategory
    onSelectedMainCategory: (mainCategory: string | null) => void; // Changed to accept full path or null
    onSelectedCategories: (categories: string[])=> void;
    onBrandChange: (brands: string[])=> void;
}

const CategoryMainFilter: React.FC<CategoryMainFilterProps> = ({
        datas,
        selectedMainCategory,
        onSelectedMainCategory,
        onSelectedCategories,
        onBrandChange,
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
            onSelectedCategories([]);
            onBrandChange([]);
            setLoadingItem(mainCategoryValue);
            
            const timer = setTimeout(() => {
                setLoadingItem(null);
                
                const isSameCategory = selectedMainCategory === mainCategoryValue;
                onSelectedMainCategory(isSameCategory ? selectedMainCategory : mainCategoryValue);
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
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                            </a>
                            
                        </li>
                    ))}
                </ul>
            </div> 
        )
}

export default CategoryMainFilter;
*/