import React, { useEffect, useRef, useState } from "react";
import { ProductCategory, ProductModel } from "../types/Product";
//import { title } from "process";
//import ProductsCards from "../product-card/ProductsCads";

import "./RandomProductGrid.css";
import { getFilteredProducts } from "../category-filter/filteredProducts";
import { combinedProducts } from "../data/demoData";
import { useContainerOverflow } from "../product-grid/useContainerOverflow";
import { LoadingProduct } from "../LoadingProduct";
import { useNavigate } from "react-router-dom";
import { WishlistButton } from "../wish-list/components/WishlistButton";
import { CartlistProvider } from "../cart/context/CartlistContext";
import { CartlistButton } from "../cart/components/CartlistButton";
import { useSlider } from "../../../slider/slidercontext/SliderContext";

interface PaginatedProducts {
    products: ProductModel[];
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

// Function to get all products flattened (not grouped by category)
function getAllProducts(categories: ProductCategory[]): ProductModel[] {
    return categories.flatMap(category => category.models);
}

// Function to shuffle array randomly
function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for(let i = shuffled.length - 1; i < 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
} 

// Function to get paginated random products
function getPaginatedRandomProducts(
    categories: ProductCategory[],
    itemsPerPage: number,
    currentPage: number,
): PaginatedProducts {
    // Get all products and shuffle them randomly
    const allProducts = getAllProducts(categories);
    const shuffledProducts = shuffleArray(allProducts);

    //calculate products
    const totalProducts = shuffledProducts.length;
    const totalPages = Math.ceil(totalProducts / itemsPerPage);
    const startIndex = (currentPage -1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    //get products for current page
    const paginatedProducts = shuffledProducts.slice(startIndex, endIndex);

    return {
        products: paginatedProducts,
        currentPage,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1
    };
}

interface RandomProductsPageProps {
  categories: ProductCategory[];
  onSelectedType: (type: string | null) => void;
  selectedType: string | null;
  onItemId: (id: string) => void;
  onLoading: (id: string | null) => void;
  loading?: string | null; 
} 


//Main Component
const RandomProductsGrid: React.FC<RandomProductsPageProps> = ({
    categories,
    onSelectedType, 
    selectedType,
    onItemId, 
    onLoading, 
    loading  
  }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6); //show 6 products per page
    const [paginatedData, setPaginatedData] = useState<PaginatedProducts>({
        products: [],
        currentPage: 1,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false
    });
    const navigate = useNavigate();
    const { hideSlider } = useSlider();

    useEffect(() => {
        const data = getPaginatedRandomProducts(categories, itemsPerPage, currentPage);
        setPaginatedData(data);
    }, [categories, currentPage, itemsPerPage]);

    const handleNextPage =()=> {
        if (paginatedData.hasNextPage) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const handlePreviousPage = () => {
        if (paginatedData.hasPreviousPage) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const handlePageClick = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const handleAddToCart=(e: React.MouseEvent<HTMLButtonElement>)=> {
      e.preventDefault();
      e.stopPropagation();
      console.log("button clicked");
    }

        const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    
    const getItemId =(type: string, id: string): void=> {
        if(timeoutRef.current) clearTimeout(timeoutRef.current);
        
          onLoading(id);
          //console.log(loading)
          
        timeoutRef.current = setTimeout(() => {
            //console.log(loading);
            onItemId(id);
            onLoading(null);
          navigate(`/single-product-page/${id}`);
            
            //onSelectedType(type);
        }, 3000);
        
        //hide slider
        //hideSlider;
    };

    useEffect(() => {
            return () => {
                if(timeoutRef.current) clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        }, []);

    return (
        <div className="random-products-page">
      <h2>Random Products</h2>
      
      {/* Products Grid */}
      <div className="products-grid">
        {paginatedData.products.map((product) => (
          <div key={product.id} className="product-card" 
          onClick={() => getItemId(product.type, product.id)}>
            {loading === product.id && (
                    <LoadingProduct loadingClass={"loading-product"}/> // Replace with your actual LoadingAnimation component
                  )}
            {/* Product Image */}
            {product.imgSrc && product.imgSrc.length > 0 && (
              <div className="product-image">
                <img 
                  src={product.imgSrc[0]} 
                  alt={product.title}
                  className="product-img"
                />
              </div>
            )}
            
            {/* Product Info */}
            <div className="product-info">
              <h3 className="product-model">{product.title} <span 
              className="price"
              style={{marginLeft: "auto"}}>{product.currency="R"}{product.price}</span></h3>
              <p className="product-description">{product.description}</p>
              <p className="product-type">Type: {product.type}</p>
              <p>Best Item</p>
              {/* View Details Button */}
              {/*<button 
                className="view-details-btn"
                onClick={(e) => handleAddToCart(e)}
              >
                Add to Cart
              </button>*/}
              {<CartlistButton product={product}/> }
              {<WishlistButton product={product} />}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="pagination-controls">
        <button 
          onClick={handlePreviousPage}
          disabled={!paginatedData.hasPreviousPage}
          className="pagination-btn"
        >
          Previous
        </button>
        
        {/* Page Numbers */}
        <div className="page-numbers">
          {Array.from({ length: paginatedData.totalPages }, (_, index) => index + 1).map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => handlePageClick(pageNumber)}
              className={`page-btn ${paginatedData.currentPage === pageNumber ? 'active' : ''}`}
            >
              {pageNumber}
            </button>
          ))}
        </div>
        
        <button 
          onClick={handleNextPage}
          disabled={!paginatedData.hasNextPage}
          className="pagination-btn"
        >
          Next
        </button>
      </div>

      {/* Page Info */}
      <div className="page-info">
        Page {paginatedData.currentPage} of {paginatedData.totalPages}
      </div>
    </div>
    )
}

export default RandomProductsGrid;

/*
interface RandomProductGridProps {
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

const RandomProductGrid: React.FC<RandomProductGridProps>=({
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
              hasOverflow && !selectedType && (
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

export default RandomProductGrid;
*/


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