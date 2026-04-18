// src/account/components/Admin/OutOfStock.tsx
import React, { useState, useEffect } from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';
import WarningIcon from '@mui/icons-material/Warning';
import { productsApi, Product } from '../../../services/productsApi';
import AdminLayout from '../layout/AdminLayout';
import './OutOfStock.css';

const OutOfStock: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchOutOfStockProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await productsApi.getAllProducts('approved', 1000, 0);
      if (response && response.products) {
        const outOfStock = response.products.filter(p => p.stockQuantity === 0);
        setProducts(outOfStock);
        setFilteredProducts(outOfStock);
      } else {
        setError('Failed to fetch products');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOutOfStockProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter(product =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.employeeName?.toLowerCase().includes(searchTerm.toLowerCase())
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

  if (loading && products.length === 0) {
    return (
      <AdminLayout>
        <div className="outofstock-loading-container">
          <div className="spinner"></div>
          <p>Loading out of stock products...</p>
        </div>
      </AdminLayout>
    );
  }

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredProducts.length / rowsPerPage);

  return (
    <AdminLayout>
      <div className="outofstock-container">
        <div className="outofstock-header">
          <h1>Out of Stock Products</h1>
          <div className="header-actions">
            <div className="search-box">
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
              onClick={fetchOutOfStockProducts} 
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

        {/* Warning Banner */}
        {filteredProducts.length > 0 && (
          <div className="warning-banner">
            <WarningIcon className="warning-icon" />
            <span>{filteredProducts.length} product(s) are currently out of stock!</span>
          </div>
        )}

        <div className="table-container">
          <table className="outofstock-table">
            <thead>
              <tr>
                <th>Product Title</th>
                <th>Brand</th>
                <th>Employee</th>
                <th className="align-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="empty-state">
                    {searchTerm ? (
                      <p>No out of stock products match your search</p>
                    ) : (
                      <>
                        <p>✅ No products are out of stock!</p>
                        <small>All products have sufficient inventory</small>
                      </>
                    )}
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((product) => (
                  <tr key={product.id} className="outofstock-row">
                    <td className="product-cell">
                      <div className="product-info">
                        <div className="product-title">{product.title}</div>
                        <div className="product-type">{product.mainType} / {product.subType}</div>
                      </div>
                    </td>
                    <td className="brand-cell">{product.brand}</td>
                    <td className="employee-cell">
                      <div className="employee-info">
                        <div className="employee-name">{product.employeeName}</div>
                        <div className="employee-email">{product.employeeEmail}</div>
                      </div>
                    </td>
                    <td className="align-center">
                      <span className="outofstock-badge">Out of Stock</span>
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
    </AdminLayout>
  );
};

export default OutOfStock;