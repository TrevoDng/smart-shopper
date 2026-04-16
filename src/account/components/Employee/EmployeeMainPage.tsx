// src/pages/employee/EmployeeMainPage.tsx
import React from 'react';
import EmployeeLayout from '../layout/EmployeeLayout';
import DashboardCard from '../common/DashboardCard';
import './EmployeeMainPage.css';
import { Link } from 'react-router-dom';

const EmployeeMainPage: React.FC = () => {
  // Mock data - will be replaced with real data later
  const stats = {
    registrationStatus: 'Pending Approval',
    productsAdded: 12,
    approvedProducts: 8,
    pendingProducts: 4,
    rejectedProducts: 0,
    totalSales: 3420,
    outOfStock: 1
  };

  const myProducts = [
    { name: 'Gaming Laptop', sales: 1245, stock: 5 },
    { name: 'Wireless Mouse', sales: 892, stock: 23 },
    { name: 'Mechanical Keyboard', sales: 456, stock: 0 },
  ];

  return (
    <EmployeeLayout>
      <div className="employee-dashboard">
        <div className="dashboard-header">
          <h1>Welcome back, John</h1>
          <p>Manage your products and track your performance</p>
        </div>

        {/* Registration Status Banner */}
        <div className="status-banner status-pending">
          <span className="status-icon">⏳</span>
          <div className="status-info">
            <h3>Registration Status: {stats.registrationStatus}</h3>
            <p>Your account is waiting for admin approval. You'll be notified once approved.</p>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-info">
              <h3>{stats.productsAdded}</h3>
              <p>Products Added</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>{stats.approvedProducts}</h3>
              <p>Approved</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <h3>{stats.pendingProducts}</h3>
              <p>Pending Review</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <h3>${stats.totalSales}</h3>
              <p>Total Sales</p>
            </div>
          </div>
        </div>

        {/* Action Cards Row */}
        <div className="cards-section">
          <h2>Quick Actions</h2>
          <div className="cards-grid">
            <DashboardCard
              title="Add New Product"
              icon="➕"
              description="Submit a new product for review"
              linkTo="/employee/add-product"
              color="#4f46e5"
            />
            <DashboardCard
              title="My Products"
              icon="📦"
              value={stats.productsAdded}
              description="View all your products"
              linkTo="/employee/my-products"
              color="#10b981"
            />
            <DashboardCard
              title="My Performance"
              icon="📈"
              description={`${stats.approvedProducts}/${stats.productsAdded} approved`}
              linkTo="/employee/my-performance"
              color="#f59e0b"
            />
            <DashboardCard
              title="Send Suggestion"
              icon="💡"
              description="Share ideas with admin"
              linkTo="/employee/suggestions"
              color="#ec489a"
            />
          </div>
        </div>

        {/* My Products Performance */}
        <div className="cards-section">
          <h2>My Products Performance</h2>
          <div className="products-table">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Sales</th>
                  <th>Stock</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {myProducts.map((product) => (
                  <tr key={product.name}>
                    <td>{product.name}</td>
                    <td>${product.sales}</td>
                    <td className={product.stock === 0 ? 'out-of-stock' : ''}>
                      {product.stock === 0 ? '⚠️ Out of Stock' : product.stock}
                    </td>
                    <td>
                      <span className="status-badge approved">Approved</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Client Enquiries (View Only) */}
        <div className="cards-section">
          <h2>Recent Client Enquiries</h2>
          <div className="enquiries-list">
            <div className="enquiry-item">
              <div className="enquiry-icon">💬</div>
              <div className="enquiry-content">
                <p>Is the gaming laptop available in black?</p>
                <span className="enquiry-meta">From: client@email.com • 2 hours ago</span>
              </div>
              <span className="enquiry-status unresolved">Unresolved</span>
            </div>
            <div className="enquiry-item">
              <div className="enquiry-icon">💬</div>
              <div className="enquiry-content">
                <p>When will the wireless mouse be back in stock?</p>
                <span className="enquiry-meta">From: customer@email.com • 5 hours ago</span>
              </div>
              <span className="enquiry-status unresolved">Unresolved</span>
            </div>
          </div>
          <div className="view-all">
            <Link to="/employee/enquiries">View all enquiries →</Link>
          </div>
        </div>

        {/* Out of Stock Alert */}
        {stats.outOfStock > 0 && (
          <div className="alert-banner">
            <span>⚠️</span>
            <p>You have {stats.outOfStock} product(s) out of stock. Update inventory now.</p>
            <Link to="/employee/out-of-stock">View</Link>
          </div>
        )}
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeMainPage;