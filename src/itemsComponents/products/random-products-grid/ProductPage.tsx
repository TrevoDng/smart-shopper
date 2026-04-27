// src/itemsComponents/products/random-products-grid/ProductPage.tsx
import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { Product } from "../types/Product";
import "./ProductPage.css";
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
import { getFullImageUrl } from "../utils/getFullImageUrl";

// Virtualized list item dimensions
const ITEM_HEIGHT = 380;
const BUFFER_SIZE = 3;

interface ProductPageProps {
  products: Product[];
  setSearchQuery: (query: string) => void;
  searchedQuery: string;
  searchedResults?: Product[];
  resultsMatch?: boolean;
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  selectedBrands: string[];
  setSelectedBrands: (brands: string[]) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  onDiscountedPrice: (productId: string, originalPrice: number) => { discountedPrice: number, discountAmount: number } | null;
  fetchDiscounts: (id: string[]) => Promise<void>;
  onItemId: (id: string) => void;
  onLoading: (id: string | null) => void;
  loading?: string | null;
}

const ProductPage: React.FC<ProductPageProps> = ({
  products,
  setSearchQuery,
  searchedQuery,
  searchedResults = [],
  resultsMatch,
  selectedCategories,
  setSelectedCategories,
  selectedBrands,
  setSelectedBrands,
  priceRange,
  setPriceRange,
  onDiscountedPrice,
  fetchDiscounts,
  onItemId,
  onLoading,
  loading,
}) => {
  const [showFilter, setShowFilter] = useState(false);
  
  // Refs
  const priceInitializedRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  const previousProductIdsRef = useRef<string>('');
  
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');

  const getItemHeight = useCallback(() => {
    if (isMobile) return 340;
    if (isTablet) return 360;
    return 380;
  }, [isMobile, isTablet]);

  const navigate = useNavigate();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  // Initialize price range only once when price limits are calculated
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

  // Reset brands when base data source changes
  useEffect(() => {
    setSelectedBrands([]);
    if (priceLimits.min !== undefined && priceLimits.max !== undefined) {
      setPriceRange([priceLimits.min, priceLimits.max]);
    }
  }, [baseDataSource, setSelectedBrands, setPriceRange, priceLimits]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Handle container resize
  useEffect(() => {
    const updateContainerHeight = () => {
      if (containerRef.current) {
        setContainerHeight(containerRef.current.clientHeight);
      }
    };

    updateContainerHeight();
    window.addEventListener('resize', updateContainerHeight);
    return () => window.removeEventListener('resize', updateContainerHeight);
  }, []);

  // Handler functions
  const getItemId = (id: string): void => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    onLoading(id);
    timeoutRef.current = setTimeout(() => {
      onItemId(id);
      onLoading(null);
      navigate(`/single-product-page/${id}`);
    }, 1000);
  };

  const handleCategoryChange = (categories: string[]) => {
    setSelectedCategories(categories);
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
      setScrollTop(0);
    }
  };

  const handleBrandChange = (brands: string[]) => {
    setSelectedBrands(brands);
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
      setScrollTop(0);
    }
  };

  const handlePriceRangeChange = (range: [number, number]) => {
    setPriceRange(range);
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
      setScrollTop(0);
    }
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange([priceLimits.min, priceLimits.max]);
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
      setScrollTop(0);
    }
  };

  const handleShowFilter = () => {
    setShowFilter(!showFilter);
  };

  // Virtualization calculations
  const itemHeight = getItemHeight();
  const totalItems = filteredProducts.length;
  const totalHeight = totalItems * itemHeight;

  useEffect(() => {
  if (baseDataSource.length > 0) {
    const productIdsKey = baseDataSource.map(p => p.id).sort().join(',');
    if (productIdsKey !== previousProductIdsRef.current) {
      previousProductIdsRef.current = productIdsKey;
      const productIds = baseDataSource.map(p => p.id);
      fetchDiscounts(productIds);
    }
  }
}, [baseDataSource]);

  const visibleRange = useMemo(() => {
    if (!containerHeight) {
      return { start: 0, end: Math.min(10, totalItems) };
    }

    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - BUFFER_SIZE);
    const endIndex = Math.min(
      totalItems,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + BUFFER_SIZE
    );

    return { start: startIndex, end: endIndex };
  }, [scrollTop, containerHeight, itemHeight, totalItems]);

  const visibleProducts = useMemo(() => {
    return filteredProducts.slice(visibleRange.start, visibleRange.end);
  }, [filteredProducts, visibleRange.start, visibleRange.end]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const getItemOffset = (index: number) => {
    return (visibleRange.start + index) * itemHeight;
  };



    if (searchedQuery.length > 2 && searchedResults.length === 0 && resultsMatch === false) {
        return (
          <div className="loading-container" style={{ textAlign: 'center', padding: '50px' }}>
            <h3>No results found for "{searchedQuery}"</h3>
            <p>Try checking your spelling or using different keywords.</p>
            <button onClick={() => setSearchQuery('')}>Clear Search</button>
          </div>
    ); 
    }

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
    <div className="product-page">
      {/* Filter Sidebar */}
      <div className={`product-page-filter ${showFilter ? 'mobile-open' : ''}`}>
        <div className="filter-header">
          <h3>Filters</h3>
          {isMobile && (
            <button className="close-filter-btn" onClick={handleShowFilter}>
              ✕
            </button>
          )}
        </div>
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
      </div>

      {/* Main Content Area */}
      <div className="product-page-content">
        {/* Filter Toggle for Mobile */}
        {isMobile && (
          <div className="mobile-filter-toggle">
            <button onClick={handleShowFilter} className="filter-toggle-btn">
              <span className="filter-icon">⚡</span>
              Filters
              {(selectedCategories.length > 0 || selectedBrands.length > 0) && (
                <span className="filter-count">
                  {selectedCategories.length + selectedBrands.length}
                </span>
              )}
            </button>
          </div>
        )}

        {/* Results Header */}
        <div className="results-header">
          <div className="results-info">
            <h3>
              {searchedResults.length > 0
                ? `Search Results (${totalItems} products)`
                : selectedCategories.length === 0 && selectedBrands.length === 0
                ? "All Products"
                : `Filtered Products (${totalItems} found)`}
            </h3>

            {/* Active Filters Display */}
            {(selectedCategories.length > 0 || selectedBrands.length > 0 || 
              priceRange[0] > priceLimits.min || priceRange[1] < priceLimits.max) && (
              <div className="active-filters">
                {selectedCategories.map(category => (
                  <span key={`category-${category}`} className="filter-tag">
                    Category: {category}
                    <button
                      onClick={() => handleCategoryChange(selectedCategories.filter(c => c !== category))}
                      className="remove-filter"
                    >
                      ✕
                    </button>
                  </span>
                ))}
                {selectedBrands.map(brand => (
                  <span key={`brand-${brand}`} className="filter-tag">
                    Brand: {brand}
                    <button
                      onClick={() => handleBrandChange(selectedBrands.filter(b => b !== brand))}
                      className="remove-filter"
                    >
                      ✕
                    </button>
                  </span>
                ))}
                {(priceRange[0] > priceLimits.min || priceRange[1] < priceLimits.max) && (
                  <span className="filter-tag">
                    Price: R{priceRange[0]} - R{priceRange[1]}
                    <button
                      onClick={() => setPriceRange([priceLimits.min, priceLimits.max])}
                      className="remove-filter"
                    >
                      ✕
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Clear All Button */}
          {(selectedCategories.length > 0 || selectedBrands.length > 0 ||
            priceRange[0] > priceLimits.min || priceRange[1] < priceLimits.max) && (
            <button
              onClick={clearAllFilters}
              className="clear-all-filters-btn"
              disabled={loading !== null}
            >
              Clear All
            </button>
          )}
        </div>

        {/* Virtualized Products Grid */}
        {totalItems > 0 ? (
          <div
            ref={containerRef}
            className="products-virtual-container"
            onScroll={handleScroll}
          >
            <div
              className="products-spacer"
              style={{ height: totalHeight, position: 'relative' }}
            >
              <div
                className="products-grid"
                style={{
                  transform: `translateY(${getItemOffset(0)}px)`,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                }}
              >
                {visibleProducts.map((product) => {
                  const originalPrice = parseFloat(product.price);
                  const discountInfo = onDiscountedPrice(product.id, originalPrice);
                  
                  const displayCategory = product.category && product.category.length > 0 
                    ? product.category[0] 
                    : "Uncategorized";
                  
                  return (
                    <div
                      key={product.id}
                      className="product-card"
                      onClick={() => getItemId(product.id)}
                    >
                      {loading === product.id && (
                        <LoadingProduct loadingClass={"loading-product"} />
                      )}

                      {/* Product Image */}
                      {product.imgSrc && product.imgSrc.length > 0 && (
                        console.log("Rendering image for product:", product.imgSrc[0]),
                        <div className="product-image">
                          <img
                          className="product-img"
                            src={getFullImageUrl(product.imgSrc[0])}
                            alt={product.title}
                            loading="lazy"
                            onError={(e) => {
                            // Fallback if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                            }}
                          />
                          {discountInfo && (
                            <span className="discount-badge">SALE
                              {/*<i className="fas fa-tag">Sale</i>*/}
                              
                            </span>
                          )}
                        </div>
                      )}

                      {/* Product Info */}
                      <div className="product-info">
                        <div className="product-header">
                          <h3 className="product-title">{product.title}</h3>

                        </div>
                        <p className="product-description">{product.description}</p>
                        <div className="product-meta">
                          <span className="product-type">Category: {displayCategory}</span>
                          <span className="product-brand">Brand: {product.brand}</span>
                        </div>
                          <div className="price-section">
                            {discountInfo ? (
                              <>
                                <span className="original-price">R{originalPrice.toLocaleString()}</span>
                                <span className="discounted-price">R{discountInfo.discountedPrice.toLocaleString()}</span>
                                {discountInfo && (
                            <span className="discount-percentage"> -{discountInfo.discountAmount}%</span>
                          )}
                              </>
                            ) : (
                              <span className="regular-price">R{originalPrice.toLocaleString()}</span>
                            )}
                          </div>
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
            </div>
          </div>
        ) : (
          <div className="no-products">
            <div className="no-products-icon">🔍</div>
            <p>No products found with the current filters.</p>
            <button onClick={clearAllFilters} className="clear-filters-btn">
              Clear All Filters
            </button>
          </div>
        )}

        {/* Scroll to Top Button */}
        {scrollTop > 500 && (
          <button
            className="scroll-to-top"
            onClick={() => {
              if (containerRef.current) {
                containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
            ↑
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductPage;