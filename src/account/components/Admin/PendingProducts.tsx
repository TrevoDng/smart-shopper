// src/account/components/Admin/PendingProducts.tsx
import React, { useState, useEffect } from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import { productsApi, Product } from '../../../services/productsApi';
import AdminLayout from '../layout/AdminLayout';
import ConfirmModal from '../common/ConfirmModal';
import './PendingProducts.css';

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

// Helper function to format price safely
const formatPrice = (price: number | string | undefined): string => {
  if (price === undefined || price === null) return '0.00';
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(numPrice)) return '0.00';
  return numPrice.toFixed(2);
};

const PendingProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Modal states
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionInProgress, setActionInProgress] = useState(false);

  const fetchPendingProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch products with status 'pending'
      const response = await productsApi.getAllProducts('pending', 1000, 0);
      if (response && response.products) {
        setProducts(response.products);
        setFilteredProducts(response.products);
      } else {
        setError('Failed to fetch pending products');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingProducts();
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

  const handleApprove = async () => {
    if (!selectedProduct) return;
    
    setActionInProgress(true);
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch(`${API_BASE}/products/admin/${selectedProduct.id}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Remove approved product from list
        setProducts(prev => prev.filter(p => p.id !== selectedProduct.id));
        setFilteredProducts(prev => prev.filter(p => p.id !== selectedProduct.id));
        setApproveModalOpen(false);
        setSelectedProduct(null);
      } else {
        setError(data.message || 'Failed to approve product');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setActionInProgress(false);
    }
  };

  const handleReject = async () => {
    if (!selectedProduct) return;
    
    setActionInProgress(true);
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch(`${API_BASE}/products/admin/${selectedProduct.id}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reason: rejectionReason || undefined })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Remove rejected product from list
        setProducts(prev => prev.filter(p => p.id !== selectedProduct.id));
        setFilteredProducts(prev => prev.filter(p => p.id !== selectedProduct.id));
        setRejectModalOpen(false);
        setSelectedProduct(null);
        setRejectionReason('');
      } else {
        setError(data.message || 'Failed to reject product');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setActionInProgress(false);
    }
  };

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getImageUrl = (imgSrc: string[]): string => {
    if (!imgSrc || imgSrc.length === 0) return '';
    const imgPath = imgSrc[0];
    if (imgPath.startsWith('http')) return imgPath;
    return `${API_BASE.replace('/api', '')}${imgPath}`;
  };

  if (loading && products.length === 0) {
    return (
      <AdminLayout>
        <div className="pending-loading-container">
          <div className="spinner"></div>
          <p>Loading pending products...</p>
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
      <div className="pending-products-container">
        <div className="pending-header">
          <h1>Pending Products</h1>
          <div className="header-actions">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search by product, brand, or employee..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <button 
              className="refresh-btn" 
              onClick={fetchPendingProducts} 
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

        {/* Summary Banner */}
        <div className="summary-banner">
          <span className="summary-icon">⏳</span>
          <span className="summary-text">
            {filteredProducts.length} product(s) waiting for approval
          </span>
        </div>

        <div className="table-container">
          <table className="pending-table">
            <thead>
              <tr>
                <th>Product Image</th>
                <th>Product Title</th>
                <th>Brand</th>
                <th>Price</th>
                <th>Employee</th>
                <th>Submitted Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="empty-state">
                    {searchTerm ? (
                      <p>No pending products match your search</p>
                    ) : (
                      <>
                        <p>✅ No products pending approval!</p>
                        <small>All products have been reviewed</small>
                      </>
                    )}
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((product) => (
                  <tr key={product.id} className="pending-row">
                    <td className="image-cell">
                      {product.imgSrc && product.imgSrc.length > 0 ? (
                        <img 
                          src={getImageUrl(product.imgSrc)} 
                          alt={product.title}
                          className="product-thumbnail"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/50x50?text=No+Image';
                          }}
                        />
                      ) : (
                        <div className="no-image">No Image</div>
                      )}
                    </td>
                    <td className="title-cell">
                      <div className="product-info">
                        <div className="product-title">{product.title}</div>
                        <div className="product-type">{product.category[0]} / {product.category[1]}</div>
                      </div>
                    </td>
                    <td className="brand-cell">{product.brand}</td>
                    <td className="price-cell">R{formatPrice(product.price)}</td>
                    <td className="employee-cell">
                      <div className="employee-info">
                        <div className="employee-name">{product.employeeName}</div>
                        <div className="employee-email">{product.employeeEmail}</div>
                      </div>
                    </td>
                    <td className="date-cell">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </td>
                    <td className="actions-cell">
                      <div className="action-buttons">
                        <button 
                          className="action-btn view-btn" 
                          onClick={() => {
                            setSelectedProduct(product);
                            setViewModalOpen(true);
                          }}
                          title="View Details"
                        >
                          <VisibilityIcon />
                        </button>
                        <button 
                          className="action-btn approve-btn" 
                          onClick={() => {
                            setSelectedProduct(product);
                            setApproveModalOpen(true);
                          }}
                          title="Approve Product"
                        >
                          <CheckCircleIcon />
                        </button>
                        <button 
                          className="action-btn reject-btn" 
                          onClick={() => {
                            setSelectedProduct(product);
                            setRejectModalOpen(true);
                          }}
                          title="Reject Product"
                        >
                          <CancelIcon />
                        </button>
                      </div>
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

        {/* View Details Modal */}
        {viewModalOpen && selectedProduct && (
          <div className="modal-overlay" onClick={() => setViewModalOpen(false)}>
            <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Product Details</h2>
                <button className="modal-close" onClick={() => setViewModalOpen(false)}>
                  <CloseIcon />
                </button>
              </div>
              <div className="modal-body">
                <div className="product-details-grid">
                  {/* Images Section */}
                  <div className="details-images">
                    <h3>Product Images</h3>
                    <div className="image-gallery">
                      {selectedProduct.imgSrc && selectedProduct.imgSrc.length > 0 ? (
                        selectedProduct.imgSrc.map((img, index) => (
                          <img 
                            key={index}
                            src={getImageUrl([img])} 
                            alt={`${selectedProduct.title} - ${index + 1}`}
                            className="gallery-image"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100x100?text=No+Image';
                            }}
                          />
                        ))
                      ) : (
                        <div className="no-images">No images available</div>
                      )}
                    </div>
                  </div>

                  {/* Product Info Section */}
                  <div className="details-info">
                    <div className="detail-row">
                      <label>Product Title:</label>
                      <span>{selectedProduct.title}</span>
                    </div>
                    <div className="detail-row">
                      <label>Brand:</label>
                      <span>{selectedProduct.brand}</span>
                    </div>
                    <div className="detail-row">
                      <label>Category:</label>
                      <span>{selectedProduct.category[0]} / {selectedProduct.category[1]}</span>
                    </div>
                    <div className="detail-row">
                      <label>Price:</label>
                      <span className="price">R{formatPrice(selectedProduct.price)}</span>
                    </div>
                    <div className="detail-row">
                      <label>Stock Quantity:</label>
                      <span>{selectedProduct.stockQuantity}</span>
                    </div>
                    <div className="detail-row">
                      <label>Submitted By:</label>
                      <span>{selectedProduct.employeeName} ({selectedProduct.employeeEmail})</span>
                    </div>
                    <div className="detail-row">
                      <label>Submitted Date:</label>
                      <span>{new Date(selectedProduct.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="detail-row full-width">
                      <label>Short Description:</label>
                      <p>{selectedProduct.description}</p>
                    </div>
                    <div className="detail-row full-width">
                      <label>Full Description:</label>
                      <p>{selectedProduct.longDescription}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  className="btn-approve" 
                  onClick={() => {
                    setViewModalOpen(false);
                    setApproveModalOpen(true);
                  }}
                >
                  <CheckCircleIcon /> Approve
                </button>
                <button 
                  className="btn-reject" 
                  onClick={() => {
                    setViewModalOpen(false);
                    setRejectModalOpen(true);
                  }}
                >
                  <CancelIcon /> Reject
                </button>
                <button className="btn-secondary" onClick={() => setViewModalOpen(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Approve Confirmation Modal */}
        <ConfirmModal
          isOpen={approveModalOpen}
          title="Approve Product"
          message={`Are you sure you want to approve "${selectedProduct?.title}"?`}
          onConfirm={handleApprove}
          onCancel={() => {
            setApproveModalOpen(false);
            setSelectedProduct(null);
          }}
          confirmText={actionInProgress ? 'Approving...' : 'Approve'}
          cancelText="Cancel"
          confirmVariant="primary"
        />

        {/* Reject Confirmation Modal with Reason */}
        <ConfirmModal
          isOpen={rejectModalOpen}
          title="Reject Product"
          message={`Are you sure you want to reject "${selectedProduct?.title}"?`}
          onConfirm={handleReject}
          onCancel={() => {
            setRejectModalOpen(false);
            setSelectedProduct(null);
            setRejectionReason('');
          }}
          confirmText={actionInProgress ? 'Rejecting...' : 'Reject'}
          cancelText="Cancel"
          confirmVariant="danger"
        >
          <div className="rejection-reason">
            <label>Reason for rejection (optional):</label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter reason for rejection..."
              rows={3}
            />
          </div>
        </ConfirmModal>
      </div>
    </AdminLayout>
  );
};

export default PendingProducts;