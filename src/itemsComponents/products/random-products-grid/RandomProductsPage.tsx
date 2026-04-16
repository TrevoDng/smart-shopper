// src/itemsComponents/products/random-products-grid/RandomProductsPage.tsx
import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { ProductCategory, ProductModel } from "../types/Product";
//import ProductsCards from "../product-card/ProductsCads";
import "./RandomProductGrid.css";
import { LoadingProduct } from "../LoadingProduct";
import { useNavigate } from "react-router-dom";
import { WishlistButton } from "../wish-list/components/WishlistButton";
import { CartlistButton } from "../cart/components/CartlistButton";
import TypeFilter from "../aside-filter-section/TypeFilter";
import { 
  getAllProducts,
  applyMultipleFilters,
  cleanPrice,
  //getProductsFromSearch
} from "../utils/filterUtils";
import { useAdaptedProducts } from "../../../hooks/useAdaptedProducts";
import { productAdapter } from "../../../services/productAdapter";

import './RandomProductsPage.css';
import { useMediaQuery } from "../../../screen-size/useMediaQuery";
//import ProductsPage from "../ProductsPage";

interface PaginatedProducts {
  products: ProductModel[];
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface RandomProductsPageProps {
  categories: ProductCategory[];
  searchedResults?: ProductCategory[]; // Optional search results
  onSelectedType: (type: string | null) => void;
  selectedType: string | null;
  onItemId: (id: string) => void;
  onLoading: (id: string | null) => void;
  loading?: string | null; 
}

// FIXED shuffleArray function
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  //shuffled.length 
  //is the number is going to run the shuffle
  for(let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Function to get paginated products with all filters
function getPaginatedProducts(
  allProducts: ProductModel[],
  itemsPerPage: number,
  currentPage: number,
  shuffle: boolean = true
): PaginatedProducts {
  // Shuffle products if needed
  const displayProducts = shuffle ? shuffleArray(allProducts) : allProducts;
  
  // Calculate pagination
  const totalProducts = displayProducts.length;
  const totalPages = Math.ceil(totalProducts / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalProducts);

  console.log("allProducts", allProducts.length);
  
  // Get products for current page
  const paginatedProducts = displayProducts.slice(startIndex, endIndex);
  
  return {
    products: paginatedProducts,
    currentPage,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1
  };
}

const RandomProductsPage: React.FC<RandomProductsPageProps> = ({
  categories,
  searchedResults = [],
  onSelectedType, 
  selectedType,
  onItemId, 
  onLoading, 
  loading  
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  
  // Filter states
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);
  const [showFilter, setShowFilter] = useState(false);

  const isMobile = useMediaQuery('(max-width: 768px)');

    // Fetch real products from database
  const { 
    categories: adaptedCategories, 
    loading: productsLoading, 
    error: productsError,
    refresh 
  } = useAdaptedProducts();

  // Use real data if available, otherwise fallback to demo data
  const allCategories = adaptedCategories.length > 0 ? adaptedCategories : categories;

  function handleShowFilter() {
    showFilter ? setShowFilter(false) : setShowFilter(true);
  }
  
  const [paginatedData, setPaginatedData] = useState<PaginatedProducts>({
    products: [],
    currentPage: 1,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false
  });
  
  const navigate = useNavigate();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Determine base data source: search results or categories
  const baseDataSource = useMemo(() => {
    return searchedResults.length > 0 ? searchedResults : allCategories;
  }, [allCategories, searchedResults]);
  
  // const baseDataSource = useMemo(() => {
  //   return searchedResults.length > 0 ? searchedResults : categories;
  // }, [categories, searchedResults]);
  
  // Calculate price limits
  const priceLimits = useMemo(() => {
    const allProducts = getAllProducts(baseDataSource);
    const prices = allProducts.map(product => cleanPrice(product.price));
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  }, [baseDataSource]);
  
  // Initialize price range with actual limits
  useEffect(() => {
    if (priceLimits.min !== undefined && priceLimits.max !== undefined) {
      setPriceRange([priceLimits.min, priceLimits.max]);
    }
  }, [priceLimits]);
  
  // Apply all filters
  //the problem must be here
  const filteredProducts = useMemo(() => {
    return applyMultipleFilters(baseDataSource, {
      selectedTypes,
      selectedBrands,
      priceRange
    });
  }, [baseDataSource, selectedTypes, selectedBrands, priceRange]);
  console.log("applyMultipleFilters", applyMultipleFilters(baseDataSource, {
      selectedTypes,
      selectedBrands,
      priceRange
    }).length);
  
  // Get paginated data
  //this controll products:
  //1. page
  //2. price
  //3. type
  //4. brand
  //5. random
  const paginatedProducts = useMemo(() => {
    return getPaginatedProducts(filteredProducts, itemsPerPage, currentPage, true);
  }, [filteredProducts, itemsPerPage, currentPage]);
  
  // Update paginated data
  useEffect(() => {
    setPaginatedData(paginatedProducts);
  }, [paginatedProducts]);
  
  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTypes, selectedBrands, priceRange, baseDataSource]);
  
  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if(timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);
  
  // Handler functions
  const handleNextPage = () => {
    if (paginatedData.hasNextPage) {
      setCurrentPage(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePreviousPage = () => {
    if (paginatedData.hasPreviousPage) {
      setCurrentPage(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getItemId = (type: string, id: string): void => {
    if(timeoutRef.current) clearTimeout(timeoutRef.current);
    
    onLoading(id);
    
    timeoutRef.current = setTimeout(() => {
      onItemId(id);
      onLoading(null);
      navigate(`/single-product-page/${id}`);
    }, 1000);
  };

  const handleTypeChange = (types: string[]) => {
    setSelectedTypes(types);
    // Keep backward compatibility with single type selection
    if (types.length === 1) {
      onSelectedType(types[0]);
    } else if (types.length === 0) {
      onSelectedType(null);
    }
  };

  const handleBrandChange = (brands: string[]) => {
    setSelectedBrands(brands);
  };

  const handlePriceRangeChange = (range: [number, number]) => {
    setPriceRange(range);
  };

  const clearAllFilters = () => {
    setSelectedTypes([]);
    setSelectedBrands([]);
    setPriceRange([priceLimits.min, priceLimits.max]);
    onSelectedType(null);
  };

  console.log("baseDataSource: ", JSON.stringify(baseDataSource));

  return (
    <div className="random-products-page">
      {/* Type Filter Component with all filters */}
      <div className="type-filter-cover">
        {isMobile &&
        <div style={{textAlign:"center"}}>
          <button style={{padding: "5px 20px", backgroundColor:"burlywood", border:"none", borderRadius:"5px"}}
           onClick={handleShowFilter}>{showFilter ? "X" : "Filter/Sort"}</button>
        </div>
        }

        { (window.innerWidth  > 768 || showFilter) &&
        <TypeFilter
          categories={allCategories}
          selectedTypes={selectedTypes}
          selectedBrands={selectedBrands}
          priceRange={priceRange}
          onTypeChange={handleTypeChange}
          onBrandChange={handleBrandChange}
          onPriceRangeChange={handlePriceRangeChange}
          loading={loading}
        />
        }
      </div>

      {/* Results Info and Products */}
      <div className="products-and-filter-info">
        <div className="results-header">
          <div className="results-info">
            <h3>
              {searchedResults.length > 0 
                ? `Search Results (${filteredProducts.length} products)`
                : selectedTypes.length === 0 && selectedBrands.length === 0
                ? "All Products"
                : `Filtered Products (${filteredProducts.length} found)`}
            </h3>
            
            {(selectedTypes.length > 0 || selectedBrands.length > 0) && (
              <div className="active-filters">
                {selectedTypes.map(type => {
                  const category = allCategories.find(c => c.type === type);
                  return (
                    <span key={`type-${type}`} className="filter-tag">
                      Type: {category?.title || type}
                    </span>
                  );
                })}
                {selectedBrands.map(brand => (
                  <span key={`brand-${brand}`} className="filter-tag">
                    Brand: {brand}
                  </span>
                ))}
                {(priceRange[0] > priceLimits.min || priceRange[1] < priceLimits.max) && (
                  <span key="price" className="filter-tag">
                    Price: R{priceRange[0]} - R{priceRange[1]}
                  </span>
                )}
              </div>
            )}
          </div>
          
          {(selectedTypes.length > 0 || selectedBrands.length > 0 || 
            priceRange[0] > priceLimits.min || priceRange[1] < priceLimits.max) && (
            <button 
              onClick={clearAllFilters}
              className="clear-all-filters-btn"
              disabled={loading !== null}
            >
              Clear All Filters
            </button>
          )}
        </div>

        {/* Products Grid */}
        {paginatedData.products.length > 0 ? (
          <>
            <div className="products-grid">
              {paginatedData.products.map((product) => (
                <div 
                  key={`${product.id}-${currentPage}`} 
                  className="product-card"
                  onClick={() => getItemId(product.type, product.id)}
                >
                  {loading === product.id && (
                    <LoadingProduct loadingClass={"loading-product"} />
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
                    <h3 className="product-model">
                      {product.title} 
                      <span className="price" style={{marginLeft: "auto"}}>
                        R{product.price}
                      </span>
                    </h3>
                    <p className="product-description">{product.description}</p>
                    <p className="product-type">Type: {product.type}</p>
                    <p className="product-type">Type: {product.id}</p>
                    <p className="product-brand">Brand: {product.brand}</p>
                    
                    {/* Action Buttons */}
                    <div className="product-actions">
                      <CartlistButton product={product} />
                      <WishlistButton product={product} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {paginatedData.totalPages > 1 && (
              <>
                <div className="pagination-controls">
                  <button 
                    onClick={handlePreviousPage}
                    disabled={!paginatedData.hasPreviousPage}
                    className="pagination-btn prev-btn"
                  >
                    ← Previous
                  </button>
                  
                  {/* Page Numbers */}
                  <div className="page-numbers">
                    {Array.from({ length: Math.min(5, paginatedData.totalPages) }, (_, index) => {
                      let pageNumber: number;
                      if (paginatedData.totalPages <= 5) {
                        pageNumber = index + 1;
                      } else if (currentPage <= 3) {
                        pageNumber = index + 1;
                      } else if (currentPage >= paginatedData.totalPages - 2) {
                        pageNumber = paginatedData.totalPages - 4 + index;
                      } else {
                        pageNumber = currentPage - 2 + index;
                      }
                      
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageClick(pageNumber)}
                          className={`page-btn ${paginatedData.currentPage === pageNumber ? 'active' : ''}`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                    
                    {paginatedData.totalPages > 5 && currentPage < paginatedData.totalPages - 2 && (
                      <>
                        <span className="page-dots">...</span>
                        <button
                          onClick={() => handlePageClick(paginatedData.totalPages)}
                          className={`page-btn ${paginatedData.currentPage === paginatedData.totalPages ? 'active' : ''}`}
                        >
                          {paginatedData.totalPages}
                        </button>
                      </>
                    )}
                  </div>
                  
                  <button 
                    onClick={handleNextPage}
                    disabled={!paginatedData.hasNextPage}
                    className="pagination-btn next-btn"
                  >
                    Next →
                  </button>
                </div>

                {/* Page Info */}
                <div className="page-info">
                  Page {paginatedData.currentPage} of {paginatedData.totalPages}
                  {(selectedTypes.length > 0 || selectedBrands.length > 0) && (
                    <span className="filter-info">
                      • {filteredProducts.length} products after filtering
                    </span>
                  )}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="no-products">
            <p>No products found with the current filters.</p>
            <button 
              onClick={clearAllFilters}
              className="clear-filters-btn"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default RandomProductsPage;