// src/account/components/Admin/AdminManagement.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import ConfirmModal from '../common/ConfirmModal';
import './AdminManagement.css';
import { useSlider } from '../../../slider/slidercontext/SliderContext';
import AdminLayout from '../layout/AdminLayout';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'ADMIN' | 'EMPLOYEE' | 'CLIENT';
  status: 'pending_email' | 'email_verified' | 'pending_approval' | 'active' | 'rejected' | 'deactivated';
  createdAt: string;
  approvedAt?: string;
  lastLogin?: string;
}

const AdminManagement: React.FC = () => {
  const { user: currentUser, getAllUsers, updateUserStatus, getToken } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userToModify, setUserToModify] = useState<{ id: string; email: string; action: 'deactivate' | 'activate' } | null>(null);
  const [newAdminData, setNewAdminData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const usersData = await getAllUsers();
      setUsers(usersData || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch users');
      console.error('Fetch users error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    // Validate passwords match
    if (newAdminData.password !== newAdminData.confirmPassword) {
      setError('Passwords do not match');
      setIsSubmitting(false);
      return;
    }

    try {
      const token = getToken();
      if (!token) throw new Error('Not authenticated');

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api'}/admin/create-admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          firstName: newAdminData.firstName,
          lastName: newAdminData.lastName,
          email: newAdminData.email,
          password: newAdminData.password,
          confirmPassword: newAdminData.confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(`Admin ${newAdminData.email} created successfully`);
        setNewAdminData({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
        setShowAddModal(false);
        fetchUsers(); // Refresh the list
      } else {
        setError(data.message || data.error?.message || 'Failed to create admin');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChangeClick = (userId: string, userEmail: string, currentStatus: string) => {
    const action = currentStatus === 'active' ? 'deactivate' : 'activate';
    setUserToModify({ id: userId, email: userEmail, action });
    setShowConfirmModal(true);
  };

  const handleConfirmStatusChange = async () => {
    if (!userToModify) return;

    setError('');
    setSuccess('');

    try {
      const newStatus = userToModify.action === 'activate' ? 'active' : 'deactivated';
      await updateUserStatus(userToModify.id, newStatus);
      
      setSuccess(`${userToModify.email} has been ${userToModify.action === 'activate' ? 'activated' : 'deactivated'}`);
      fetchUsers(); // Refresh the list
    } catch (err: any) {
      setError(err.message || 'Failed to update user status');
    } finally {
      setShowConfirmModal(false);
      setUserToModify(null);
    }
  };

  const handleCancelStatusChange = () => {
    setShowConfirmModal(false);
    setUserToModify(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAdminData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const getFullName = (user: User) => {
    return `${user.firstName} ${user.lastName}`.trim() || user.email;
  };

  const getStatusBadgeClass = (status: string) => {
    const statusMap: Record<string, string> = {
      'active': 'status-active',
      'deactivated': 'status-deactivated',
      'pending_email': 'status-pending',
      'email_verified': 'status-pending',
      'pending_approval': 'status-pending',
      'rejected': 'status-rejected',
    };
    return statusMap[status] || 'status-default';
  };

  const getStatusDisplay = (status: string) => {
    const displayMap: Record<string, string> = {
      'pending_email': 'Pending Email',
      'email_verified': 'Email Verified',
      'pending_approval': 'Pending Approval',
      'active': 'Active',
      'rejected': 'Rejected',
      'deactivated': 'Deactivated',
    };
    return displayMap[status] || status;
  };

  const admins = users.filter(u => u.role === 'ADMIN');
  const employees = users.filter(u => u.role === 'EMPLOYEE');
  const clients = users.filter(u => u.role === 'CLIENT');

  if (loading) {
    return (
      <div className="admin-management">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
    <div className="admin-management">
      <div className="management-header">
        <h2 className="management-title">Admin Management</h2>
        <button 
          onClick={() => setShowAddModal(true)}
          className="add-admin-btn"
        >
          + Add Admin
        </button>
      </div>

      {error && (
        <div className="management-error">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="management-success">
          <span>✅</span>
          <span>{success}</span>
        </div>
      )}

      {/* Administrators Section */}
      <div className="management-section">
        <h3 className="section-title">Administrators ({admins.length})</h3>
        <div className="users-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map(admin => (
                <tr key={admin.id}>
                  <td>{getFullName(admin)}</td>
                  <td>{admin.email}</td>
                  <td>
                    <span className={`status-badge ${getStatusBadgeClass(admin.status)}`}>
                      {getStatusDisplay(admin.status)}
                    </span>
                  </td>
                  <td>{new Date(admin.createdAt).toLocaleDateString()}</td>
                  <td>
                    {admin.id !== currentUser?.id && (
                      <button
                        onClick={() => handleStatusChangeClick(admin.id, admin.email, admin.status)}
                        className={`action-btn ${admin.status === 'active' ? 'deactivate-btn' : 'activate-btn'}`}
                      >
                        {admin.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                    )}
                    {admin.id === currentUser?.id && (
                      <span className="current-user-badge">You</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Employees Section */}
      <div className="management-section">
        <h3 className="section-title">Employees ({employees.length})</h3>
        <div className="users-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Approved At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(employee => (
                <tr key={employee.id}>
                  <td>{getFullName(employee)}</td>
                  <td>{employee.email}</td>
                  <td>
                    <span className={`status-badge ${getStatusBadgeClass(employee.status)}`}>
                      {getStatusDisplay(employee.status)}
                    </span>
                  </td>
                  <td>{new Date(employee.createdAt).toLocaleDateString()}</td>
                  <td>{employee.approvedAt ? new Date(employee.approvedAt).toLocaleDateString() : '-'}</td>
                  <td>
                    {employee.status !== 'pending_approval' && employee.id !== currentUser?.id && (
                      <button
                        onClick={() => handleStatusChangeClick(employee.id, employee.email, employee.status)}
                        className={`action-btn ${employee.status === 'active' ? 'deactivate-btn' : 'activate-btn'}`}
                      >
                        {employee.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                    )}
                    {employee.status === 'pending_approval' && (
                      <span className="pending-badge">Pending Approval</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Clients Section */}
      <div className="management-section">
        <h3 className="section-title">Customers ({clients.length})</h3>
        <div className="users-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map(client => (
                <tr key={client.id}>
                  <td>{getFullName(client)}</td>
                  <td>{client.email}</td>
                  <td>
                    <span className={`status-badge ${getStatusBadgeClass(client.status)}`}>
                      {getStatusDisplay(client.status)}
                    </span>
                  </td>
                  <td>{new Date(client.createdAt).toLocaleDateString()}</td>
                  <td>{client.lastLogin ? new Date(client.lastLogin).toLocaleDateString() : '-'}</td>
                  <td>
                    <button
                      onClick={() => handleStatusChangeClick(client.id, client.email, client.status)}
                      className={`action-btn ${client.status === 'active' ? 'deactivate-btn' : 'activate-btn'}`}
                    >
                      {client.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Admin Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create New Admin</h3>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <form onSubmit={handleCreateAdmin}>
              <div className="modal-field">
                <label htmlFor="firstName">First Name *</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={newAdminData.firstName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter first name"
                />
              </div>
              <div className="modal-field">
                <label htmlFor="lastName">Last Name *</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={newAdminData.lastName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter last name"
                />
              </div>
              <div className="modal-field">
                <label htmlFor="email">Email Address *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={newAdminData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter email address"
                />
              </div>
              <div className="modal-field">
                <label htmlFor="password">Password *</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={newAdminData.password}
                  onChange={handleInputChange}
                  required
                  placeholder="Minimum 6 characters"
                />
              </div>
              <div className="modal-field">
                <label htmlFor="confirmPassword">Confirm Password *</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={newAdminData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  placeholder="Confirm password"
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddModal(false)} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="submit-btn">
                  {isSubmitting ? 'Creating...' : 'Create Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Status Change */}
      <ConfirmModal
        isOpen={showConfirmModal}
        title={userToModify?.action === 'activate' ? 'Activate User' : 'Deactivate User'}
        message={`Are you sure you want to ${userToModify?.action} ${userToModify?.email}?`}
        onConfirm={handleConfirmStatusChange}
        onCancel={handleCancelStatusChange}
        confirmText={userToModify?.action === 'activate' ? 'Activate' : 'Deactivate'}
        cancelText="Cancel"
        confirmVariant={userToModify?.action === 'activate' ? 'primary' : 'danger'}
      />
    </div>
    </AdminLayout>
  );
};

export default AdminManagement;