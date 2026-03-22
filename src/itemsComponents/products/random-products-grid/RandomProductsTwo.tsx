import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { ProductCategory, ProductModel } from "../types/Product";
import ProductsCards from "../product-card/ProductsCads";
import "./RandomProductGrid.css";
import { LoadingProduct } from "../LoadingProduct";
import { useNavigate } from "react-router-dom";
import { WishlistButton } from "../wish-list/components/WishlistButton";
import { CartlistButton } from "../cart/components/CartlistButton";
//import TypeFilter from "./TypeFilter"; // Add this import
import TypeFilter from "../aside-filter-section/TypeFilter";

import './RandomProductsPage.css';

interface PaginatedProducts {
  products: ProductModel[];
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface RandomProductsPageProps {
  categories: ProductCategory[];
  onSelectedType: (type: string | null) => void;
  selectedType: string | null;
  onItemId: (id: string) => void;
  onLoading: (id: string | null) => void;
  loading?: string | null; 
}

// Function to get all products flattened
function getAllProducts(categories: ProductCategory[]): ProductModel[] {
  return categories.flatMap(category => category.models);
}

// FIXED shuffleArray function
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for(let i = shuffled.length - 1; i > 0; i--) { // Fixed: i > 0, not i < 0
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Function to get paginated products with type filtering
function getPaginatedProducts(
  categories: ProductCategory[],
  selectedTypes: string[],
  itemsPerPage: number,
  currentPage: number,
  shuffle: boolean = true
): PaginatedProducts {
  // Filter products by selected types
  let filteredProducts: ProductModel[];
  
  if (selectedTypes.length === 0) {
    // If no types selected, show all products
    filteredProducts = getAllProducts(categories);
  } else {
    // Filter by selected types
    filteredProducts = categories
      .filter(category => selectedTypes.includes(category.type))
      .flatMap(category => category.models);
  }
  
  // Shuffle products if needed (only shuffle once, not on every render)
  const displayProducts = shuffle ? shuffleArray(filteredProducts) : filteredProducts;
  
  // Calculate pagination
  const totalProducts = displayProducts.length;
  const totalPages = Math.ceil(totalProducts / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalProducts);
  
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

const RandomProductsPageTwo: React.FC<RandomProductsPageProps> = ({
  categories,
  onSelectedType, 
  selectedType,
  onItemId, 
  onLoading, 
  loading  
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
      const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [paginatedData, setPaginatedData] = useState<PaginatedProducts>({
    products: [],
    currentPage: 1,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false
  });
  
  const navigate = useNavigate();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Memoize filtered products to prevent unnecessary re-shuffling
  const filteredProducts = useMemo(() => {
    return getPaginatedProducts(categories, selectedTypes, itemsPerPage, currentPage);
  }, [categories, selectedTypes, currentPage, itemsPerPage]);

  // Update paginated data when filteredProducts changes
  useEffect(() => {
    setPaginatedData(filteredProducts);
  }, [filteredProducts]);

  // Reset to page 1 when selected types change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTypes]);

  const handleNextPage = () => {
    if (paginatedData.hasNextPage) {
      setCurrentPage(prev => prev + 1);
      // Scroll to top of products grid
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

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Add to cart clicked");
  };

  const getItemId = (type: string, id: string): void => {
    if(timeoutRef.current) clearTimeout(timeoutRef.current);
    
    onLoading(id);
    
    timeoutRef.current = setTimeout(() => {
      onItemId(id);
      onLoading(null);
      navigate(`/single-product-page/${id}`);
    }, 1000); // Reduced from 3000ms to 1000ms for better UX
  };

  const handleTypeChange = (types: string[]) => {
    setSelectedTypes(types);
    // If you want to keep backward compatibility with single type selection
    if (types.length === 1) {
      onSelectedType(types[0]);
    } else if (types.length === 0) {
      onSelectedType(null);
    }
    // For multiple types, you might want to handle differently
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if(timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

   const handleBrandChange = (brands: string[]) => {
    setSelectedBrands(brands);
  };

  const handlePriceRangeChange = (range: [number, number]) => {
    setPriceRange(range);
  };

  return (
    <div className="random-products-page">
     {/**<h2>Random Products</h2> */} 
      
      {/* Type Filter Component */}
      <div className="type-filter-cover">
      <TypeFilter
                  categories={categories}
          selectedTypes={selectedTypes}
          selectedBrands={selectedBrands}
          priceRange={priceRange}
          onTypeChange={handleTypeChange}
          onBrandChange={handleBrandChange}
          onPriceRangeChange={handlePriceRangeChange}
          loading={loading}
      />
      </div>

      {/* Results Info */}
      <div className="products-and-filter-info">
      <div className="results-info">
        <h3>
          {selectedTypes.length === 0 
            ? "All Products" 
            : `Showing ${paginatedData.products.length} of ${filteredProducts.products.length * filteredProducts.totalPages} products`}
        </h3>
        {selectedTypes.length > 0 && (
          <p className="selected-types-info">
            Filtered by: {selectedTypes.map(type => {
              const category = categories.find(c => c.type === type);
              return category?.title || type;
            }).join(', ')}
          </p>
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
                      {product.currency = "R"}{product.price}
                    </span>
                  </h3>
                  <p className="product-description">{product.description}</p>
                  <p className="product-type">Type: {product.type}</p>
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
                    // Show limited page numbers (max 5)
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
                {selectedTypes.length > 0 && (
                  <span className="filter-info">
                    • Filtered by {selectedTypes.length} type{selectedTypes.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </>
          )}
        </>
      ) : (
        <div className="no-products">
          <p>No products found for the selected types.</p>
          <button 
            onClick={() => setSelectedTypes([])}
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

export default RandomProductsPageTwo;