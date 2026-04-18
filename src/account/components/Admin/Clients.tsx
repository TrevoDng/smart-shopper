// src/account/components/Admin/Clients.tsx
import React, { useState, useEffect } from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import AdminLayout from '../layout/AdminLayout';
import ConfirmModal from '../common/ConfirmModal';
import './Clients.css';

interface Client {
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
}

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

const Clients: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  
  // Modal states
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<string>('');
  const [actionInProgress, setActionInProgress] = useState(false);

  const fetchClients = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const statusParam = statusFilter !== 'all' ? `&status=${statusFilter}` : '';
      const response = await fetch(`${API_BASE}/admin/users?role=CLIENT&limit=1000&offset=0${statusParam}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
        const clientsList = data.data?.users || data.users || [];
        setClients(clientsList);
        setFilteredClients(clientsList);
        setTotal(data.data?.total || clientsList.length);
      } else {
        setError(data.message || 'Failed to fetch clients');
        // Sample data for demo
        setClients(sampleClients);
        setFilteredClients(sampleClients);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setClients(sampleClients);
      setFilteredClients(sampleClients);
    } finally {
      setLoading(false);
    }
  };

  // Sample data for demo/fallback
  const sampleClients: Client[] = [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+27 12 345 6789',
      role: 'CLIENT',
      status: 'active',
      emailVerified: true,
      createdAt: new Date('2024-01-15').toISOString(),
      lastLogin: new Date('2024-12-10').toISOString(),
    },
    {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '+27 83 456 7890',
      role: 'CLIENT',
      status: 'active',
      emailVerified: true,
      createdAt: new Date('2024-02-20').toISOString(),
      lastLogin: new Date('2024-12-09').toISOString(),
    },
    {
      id: '3',
      firstName: 'Peter',
      lastName: 'Jones',
      email: 'peter.jones@example.com',
      phone: '+27 71 234 5678',
      role: 'CLIENT',
      status: 'deactivated',
      emailVerified: true,
      createdAt: new Date('2024-03-10').toISOString(),
      lastLogin: new Date('2024-11-15').toISOString(),
    },
    {
      id: '4',
      firstName: 'Sarah',
      lastName: 'Williams',
      email: 'sarah.williams@example.com',
      phone: '',
      role: 'CLIENT',
      status: 'pending_email',
      emailVerified: false,
      createdAt: new Date('2024-12-01').toISOString(),
    },
  ];

  useEffect(() => {
    fetchClients();
  }, [statusFilter]);

  useEffect(() => {
    const filtered = clients.filter(client =>
      `${client.firstName} ${client.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.phone && client.phone.includes(searchTerm))
    );
    setFilteredClients(filtered);
    setPage(0);
  }, [searchTerm, clients]);

  const handleStatusChange = async () => {
    if (!selectedClient || !newStatus) return;
    
    setActionInProgress(true);
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch(`${API_BASE}/admin/users/${selectedClient.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        await fetchClients();
        setStatusModalOpen(false);
        setSelectedClient(null);
        setNewStatus('');
      } else {
        setError(data.message || 'Failed to update client status');
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

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'status-badge active';
      case 'deactivated':
        return 'status-badge deactivated';
      case 'pending_email':
        return 'status-badge pending';
      case 'pending_approval':
        return 'status-badge pending';
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
        return 'Pending Email';
      case 'pending_approval':
        return 'Pending Approval';
      default:
        return status;
    }
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role?.toUpperCase()) {
      case 'ADMIN':
        return 'role-badge admin';
      case 'EMPLOYEE':
        return 'role-badge employee';
      case 'CLIENT':
        return 'role-badge client';
      default:
        return 'role-badge';
    }
  };

  if (loading && clients.length === 0) {
    return (
      <AdminLayout>
        <div className="clients-loading-container">
          <div className="spinner"></div>
          <p>Loading clients...</p>
        </div>
      </AdminLayout>
    );
  }

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedClients = filteredClients.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredClients.length / rowsPerPage);

  // Stats
  const activeCount = clients.filter(c => c.status === 'active').length;
  const deactivatedCount = clients.filter(c => c.status === 'deactivated').length;
  const pendingCount = clients.filter(c => c.status === 'pending_email' || c.status === 'pending_approval').length;

  return (
    <AdminLayout>
      <div className="clients-container">
        <div className="clients-header">
          <h1>Clients Management</h1>
          <div className="header-actions">
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
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="status-filter"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="deactivated">Deactivated</option>
              <option value="pending_email">Pending Email</option>
            </select>
            <button 
              className="refresh-btn" 
              onClick={fetchClients} 
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

        {/* Stats Cards */}
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>Total Clients</h3>
              <p className="stat-value">{clients.length}</p>
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
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <h3>Pending</h3>
              <p className="stat-value">{pendingCount}</p>
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
          <table className="clients-table">
            <thead>
              <tr>
                <th>Client</th>
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
              {paginatedClients.length === 0 ? (
                <tr>
                  <td colSpan={8} className="empty-state">
                    <p>No clients found</p>
                  </td>
                </tr>
              ) : (
                paginatedClients.map((client) => (
                  <tr key={client.id}>
                    <td className="client-cell">
                      <div className="client-info">
                        <div className="client-avatar">
                          {client.firstName ? client.firstName.charAt(0).toUpperCase() : 'C'}
                        </div>
                        <div className="client-details">
                          <div className="client-name">
                            {client.firstName} {client.lastName}
                          </div>
                          <div className="client-id">{client.id.substring(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="email-cell">{client.email}</td>
                    <td className="phone-cell">{client.phone || '-'}</td>
                    <td className="role-cell">
                      <span className={getRoleBadgeClass(client.role)}>
                        {client.role || 'CLIENT'}
                      </span>
                    </td>
                    <td className="status-cell">
                      <span className={getStatusBadgeClass(client.status)}>
                        {getStatusText(client.status)}
                      </span>
                      {!client.emailVerified && client.status !== 'deactivated' && (
                        <span className="email-warning">⚠️ Email not verified</span>
                      )}
                    </td>
                    <td className="date-cell">
                      {new Date(client.createdAt).toLocaleDateString()}
                    </td>
                    <td className="date-cell">
                      {client.lastLogin ? new Date(client.lastLogin).toLocaleDateString() : '-'}
                    </td>
                    <td className="actions-cell">
                      <div className="action-buttons">
                        <button 
                          className="action-btn view-btn" 
                          onClick={() => {
                            setSelectedClient(client);
                            setViewModalOpen(true);
                          }}
                          title="View Details"
                        >
                          <VisibilityIcon />
                        </button>
                        {client.status === 'active' ? (
                          <button 
                            className="action-btn deactivate-btn" 
                            onClick={() => {
                              setSelectedClient(client);
                              setNewStatus('deactivated');
                              setStatusModalOpen(true);
                            }}
                            title="Deactivate Client"
                          >
                            <BlockIcon />
                          </button>
                        ) : client.status === 'deactivated' ? (
                          <button 
                            className="action-btn activate-btn" 
                            onClick={() => {
                              setSelectedClient(client);
                              setNewStatus('active');
                              setStatusModalOpen(true);
                            }}
                            title="Activate Client"
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

        {filteredClients.length > 0 && (
          <div className="pagination">
            <div className="pagination-info">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredClients.length)} of {filteredClients.length} clients
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
        {viewModalOpen && selectedClient && (
          <div className="modal-overlay" onClick={() => setViewModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Client Details</h2>
                <button className="modal-close" onClick={() => setViewModalOpen(false)}>
                  <CloseIcon />
                </button>
              </div>
              <div className="modal-body">
                <div className="client-profile">
                  <div className="profile-avatar">
                    {selectedClient.firstName ? selectedClient.firstName.charAt(0).toUpperCase() : 'C'}
                  </div>
                  <div className="profile-name">
                    <h3>{selectedClient.firstName} {selectedClient.lastName}</h3>
                    <span className={getRoleBadgeClass(selectedClient.role)}>
                      {selectedClient.role || 'CLIENT'}
                    </span>
                  </div>
                </div>

                <div className="details-grid">
                  <div className="detail-item">
                    <label>Email:</label>
                    <span>{selectedClient.email}</span>
                  </div>
                  <div className="detail-item">
                    <label>Phone:</label>
                    <span>{selectedClient.phone || 'Not provided'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Status:</label>
                    <span className={getStatusBadgeClass(selectedClient.status)}>
                      {getStatusText(selectedClient.status)}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Email Verified:</label>
                    <span>{selectedClient.emailVerified ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Joined:</label>
                    <span>{new Date(selectedClient.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="detail-item">
                    <label>Last Login:</label>
                    <span>{selectedClient.lastLogin ? new Date(selectedClient.lastLogin).toLocaleString() : 'Never'}</span>
                  </div>
                  {selectedClient.approvedAt && (
                    <div className="detail-item">
                      <label>Approved At:</label>
                      <span>{new Date(selectedClient.approvedAt).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="detail-item full-width">
                    <label>Client ID:</label>
                    <span className="client-id-text">{selectedClient.id}</span>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                {selectedClient.status === 'active' ? (
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
                ) : selectedClient.status === 'deactivated' ? (
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

        {/* Status Change Confirmation Modal */}
        <ConfirmModal
          isOpen={statusModalOpen}
          title={newStatus === 'active' ? 'Activate Client' : 'Deactivate Client'}
          message={
            newStatus === 'active'
              ? `Are you sure you want to activate ${selectedClient?.firstName} ${selectedClient?.lastName}?`
              : `Are you sure you want to deactivate ${selectedClient?.firstName} ${selectedClient?.lastName}?`
          }
          onConfirm={handleStatusChange}
          onCancel={() => {
            setStatusModalOpen(false);
            setSelectedClient(null);
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

export default Clients;