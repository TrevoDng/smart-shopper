// src/components/employee/MyProducts.tsx
import React, { useState, useEffect } from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';
import { productsApi, Product } from '../../../services/productsApi';
import './MyProducts.css';
import EmployeeLayout from '../layout/EmployeeLayout';

const MyProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await productsApi.getMyProducts(undefined, rowsPerPage, page * rowsPerPage);
      if (response && response.products) {
        setProducts(response.products);
        setTotal(response.total || 0);
      } else {
        setError('Failed to fetch products');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setProducts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, rowsPerPage]);

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusClass = (status: string): string => {
    switch (status) {
      case 'approved':
        return 'status-badge status-approved';
      case 'pending':
        return 'status-badge status-pending';
      case 'rejected':
        return 'status-badge status-rejected';
      case 'deactivated':
        return 'status-badge status-deactivated';
      default:
        return 'status-badge';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'pending':
        return 'Pending';
      case 'rejected':
        return 'Rejected';
      case 'deactivated':
        return 'Deactivated';
      default:
        return status;
    }
  };

  if (loading && products.length === 0) {
    return (
      <div className="products-loading-container">
        <div className="spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedProducts = products.slice(startIndex, endIndex);

  return (
    <EmployeeLayout>
    <div className="products-container">
      <div className="products-header">
        <h1>My Products</h1>
        <button 
          className="refresh-btn" 
          onClick={fetchProducts} 
          disabled={loading}
          title="Refresh"
        >
          <RefreshIcon />
        </button>
      </div>

      {error && (
        <div className="error-message">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="close-btn">×</button>
        </div>
      )}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Product Title</th>
              <th className="align-right">Stock Quantity</th>
              <th className="align-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.length === 0 ? (
              <tr>
                <td colSpan={3} className="empty-state">
                  <p>No products found. Start by adding your first product!</p>
                </td>
              </tr>
            ) : (
              paginatedProducts.map((product) => (
                <tr key={product.id} className="product-row">
                  <td className="product-title">{product.title}</td>
                  <td className="align-right">
                    {product.stockQuantity > 0 ? (
                      <span className="stock-quantity">{product.stockQuantity}</span>
                    ) : (
                      <span className="out-of-stock-badge">Out of Stock</span>
                    )}
                  </td>
                  <td className="align-center">
                    <span className={getStatusClass(product.status)}>
                      {getStatusText(product.status)}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {products.length > 0 && (
        <div className="pagination">
          <div className="pagination-info">
            Showing {startIndex + 1} to {Math.min(endIndex, total)} of {total} products
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
                Page {page + 1} of {Math.max(1, Math.ceil(total / rowsPerPage))}
              </span>
              <button
                onClick={() => handleChangePage(page + 1)}
                disabled={page + 1 >= Math.ceil(total / rowsPerPage)}
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

export default MyProducts;