// src/components/employee/ProductsSales.tsx
import React, { useState, useEffect } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import { productsApi, Product } from '../../../services/productsApi';
import './ProductsSales.css';
import EmployeeLayout from '../layout/EmployeeLayout';

interface ProductSale extends Product {
  originalPrice?: number;
  salePercentage?: number;
  isOnSale?: boolean;
}

const ProductsSales: React.FC = () => {
  const [products, setProducts] = useState<ProductSale[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductSale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch approved products (only approved products are on sale)
      const response = await productsApi.getAllProducts('approved', 1000, 0);
      if (response && response.products) {
        // Transform products to include sale information
        // For now, all approved products are considered "on sale" with sample sale data
        // You can modify this logic based on your actual sale criteria
        const productsList = response.products.map(product => ({
          ...product,
          originalPrice: product.price * 1.2, // Example: original price 20% higher
          salePercentage: 15, // Example: 15% off
          isOnSale: true,
        }));
        setProducts(productsList);
        setFilteredProducts(productsList);
      } else {
        setError('Failed to fetch products');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter(product =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
    setPage(0);
  }, [searchTerm, products]);

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStockStatusClass = (stockQuantity: number): string => {
    if (stockQuantity === 0) return 'stock-badge out-of-stock';
    if (stockQuantity < 10) return 'stock-badge low-stock';
    return 'stock-badge in-stock';
  };

  const getStockStatusText = (stockQuantity: number): string => {
    if (stockQuantity === 0) return 'Out of Stock';
    if (stockQuantity < 10) return `Only ${stockQuantity} left`;
    return `${stockQuantity} units`;
  };

  if (loading) {
    return (
      <div className="sales-loading-container">
        <div className="spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredProducts.length / rowsPerPage);

  return (
    <EmployeeLayout>
    <div className="sales-container">
      <div className="sales-header">
        <h1>Products on Sale</h1>
        <div className="header-actions">
          <div className="search-box">
            <SearchIcon className="search-icon" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button 
            className="refresh-btn" 
            onClick={fetchProducts} 
            disabled={loading}
            title="Refresh"
          >
            <RefreshIcon />
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="close-btn">×</button>
        </div>
      )}

      <div className="table-container">
        <table className="sales-table">
          <thead>
            <tr>
              <th>Product Title</th>
              <th className="align-right">Price</th>
              <th className="align-center">Sale</th>
              <th className="align-right">Stock</th>
              <th className="align-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.length === 0 ? (
              <tr>
                <td colSpan={5} className="empty-state">
                  <p>{searchTerm ? 'No products match your search' : 'No products on sale found'}</p>
                </td>
              </tr>
            ) : (
              paginatedProducts.map((product) => (
                <tr key={product.id} className="product-row">
                  <td className="product-cell">
                    <div className="product-info">
                      <div className="product-title">{product.title}</div>
                      <div className="product-brand">{product.brand}</div>
                    </div>
                  </td>
                  <td className="align-right price-cell">
                    <div className="price-info">
                      <span className="current-price">R{product.price.toFixed(2)}</span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="original-price">
                          R{product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="align-center">
                    {product.salePercentage ? (
                      <span className="sale-badge">
                        {product.salePercentage}% OFF
                      </span>
                    ) : (
                      <span className="no-sale-badge">No Sale</span>
                    )}
                  </td>
                  <td className="align-right">
                    <span className={getStockStatusClass(product.stockQuantity)}>
                      {getStockStatusText(product.stockQuantity)}
                    </span>
                  </td>
                  <td className="align-center">
                    <span className={`sale-status-badge ${product.isOnSale ? 'on-sale' : 'regular'}`}>
                      {product.isOnSale ? 'On Sale' : 'Regular'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {filteredProducts.length > 0 && (
        <div className="pagination">
          <div className="pagination-info">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} products
          </div>
          <div className="pagination-controls">
            <select 
              value={rowsPerPage} 
              onChange={handleChangeRowsPerPage}
              className="rows-per-page"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
            </select>
            <div className="page-buttons">
              <button
                onClick={() => handleChangePage(page - 1)}
                disabled={page === 0}
                className="page-btn"
              >
                Previous
              </button>
              <span className="page-info">
                Page {page + 1} of {totalPages}
              </span>
              <button
                onClick={() => handleChangePage(page + 1)}
                disabled={page + 1 >= totalPages}
                className="page-btn"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </EmployeeLayout>
  );
};

export default ProductsSales;