// src/account/components/Admin/Products.tsx
import React, { useState, useEffect } from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';
import { productsApi, Product } from '../../../services/productsApi';
import AdminLayout from '../layout/AdminLayout';
import AddIcon from '@mui/icons-material/Add';
import AddDiscountModal from '../common/AddDiscountModal';
import './Products.css';

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [selectedProductForDiscount, setSelectedProductForDiscount] = useState<{ id: string; title: string } | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const status = statusFilter !== 'all' ? statusFilter : undefined;
      const response = await productsApi.getAllProducts(status, 1000, 0);
      if (response && response.products) {
        setProducts(response.products);
        setFilteredProducts(response.products);
        setTotal(response.total || response.products.length);
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
  }, [statusFilter]);

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

  if (loading && products.length === 0) {
    return (
      <AdminLayout>
        <div className="products-loading-container">
          <div className="spinner"></div>
          <p>Loading products...</p>
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
      <div className="admin-products-container">
        <div className="products-header">
          <h1>All Products</h1>
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
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="status-filter"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
              <option value="deactivated">Deactivated</option>
            </select>
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
          <table className="products-table">
            <thead>
              <tr>
                <th>Product Title</th>
                <th>Brand</th>
                <th>Employee</th>
                <th className="align-right">Stock</th>
                <th className="align-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="empty-state">
                    <p>No products found</p>
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((product) => (
                  <tr key={product.id} className="product-row">
                    <td className="product-title-cell">
                      <div className="product-info">
                        <div className="product-title">{product.title}</div>
                        <div className="product-type">{product.category[0]} / {product.category[1]}</div>
                      </div>
                    </td>
                    <td className="brand-cell">{product.brand}</td>
                    <td className="employee-cell">
                      <div className="employee-info">
                        <div className="employee-name">{product.employeeName}</div>
                        <div className="employee-email">{product.employeeEmail}</div>
                      </div>
                    </td>
                    <td className="align-right">
                      <span className={getStockStatusClass(product.stockQuantity)}>
                        {getStockStatusText(product.stockQuantity)}
                      </span>
                    </td>
                    <td className="align-center">
                      <span className={getStatusClass(product.status)}>
                        {getStatusText(product.status)}
                      </span>
                    </td>
                    <td className="align-center">
                      <button
                        onClick={() => setSelectedProductForDiscount({ id: product.id, title: product.title })}
                        className="add-sale-btn"
                        title="Add discount">
                        <AddIcon fontSize="small" />
                          Add Sale
                        </button>
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

        {selectedProductForDiscount && (
          <AddDiscountModal
            productId={selectedProductForDiscount.id}
            productTitle={selectedProductForDiscount.title}
            onClose={() => setSelectedProductForDiscount(null)}
            onSuccess={() => {
            // Refresh products or show success message
            fetchProducts();
          }}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default Products;