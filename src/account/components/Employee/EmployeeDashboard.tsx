// src/components/employee/EmployeeDashboard.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { productsApi, Product } from '../../../services/productsApi';
import { userApi } from '../../../services/userApi';

// import { useAuth } from '../../account/context/AuthContext';
// import { productsApi, Product } from '../../services/productsApi';
// import { userApi } from '../../services/userApi';
import './EmployeeDashboard.css';
import EmployeeLayout from '../layout/EmployeeLayout';
import { cleanPrice } from '../../../itemsComponents/products/utils/filterUtils';

const EmployeeDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    outOfStock: 0,
  });
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [userStatus, setUserStatus] = useState<{ status: string; approvedAt?: Date } | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch user status
      const status = await userApi.getUserStatus();
      setUserStatus(user?.status ? { status: user.status, approvedAt: status.approvedAt } : null);

      // Fetch product statistics
      const productStats = await productsApi.getProductStats();
      setStats(productStats);

      // Fetch recent products (last 5)
      const { products } = await productsApi.getMyProducts(undefined, 5, 0);
      setRecentProducts(products);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'approved': return 'status-approved';
      case 'pending': return 'status-pending';
      case 'rejected': return 'status-rejected';
      case 'active': return 'status-active';
      default: return 'status-inactive';
    }
  };

  const getUserStatusMessage = () => {
    if (!userStatus) return '';
    switch (userStatus.status) {
      case 'pending_approval':
        return '⏳ Your account is pending admin approval. You cannot add products yet.';
      case 'active':
        return '✅ Your account is active. You can add and manage products.';
      case 'rejected':
        return '❌ Your account registration was rejected. Please contact support.';
      default:
        return `📋 Account status: ${userStatus.status}`;
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <EmployeeLayout>
    <div className="employee-dashboard">
      {/* Welcome Section */}
      <div className="dashboard-welcome">
        <h1>Welcome back, {user?.firstName} {user?.lastName}!</h1>
        <p>Here's an overview of your products and performance {userStatus?.status}</p>
        {userStatus && (
          <div className={`status-alert ${userStatus.status === 'active' ? 'status-success' : 'status-warning'}`}>
            {getUserStatusMessage()}
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <h3>Total Products</h3>
            <p className="stat-number">{stats.total}</p>
          </div>
        </div>
        <div className="stat-card stat-approved">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>Approved</h3>
            <p className="stat-number">{stats.approved}</p>
          </div>
        </div>
        <div className="stat-card stat-pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <h3>Pending Review</h3>
            <p className="stat-number">{stats.pending}</p>
          </div>
        </div>
        <div className="stat-card stat-rejected">
          <div className="stat-icon">❌</div>
          <div className="stat-info">
            <h3>Rejected</h3>
            <p className="stat-number">{stats.rejected}</p>
          </div>
        </div>
        <div className="stat-card stat-outofstock">
          <div className="stat-icon">⚠️</div>
          <div className="stat-info">
            <h3>Out of Stock</h3>
            <p className="stat-number">{stats.outOfStock}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <button 
            className="action-btn" 
            onClick={() => navigate('/employee/add-product')}
            disabled={userStatus?.status !== 'active'}
          >
            <span className="action-icon">➕</span>
            Add New Product
          </button>
          <button 
            className="action-btn" 
            onClick={() => navigate('/employee/my-products')}
          >
            <span className="action-icon">📦</span>
            My Products
          </button>
          <button 
            className="action-btn" 
            onClick={() => navigate('/employee/my-performance')}
          >
            <span className="action-icon">📈</span>
            My Performance
          </button>
        </div>
      </div>

      {/* Recent Products Table */}
      <div className="recent-products">
        <div className="section-header">
          <h2>Recent Products</h2>
          <button 
            className="view-all-btn" 
            onClick={() => navigate('/employee/my-products')}
          >
            View All →
          </button>
        </div>
        
        {recentProducts.length === 0 ? (
          <div className="empty-state">
            <p>No products added yet.</p>
            <button 
              className="add-product-btn" 
              onClick={() => navigate('/employee/add-product')}
              disabled={userStatus?.status !== 'active'}
            >
              Add Your First Product
            </button>
          </div>
        ) : (
          <div className="products-table-container">
            <table className="products-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Brand</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Date Added</th>
                </tr>
              </thead>
              <tbody>
                {recentProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="product-cell">
                      {product.imgSrc && product.imgSrc[0] && (
                        <img 
                          src={product.imgSrc[0]} 
                          alt={product.title} 
                          className="product-thumbnail"
                        />
                      )}
                      <span className="product-title">{product.title}</span>
                    </td>
                    <td>{product.brand}</td>
                    <td className="price">R{product.price}</td>
                    <td className={product.stockQuantity === 0 ? 'out-of-stock' : ''}>
                      {product.stockQuantity === 0 ? 'Out of Stock' : product.stockQuantity}
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusBadgeClass(product.status)}`}>
                        {product.status}
                      </span>
                    </td>
                    <td>{new Date(product.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Performance Summary */}
      <div className="performance-summary">
        <h2>Performance Summary</h2>
        <div className="performance-stats">
          <div className="performance-item">
            <div className="performance-label">Approval Rate</div>
            <div className="performance-value">
              {stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0}%
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill approved" 
                style={{ width: `${stats.total > 0 ? (stats.approved / stats.total) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
          <div className="performance-item">
            <div className="performance-label">Pending Rate</div>
            <div className="performance-value">
              {stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0}%
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill pending" 
                style={{ width: `${stats.total > 0 ? (stats.pending / stats.total) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </EmployeeLayout>
  );
};

export default EmployeeDashboard;