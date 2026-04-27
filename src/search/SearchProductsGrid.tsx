import React from "react";
import { SearchProductCard } from "./SearchProductCard"
import { Product } from "../itemsComponents/products/types/Product";
import './SearchProductsGrid.css';

interface SearchProductsGridProps {
    products:  Product[]; 
    //onSelectedType: (type: string | null) => void;
    //selectedType: string | null;
    onItemId: (id: string) => void;
    onLoading: (id: string | null) => void;
    loading?: string | null;
}

const SearchProductsGrid: React.FC<SearchProductsGridProps>=({
    products, 
    onItemId,
    onLoading,
    loading,
})=> {

    return (
        <div className="search-products-grid-cover">
            {products.map((product)=> (
                <SearchProductCard 
                    key={product.id}
                    product={product}
                    onItemId={onItemId}
                    //onSelectedType={onSelectedType}
          //setSearchQuery={setSearchQuery}
          //searchQuery={searchQuery}
          onLoading={onLoading}
          loading={loading}/>
                ))
             }
          
        </div>
    )
}

export default SearchProductsGrid;