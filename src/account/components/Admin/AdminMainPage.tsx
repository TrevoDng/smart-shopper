// src/account/components/Admin/AdminMainPage.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from '../layout/AdminLayout';
import DashboardCard from '../common/DashboardCard';
import './AdminMainPage.css';

const AdminMainPage: React.FC = () => {
  const { getToken } = useAuth();
  const [stats, setStats] = useState({
    pendingRegistrations: 0,
    totalClients: 0,
    activeEmployees: 0,
    activeInviteCodes: 0
  });
  const [loading, setLoading] = useState(true);

  const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = getToken();
      
      // Fetch all users
      const usersResponse = await fetch(`${API_BASE}/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const usersData = await usersResponse.json();
      
      // Fetch active invite codes
      const codesResponse = await fetch(`${API_BASE}/admin/secret-codes?status=active`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const codesData = await codesResponse.json();

      if (usersResponse.ok && usersData.success) {
        const users = usersData.data?.users || usersData.users || [];
        setStats({
          pendingRegistrations: users.filter((u: any) => 
            u.role === 'EMPLOYEE' && u.status === 'pending_approval'
          ).length,
          totalClients: users.filter((u: any) => u.role === 'CLIENT' && u.status === 'active').length,
          activeEmployees: users.filter((u: any) => 
            u.role === 'EMPLOYEE' && u.status === 'active'
          ).length,
          activeInviteCodes: codesData.success ? (codesData.data?.codes?.length || codesData.codes?.length || 0) : 0
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const categoryPerformance = [
    { name: 'Home Appliances', sales: 1245, icon: '🏠' },
    { name: 'Computers', sales: 892, icon: '💻' },
    { name: 'Garden', sales: 456, icon: '🌿' },
    { name: 'Devices', sales: 678, icon: '📱' },
    { name: 'Clothes', sales: 234, icon: '👕' },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-dashboard loading-state">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-dashboard">
        <div className="dashboard-header">
          <h1>Welcome back, Admin</h1>
          <p>Here's what's happening with your store today</p>
        </div>

        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>{stats.totalClients}</h3>
              <p>Active Customers</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👔</div>
            <div className="stat-info">
              <h3>{stats.activeEmployees}</h3>
              <p>Active Employees</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🔑</div>
            <div className="stat-info">
              <h3>{stats.activeInviteCodes}</h3>
              <p>Active Invite Codes</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <h3>{stats.pendingRegistrations}</h3>
              <p>Pending Approvals</p>
            </div>
          </div>
        </div>

        <div className="cards-section">
          <h2>Quick Actions</h2>
          <div className="cards-grid">
            <DashboardCard
              title="Registration Requests"
              icon="👥"
              value={stats.pendingRegistrations}
              description="Employees waiting for approval"
              linkTo="/admin/registration-requests"
              badge={stats.pendingRegistrations}
              color="#ef4444"
            />
            <DashboardCard
              title="Invite Codes"
              icon="🔑"
              value={stats.activeInviteCodes}
              description="Active employee invite codes"
              linkTo="/admin/invite-codes"
              badge={stats.activeInviteCodes}
              color="#f59e0b"
            />
            <DashboardCard
              title="Employee Performance"
              icon="📈"
              description="Track employee activity"
              linkTo="/admin/employee-performance"
              color="#10b981"
            />
            <DashboardCard
              title="All Users"
              icon="👥"
              value={stats.totalClients + stats.activeEmployees}
              description="Total active users"
              linkTo="/admin/users"
              color="#4f46e5"
            />
          </div>
        </div>

        <div className="cards-section">
          <h2>Product Categories Performance</h2>
          <div className="categories-grid">
            {categoryPerformance.map((cat) => (
              <DashboardCard
                key={cat.name}
                title={cat.name}
                icon={cat.icon}
                value={`$${cat.sales.toLocaleString()}`}
                description="Total sales this month"
                linkTo={`/admin/products-performance?category=${cat.name}`}
                color="#4f46e5"
              />
            ))}
          </div>
        </div>

        <div className="cards-section">
          <h2>Communication</h2>
          <div className="cards-grid">
            <DashboardCard
              title="Employee Enquiries"
              icon="💬"
              description="View messages"
              linkTo="/admin/enquiries?type=employee"
              color="#8b5cf6"
            />
            <DashboardCard
              title="Client Enquiries"
              icon="💬"
              description="View messages"
              linkTo="/admin/enquiries?type=client"
              color="#8b5cf6"
            />
            <DashboardCard
              title="Suggestions"
              icon="💡"
              description="View feedback"
              linkTo="/admin/suggestions"
              color="#ec489a"
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminMainPage;