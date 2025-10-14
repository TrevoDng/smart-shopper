import React, { useState } from "react";
import { ProductCategory, ProductModel } from "../types/Product";
import { title } from "process";
import ProductsCards from "../product-card/ProductsCads";

interface ProductGridProps {
    products: ProductModel[] | ProductCategory[];
    onSelectedType: (type: string) => void;
    selectedType: string;
    onItemId: (id: string) => void;
    selectedItemId?: string | null;
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
    selectedItemId, 
    onLoading, 
    loading
})=> {

    const [loadingDelay, setLoadingDelay] = useState<string | null>(null);

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

    return (
        <div className="products-main-container">
      {categories.map((category) => (
        <section key={category.typeId || category.type} className="product-category">
          <h2 style={{textAlign: "center"}}>
            {category.title}
          </h2>
          
          <hr 
            className={`${category.type}-category-line`} 
            style={{ width: "150px", height: "2px", border: "none", borderRadius: "5px"}} 
          />
          
          <div className={`items-container ${selectedType === category.type ? 'column-alignment' : ''}`}>        
            {category.models.map((product) => (
              <ProductsCards 
                    key={product.id}
                    product={{
                        ...product,
                        currency: product.currency || "R",
                        imgSrc: product.imgSrc
                    }}
                    selectedItemId={selectedItemId}
                    loading={loadingDelay}
                    onLoading={setLoadingDelay}
                    onItemId={onItemId}
                    onSelectedType={onSelectedType} onSelectedItemId={function (id: string | null): void {
                        throw new Error("Function not implemented.");
                    } }              />
            ))}
          </div>
        </section>
      ))}
    </div>
    )
}

export default ProductGrid;