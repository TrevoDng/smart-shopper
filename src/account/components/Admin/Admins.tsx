// src/account/components/Admin/Admins.tsx
import React, { useState, useEffect } from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CloseIcon from '@mui/icons-material/Close';
import AdminLayout from '../layout/AdminLayout';
import ConfirmModal from '../common/ConfirmModal';
import { useAuth } from '../../context/AuthContext';
import './Admins.css';

interface Admin {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
  status: string;
  emailVerified: boolean;
  createdAt: string;
  lastLogin?: string;
  approvedAt?: string;
  approvedBy?: string;
}

interface CreateAdminData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

const Admins: React.FC = () => {
  const { getToken } = useAuth();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [filteredAdmins, setFilteredAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Modal states
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<string>('');
  const [actionInProgress, setActionInProgress] = useState(false);
  
  // Create admin form state
  const [createAdminData, setCreateAdminData] = useState<CreateAdminData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [createErrors, setCreateErrors] = useState<{ [key: string]: string }>({});

  const fetchAdmins = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      const statusParam = statusFilter !== 'all' ? `&status=${statusFilter}` : '';
      const response = await fetch(`${API_BASE}/admin/users?role=ADMIN&limit=1000&offset=0${statusParam}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
        const adminsList = data.data?.users || data.users || [];
        setAdmins(adminsList);
        setFilteredAdmins(adminsList);
      } else {
        setError(data.message || 'Failed to fetch admins');
        // Sample data for demo
        setAdmins(sampleAdmins);
        setFilteredAdmins(sampleAdmins);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setAdmins(sampleAdmins);
      setFilteredAdmins(sampleAdmins);
    } finally {
      setLoading(false);
    }
  };

  // Sample data for demo/fallback
  const sampleAdmins: Admin[] = [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Admin',
      email: 'john.admin@system.com',
      phone: '+27 12 345 6789',
      role: 'ADMIN',
      status: 'active',
      emailVerified: true,
      createdAt: new Date('2024-01-01').toISOString(),
      lastLogin: new Date('2024-12-10').toISOString(),
      approvedAt: new Date('2024-01-01').toISOString(),
    },
    {
      id: '2',
      firstName: 'Sarah',
      lastName: 'Supervisor',
      email: 'sarah.supervisor@system.com',
      phone: '+27 83 456 7890',
      role: 'ADMIN',
      status: 'active',
      emailVerified: true,
      createdAt: new Date('2024-02-15').toISOString(),
      lastLogin: new Date('2024-12-09').toISOString(),
      approvedAt: new Date('2024-02-15').toISOString(),
    },
    {
      id: '3',
      firstName: 'Mike',
      lastName: 'Manager',
      email: 'mike.manager@system.com',
      phone: '+27 71 234 5678',
      role: 'ADMIN',
      status: 'deactivated',
      emailVerified: true,
      createdAt: new Date('2024-03-20').toISOString(),
      lastLogin: new Date('2024-11-15').toISOString(),
      approvedAt: new Date('2024-03-20').toISOString(),
    },
  ];

  useEffect(() => {
    fetchAdmins();
  }, [statusFilter]);

  useEffect(() => {
    const filtered = admins.filter(admin =>
      `${admin.firstName} ${admin.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (admin.phone && admin.phone.includes(searchTerm))
    );
    setFilteredAdmins(filtered);
    setPage(0);
  }, [searchTerm, admins]);

  const handleStatusChange = async () => {
    if (!selectedAdmin || !newStatus) return;
    
    setActionInProgress(true);
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE}/admin/users/${selectedAdmin.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setSuccess(`Admin ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
        await fetchAdmins();
        setStatusModalOpen(false);
        setSelectedAdmin(null);
        setNewStatus('');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.message || 'Failed to update admin status');
        setTimeout(() => setError(null), 3000);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setTimeout(() => setError(null), 3000);
    } finally {
      setActionInProgress(false);
    }
  };

  const handleCreateAdmin = async () => {
    // Validate form
    const errors: { [key: string]: string } = {};
    
    if (!createAdminData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    if (!createAdminData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    if (!createAdminData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(createAdminData.email)) {
      errors.email = 'Valid email is required';
    }
    if (!createAdminData.password) {
      errors.password = 'Password is required';
    } else if (createAdminData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    if (createAdminData.password !== createAdminData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (Object.keys(errors).length > 0) {
      setCreateErrors(errors);
      return;
    }
    
    setActionInProgress(true);
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE}/admin/create-admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(createAdminData)
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setSuccess(`Admin ${createAdminData.email} created successfully`);
        await fetchAdmins();
        setCreateModalOpen(false);
        setCreateAdminData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        setCreateErrors({});
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.message || 'Failed to create admin');
        setTimeout(() => setError(null), 3000);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setTimeout(() => setError(null), 3000);
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

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'status-badge active';
      case 'deactivated':
        return 'status-badge deactivated';
      case 'pending_email':
        return 'status-badge pending';
      case 'pending_approval':
        return 'status-badge pending-approval';
      default:
        return 'status-badge';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'deactivated':
        return 'Deactivated';
      case 'pending_email':
        return 'Pending Email Verification';
      case 'pending_approval':
        return 'Pending Approval';
      default:
        return status;
    }
  };

  const getRoleBadgeClass = () => {
    return 'role-badge admin';
  };

  // Stats
  const activeCount = admins.filter(a => a.status === 'active').length;
  const deactivatedCount = admins.filter(a => a.status === 'deactivated').length;

  if (loading && admins.length === 0) {
    return (
      <AdminLayout>
        <div className="admins-loading-container">
          <div className="spinner"></div>
          <p>Loading admins...</p>
        </div>
      </AdminLayout>
    );
  }

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedAdmins = filteredAdmins.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredAdmins.length / rowsPerPage);

  return (
    <AdminLayout>
      <div className="admins-container">
        <div className="admins-header">
          <div>
            <h1>Administrators Management</h1>
            <p>Manage system administrators and their permissions</p>
          </div>
          <div className="header-actions">
            <button 
              className="create-admin-btn"
              onClick={() => setCreateModalOpen(true)}
            >
              <PersonAddIcon /> Create New Admin
            </button>
          </div>
        </div>

        <div className="admins-header-filters">
          <div className="search-box">
            <SearchIcon className="search-icon" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-group">
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="status-filter"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="deactivated">Deactivated</option>
            </select>
            <button 
              className="refresh-btn" 
              onClick={fetchAdmins} 
              disabled={loading}
              title="Refresh"
            >
              <RefreshIcon />
            </button>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <span>⚠️</span>
            <span>{error}</span>
            <button onClick={() => setError(null)} className="close-btn">×</button>
          </div>
        )}
        
        {success && (
          <div className="success-message">
            <span>✅</span>
            <span>{success}</span>
            <button onClick={() => setSuccess(null)} className="close-btn">×</button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon">👨‍💼</div>
            <div className="stat-info">
              <h3>Total Administrators</h3>
              <p className="stat-value">{admins.length}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>Active</h3>
              <p className="stat-value">{activeCount}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🚫</div>
            <div className="stat-info">
              <h3>Deactivated</h3>
              <p className="stat-value">{deactivatedCount}</p>
            </div>
          </div>
        </div>

        <div className="table-container">
          <table className="admins-table">
            <thead>
              <tr>
                <th>Administrator</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined Date</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAdmins.length === 0 ? (
                <tr>
                  <td colSpan={8} className="empty-state">
                    <p>No administrators found</p>
                  </td>
                </tr>
              ) : (
                paginatedAdmins.map((admin) => (
                  <tr key={admin.id}>
                    <td className="admin-cell">
                      <div className="admin-info">
                        <div className="admin-avatar">
                          {admin.firstName ? admin.firstName.charAt(0).toUpperCase() : 'A'}
                        </div>
                        <div className="admin-details">
                          <div className="admin-name">
                            {admin.firstName} {admin.lastName}
                          </div>
                          <div className="admin-id">{admin.id.substring(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="email-cell">{admin.email}</td>
                    <td className="phone-cell">{admin.phone || '-'}</td>
                    <td className="role-cell">
                      <span className={getRoleBadgeClass()}>
                        ADMIN
                      </span>
                    </td>
                    <td className="status-cell">
                      <span className={getStatusBadgeClass(admin.status)}>
                        {getStatusText(admin.status)}
                      </span>
                      {!admin.emailVerified && admin.status !== 'deactivated' && (
                        <span className="email-warning">⚠️ Email not verified</span>
                      )}
                    </td>
                    <td className="date-cell">
                      {new Date(admin.createdAt).toLocaleDateString()}
                    </td>
                    <td className="date-cell">
                      {admin.lastLogin ? new Date(admin.lastLogin).toLocaleDateString() : '-'}
                    </td>
                    <td className="actions-cell">
                      <div className="action-buttons">
                        <button 
                          className="action-btn view-btn" 
                          onClick={() => {
                            setSelectedAdmin(admin);
                            setViewModalOpen(true);
                          }}
                          title="View Details"
                        >
                          <VisibilityIcon />
                        </button>
                        {admin.status === 'active' ? (
                          <button 
                            className="action-btn deactivate-btn" 
                            onClick={() => {
                              setSelectedAdmin(admin);
                              setNewStatus('deactivated');
                              setStatusModalOpen(true);
                            }}
                            title="Deactivate Admin"
                          >
                            <BlockIcon />
                          </button>
                        ) : admin.status === 'deactivated' ? (
                          <button 
                            className="action-btn activate-btn" 
                            onClick={() => {
                              setSelectedAdmin(admin);
                              setNewStatus('active');
                              setStatusModalOpen(true);
                            }}
                            title="Activate Admin"
                          >
                            <CheckCircleIcon />
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filteredAdmins.length > 0 && (
          <div className="pagination">
            <div className="pagination-info">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredAdmins.length)} of {filteredAdmins.length} administrators
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
        {viewModalOpen && selectedAdmin && (
          <div className="modal-overlay" onClick={() => setViewModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Administrator Details</h2>
                <button className="modal-close" onClick={() => setViewModalOpen(false)}>
                  <CloseIcon />
                </button>
              </div>
              <div className="modal-body">
                <div className="admin-profile">
                  <div className="profile-avatar">
                    {selectedAdmin.firstName ? selectedAdmin.firstName.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <div className="profile-name">
                    <h3>{selectedAdmin.firstName} {selectedAdmin.lastName}</h3>
                    <span className={getRoleBadgeClass()}>ADMINISTRATOR</span>
                  </div>
                </div>

                <div className="details-grid">
                  <div className="detail-item">
                    <label>Email:</label>
                    <span>{selectedAdmin.email}</span>
                  </div>
                  <div className="detail-item">
                    <label>Phone:</label>
                    <span>{selectedAdmin.phone || 'Not provided'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Status:</label>
                    <span className={getStatusBadgeClass(selectedAdmin.status)}>
                      {getStatusText(selectedAdmin.status)}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Email Verified:</label>
                    <span>{selectedAdmin.emailVerified ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Joined:</label>
                    <span>{new Date(selectedAdmin.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="detail-item">
                    <label>Last Login:</label>
                    <span>{selectedAdmin.lastLogin ? new Date(selectedAdmin.lastLogin).toLocaleString() : 'Never'}</span>
                  </div>
                  {selectedAdmin.approvedAt && (
                    <>
                      <div className="detail-item">
                        <label>Approved At:</label>
                        <span>{new Date(selectedAdmin.approvedAt).toLocaleString()}</span>
                      </div>
                      <div className="detail-item">
                        <label>Approved By:</label>
                        <span>{selectedAdmin.approvedBy || 'System'}</span>
                      </div>
                    </>
                  )}
                  <div className="detail-item full-width">
                    <label>Admin ID:</label>
                    <span className="admin-id-text">{selectedAdmin.id}</span>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                {selectedAdmin.status === 'active' ? (
                  <button 
                    className="btn-deactivate" 
                    onClick={() => {
                      setViewModalOpen(false);
                      setNewStatus('deactivated');
                      setStatusModalOpen(true);
                    }}
                  >
                    <BlockIcon /> Deactivate
                  </button>
                ) : selectedAdmin.status === 'deactivated' ? (
                  <button 
                    className="btn-activate" 
                    onClick={() => {
                      setViewModalOpen(false);
                      setNewStatus('active');
                      setStatusModalOpen(true);
                    }}
                  >
                    <CheckCircleIcon /> Activate
                  </button>
                ) : null}
                <button className="btn-secondary" onClick={() => setViewModalOpen(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create Admin Modal */}
        {createModalOpen && (
          <div className="modal-overlay" onClick={() => setCreateModalOpen(false)}>
            <div className="modal-content create-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Create New Administrator</h2>
                <button className="modal-close" onClick={() => setCreateModalOpen(false)}>
                  <CloseIcon />
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    value={createAdminData.firstName}
                    onChange={(e) => setCreateAdminData({...createAdminData, firstName: e.target.value})}
                    className={`form-input ${createErrors.firstName ? 'error' : ''}`}
                    placeholder="Enter first name"
                  />
                  {createErrors.firstName && <span className="error-text">{createErrors.firstName}</span>}
                </div>
                
                <div className="form-group">
                  <label>Last Name *</label>
                  <input
                    type="text"
                    value={createAdminData.lastName}
                    onChange={(e) => setCreateAdminData({...createAdminData, lastName: e.target.value})}
                    className={`form-input ${createErrors.lastName ? 'error' : ''}`}
                    placeholder="Enter last name"
                  />
                  {createErrors.lastName && <span className="error-text">{createErrors.lastName}</span>}
                </div>
                
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={createAdminData.email}
                    onChange={(e) => setCreateAdminData({...createAdminData, email: e.target.value})}
                    className={`form-input ${createErrors.email ? 'error' : ''}`}
                    placeholder="admin@example.com"
                  />
                  {createErrors.email && <span className="error-text">{createErrors.email}</span>}
                </div>
                
                <div className="form-group">
                  <label>Password *</label>
                  <input
                    type="password"
                    value={createAdminData.password}
                    onChange={(e) => setCreateAdminData({...createAdminData, password: e.target.value})}
                    className={`form-input ${createErrors.password ? 'error' : ''}`}
                    placeholder="Minimum 6 characters"
                  />
                  {createErrors.password && <span className="error-text">{createErrors.password}</span>}
                </div>
                
                <div className="form-group">
                  <label>Confirm Password *</label>
                  <input
                    type="password"
                    value={createAdminData.confirmPassword}
                    onChange={(e) => setCreateAdminData({...createAdminData, confirmPassword: e.target.value})}
                    className={`form-input ${createErrors.confirmPassword ? 'error' : ''}`}
                    placeholder="Re-enter password"
                  />
                  {createErrors.confirmPassword && <span className="error-text">{createErrors.confirmPassword}</span>}
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn-secondary" onClick={() => setCreateModalOpen(false)}>
                  Cancel
                </button>
                <button 
                  className="btn-primary" 
                  onClick={handleCreateAdmin}
                  disabled={actionInProgress}
                >
                  {actionInProgress ? 'Creating...' : 'Create Admin'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Status Change Confirmation Modal */}
        <ConfirmModal
          isOpen={statusModalOpen}
          title={newStatus === 'active' ? 'Activate Administrator' : 'Deactivate Administrator'}
          message={
            newStatus === 'active'
              ? `Are you sure you want to activate ${selectedAdmin?.firstName} ${selectedAdmin?.lastName}?`
              : `Are you sure you want to deactivate ${selectedAdmin?.firstName} ${selectedAdmin?.lastName}? This will prevent them from accessing the admin panel.`
          }
          onConfirm={handleStatusChange}
          onCancel={() => {
            setStatusModalOpen(false);
            setSelectedAdmin(null);
            setNewStatus('');
          }}
          confirmText={actionInProgress ? 'Processing...' : (newStatus === 'active' ? 'Activate' : 'Deactivate')}
          cancelText="Cancel"
          confirmVariant={newStatus === 'active' ? 'primary' : 'danger'}
        />
      </div>
    </AdminLayout>
  );
};

export default Admins;