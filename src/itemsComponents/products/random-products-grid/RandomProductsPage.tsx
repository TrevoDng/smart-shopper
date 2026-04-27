// src/itemsComponents/products/random-products-grid/RandomProductsPage.tsx
import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { Product } from "../types/Product";
import "./RandomProductGrid.css";
import { LoadingProduct } from "../LoadingProduct";
import { useNavigate } from "react-router-dom";
import { WishlistButton } from "../wish-list/components/WishlistButton";
import { CartlistButton } from "../cart/components/CartlistButton";
import CategoryFilter from "../aside-filter-section/CategoryFilter";
import { 
  getAllProducts,
  applyMultipleFilters,
  cleanPrice,
} from "../utils/filterUtils";
import { useMediaQuery } from "../../../screen-size/useMediaQuery";

interface PaginatedProducts {
  products: Product[];
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface RandomProductsPageProps {
  products: Product[];
  searchedResults?: Product[];
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  selectedBrands: string[];
  setSelectedBrands: (brands: string[]) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  onDiscountedPrice: (productId: string, originalPrice: number) => { discountedPrice: number, discountAmount: number } | null;
  onItemId: (id: string) => void;
  onLoading: (id: string | null) => void;
  loading?: string | null;
}

// shuffleArray function
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for(let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Function to get paginated products with all filters
function getPaginatedProducts(
  allProducts: Product[],
  itemsPerPage: number,
  currentPage: number,
  shuffle: boolean = true
): PaginatedProducts {
  const displayProducts = shuffle ? shuffleArray(allProducts) : allProducts;
  
  const totalProducts = displayProducts.length;
  const totalPages = Math.ceil(totalProducts / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalProducts);
  
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
  products,
  searchedResults = [],
  selectedCategories,
  setSelectedCategories,
  selectedBrands,
  setSelectedBrands,
  priceRange,
  setPriceRange,
  onDiscountedPrice,
  onItemId,
  onLoading,
  loading,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [showFilter, setShowFilter] = useState(false);

  const isMobile = useMediaQuery('(max-width: 768px)');
  const navigate = useNavigate();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const [paginatedData, setPaginatedData] = useState<PaginatedProducts>({
    products: [],
    currentPage: 1,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false
  });
  
  // Determine base data source: search results or products prop
  const baseDataSource = useMemo(() => {
    return searchedResults.length > 0 ? searchedResults : products;
  }, [products, searchedResults]);
  
  // Calculate price limits
  const priceLimits = useMemo(() => {
    const allProductsList = getAllProducts(baseDataSource);
    const prices = allProductsList.map(product => cleanPrice(product.price));
    return {
      min: prices.length > 0 ? Math.min(...prices) : 0,
      max: prices.length > 0 ? Math.max(...prices) : 10000
    };
  }, [baseDataSource]);
  
  // Initialize price range with actual limits (only once)
  const priceInitializedRef = useRef(false);
  useEffect(() => {
    if (!priceInitializedRef.current && priceLimits.min !== undefined && priceLimits.max !== undefined) {
      priceInitializedRef.current = true;
      setPriceRange([priceLimits.min, priceLimits.max]);
    }
  }, [priceLimits, setPriceRange]);
  
  // Apply all filters
  const filteredProducts = useMemo(() => {
    if (baseDataSource.length === 0) return [];
    return applyMultipleFilters(baseDataSource, {
      selectedCategories,
      selectedBrands,
      priceRange
    });
  }, [baseDataSource, selectedCategories, selectedBrands, priceRange]);
  
  // Get paginated data
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
  }, [selectedCategories, selectedBrands, priceRange]);
  
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

  const getItemId = (id: string): void => {
    if(timeoutRef.current) clearTimeout(timeoutRef.current);
    
    onLoading(id);
    
    timeoutRef.current = setTimeout(() => {
      onItemId(id);
      onLoading(null);
      navigate(`/single-product-page/${id}`);
    }, 1000);
  };

  const handleCategoryChange = (categories: string[]) => {
    setSelectedCategories(categories);
  };

  const handleBrandChange = (brands: string[]) => {
    setSelectedBrands(brands);
  };

  const handlePriceRangeChange = (range: [number, number]) => {
    setPriceRange(range);
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange([priceLimits.min, priceLimits.max]);
  };

  const handleShowFilter = () => {
    setShowFilter(!showFilter);
  };

  // Show loading state if no products
  if (!products || products.length === 0) {
    return (
      <div className="product-page-loading">
        <div className="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="random-products-page">
      {/* Category Filter Component */}
      <div className="type-filter-cover">
        {isMobile && (
          <div style={{textAlign:"center"}}>
            <button 
              style={{padding: "5px 20px", backgroundColor:"burlywood", border:"none", borderRadius:"5px"}}
              onClick={handleShowFilter}
            >
              {showFilter ? "X" : "Filter/Sort"}
            </button>
          </div>
        )}

        {(window.innerWidth > 768 || showFilter) && (
          <CategoryFilter
            products={baseDataSource}
            selectedCategories={selectedCategories}
            selectedBrands={selectedBrands}
            priceRange={priceRange}
            onCategoryChange={handleCategoryChange}
            onBrandChange={handleBrandChange}
            onPriceRangeChange={handlePriceRangeChange}
            loading={loading}
          />
        )}
      </div>

      {/* Results Info and Products */}
      <div className="products-and-filter-info">
        <div className="results-header">
          <div className="results-info">
            <h3>
              {searchedResults.length > 0 
                ? `Search Results (${filteredProducts.length} products)`
                : selectedCategories.length === 0 && selectedBrands.length === 0
                ? "All Products"
                : `Filtered Products (${filteredProducts.length} found)`}
            </h3>
            
            {(selectedCategories.length > 0 || selectedBrands.length > 0) && (
              <div className="active-filters">
                {selectedCategories.map(category => (
                  <span key={`category-${category}`} className="filter-tag">
                    Category: {category}
                  </span>
                ))}
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
          
          {(selectedCategories.length > 0 || selectedBrands.length > 0 || 
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
              {paginatedData.products.map((product) => {
                const originalPrice = parseFloat(product.price);
                const discountInfo = onDiscountedPrice(product.id, originalPrice);
                const displayCategory = product.category && product.category.length > 0 
                  ? product.category[0] 
                  : "Uncategorized";
                
                return (
                  <div 
                    key={`${product.id}-${currentPage}`} 
                    className="product-card"
                    onClick={() => getItemId(product.id)}
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
                        {discountInfo && (
                          <span className="discount-badge">
                            -{discountInfo.discountAmount}%
                          </span>
                        )}
                      </div>
                    )}
                    
                    {/* Product Info */}
                    <div className="product-info">
                      <h3 className="product-model">
                        {product.title} 
                        <span className="price" style={{marginLeft: "auto"}}>
                          {discountInfo ? (
                            <>
                              <span className="original-price-mini">R{originalPrice.toLocaleString()}</span>
                              <span className="discounted-price-mini">R{discountInfo.discountedPrice.toLocaleString()}</span>
                            </>
                          ) : (
                            `R${originalPrice.toLocaleString()}`
                          )}
                        </span>
                      </h3>
                      <p className="product-description">{product.description}</p>
                      <p className="product-category">Category: {displayCategory}</p>
                      <p className="product-brand">Brand: {product.brand}</p>
                      
                      {/* Action Buttons */}
                      <div className="product-actions">
                        <CartlistButton product={product} />
                        <WishlistButton product={product} />
                      </div>
                    </div>
                  </div>
                );
              })}
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
                  {(selectedCategories.length > 0 || selectedBrands.length > 0) && (
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
};

export default RandomProductsPage;