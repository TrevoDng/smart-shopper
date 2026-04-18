// src/account/components/Admin/Employees.tsx
import React, { useState, useEffect } from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import AdminLayout from '../layout/AdminLayout';
import ConfirmModal from '../common/ConfirmModal';
import './Employees.css';

interface Employee {
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

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Modal states
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<string>('');
  const [actionInProgress, setActionInProgress] = useState(false);

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const statusParam = statusFilter !== 'all' ? `&status=${statusFilter}` : '';
      const response = await fetch(`${API_BASE}/admin/users?role=EMPLOYEE&limit=1000&offset=0${statusParam}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
        const employeesList = data.data?.users || data.users || [];
        setEmployees(employeesList);
        setFilteredEmployees(employeesList);
      } else {
        setError(data.message || 'Failed to fetch employees');
        // Sample data for demo
        setEmployees(sampleEmployees);
        setFilteredEmployees(sampleEmployees);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setEmployees(sampleEmployees);
      setFilteredEmployees(sampleEmployees);
    } finally {
      setLoading(false);
    }
  };

  // Sample data for demo/fallback
  const sampleEmployees: Employee[] = [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@company.com',
      phone: '+27 12 345 6789',
      role: 'EMPLOYEE',
      status: 'active',
      emailVerified: true,
      createdAt: new Date('2024-01-15').toISOString(),
      lastLogin: new Date('2024-12-10').toISOString(),
      approvedAt: new Date('2024-01-16').toISOString(),
    },
    {
      id: '2',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@company.com',
      phone: '+27 83 456 7890',
      role: 'EMPLOYEE',
      status: 'active',
      emailVerified: true,
      createdAt: new Date('2024-02-20').toISOString(),
      lastLogin: new Date('2024-12-09').toISOString(),
      approvedAt: new Date('2024-02-21').toISOString(),
    },
    {
      id: '3',
      firstName: 'Mike',
      lastName: 'Williams',
      email: 'mike.williams@company.com',
      phone: '+27 71 234 5678',
      role: 'EMPLOYEE',
      status: 'deactivated',
      emailVerified: true,
      createdAt: new Date('2024-03-10').toISOString(),
      lastLogin: new Date('2024-11-15').toISOString(),
      approvedAt: new Date('2024-03-11').toISOString(),
    },
    {
      id: '4',
      firstName: 'Lisa',
      lastName: 'Brown',
      email: 'lisa.brown@company.com',
      phone: '',
      role: 'EMPLOYEE',
      status: 'pending_approval',
      emailVerified: true,
      createdAt: new Date('2024-12-01').toISOString(),
    },
    {
      id: '5',
      firstName: 'David',
      lastName: 'Wilson',
      email: 'david.wilson@company.com',
      phone: '+27 82 345 6789',
      role: 'EMPLOYEE',
      status: 'pending_email',
      emailVerified: false,
      createdAt: new Date('2024-12-05').toISOString(),
    },
  ];

  useEffect(() => {
    fetchEmployees();
  }, [statusFilter]);

  useEffect(() => {
    const filtered = employees.filter(employee =>
      `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (employee.phone && employee.phone.includes(searchTerm))
    );
    setFilteredEmployees(filtered);
    setPage(0);
  }, [searchTerm, employees]);

  const handleStatusChange = async () => {
    if (!selectedEmployee || !newStatus) return;
    
    setActionInProgress(true);
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch(`${API_BASE}/admin/users/${selectedEmployee.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        await fetchEmployees();
        setStatusModalOpen(false);
        setSelectedEmployee(null);
        setNewStatus('');
      } else {
        setError(data.message || 'Failed to update employee status');
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
        return 'status-badge pending-approval';
      case 'rejected':
        return 'status-badge rejected';
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
        return 'Pending Admin Approval';
      case 'rejected':
        return 'Rejected';
      default:
        return status;
    }
  };

  const getRoleBadgeClass = () => {
    return 'role-badge employee';
  };

  // Stats
  const activeCount = employees.filter(e => e.status === 'active').length;
  const deactivatedCount = employees.filter(e => e.status === 'deactivated').length;
  const pendingApprovalCount = employees.filter(e => e.status === 'pending_approval').length;
  const pendingEmailCount = employees.filter(e => e.status === 'pending_email').length;

  if (loading && employees.length === 0) {
    return (
      <AdminLayout>
        <div className="employees-loading-container">
          <div className="spinner"></div>
          <p>Loading employees...</p>
        </div>
      </AdminLayout>
    );
  }

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedEmployees = filteredEmployees.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredEmployees.length / rowsPerPage);

  return (
    <AdminLayout>
      <div className="employees-container">
        <div className="employees-header">
          <h1>Employees Management</h1>
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
              <option value="pending_approval">Pending Approval</option>
              <option value="pending_email">Pending Email</option>
              <option value="deactivated">Deactivated</option>
              <option value="rejected">Rejected</option>
            </select>
            <button 
              className="refresh-btn" 
              onClick={fetchEmployees} 
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
            <div className="stat-icon">👔</div>
            <div className="stat-info">
              <h3>Total Employees</h3>
              <p className="stat-value">{employees.length}</p>
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
              <h3>Pending Approval</h3>
              <p className="stat-value">{pendingApprovalCount}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📧</div>
            <div className="stat-info">
              <h3>Pending Email</h3>
              <p className="stat-value">{pendingEmailCount}</p>
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
          <table className="employees-table">
            <thead>
              <tr>
                <th>Employee</th>
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
              {paginatedEmployees.length === 0 ? (
                <tr>
                  <td colSpan={8} className="empty-state">
                    <p>No employees found</p>
                  </td>
                </tr>
              ) : (
                paginatedEmployees.map((employee) => (
                  <tr key={employee.id}>
                    <td className="employee-cell">
                      <div className="employee-info">
                        <div className="employee-avatar">
                          {employee.firstName ? employee.firstName.charAt(0).toUpperCase() : 'E'}
                        </div>
                        <div className="employee-details">
                          <div className="employee-name">
                            {employee.firstName} {employee.lastName}
                          </div>
                          <div className="employee-id">{employee.id.substring(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="email-cell">{employee.email}</td>
                    <td className="phone-cell">{employee.phone || '-'}</td>
                    <td className="role-cell">
                      <span className={getRoleBadgeClass()}>
                        EMPLOYEE
                      </span>
                    </td>
                    <td className="status-cell">
                      <span className={getStatusBadgeClass(employee.status)}>
                        {getStatusText(employee.status)}
                      </span>
                      {!employee.emailVerified && employee.status !== 'deactivated' && employee.status !== 'rejected' && (
                        <span className="email-warning">⚠️ Email not verified</span>
                      )}
                    </td>
                    <td className="date-cell">
                      {new Date(employee.createdAt).toLocaleDateString()}
                    </td>
                    <td className="date-cell">
                      {employee.lastLogin ? new Date(employee.lastLogin).toLocaleDateString() : '-'}
                    </td>
                    <td className="actions-cell">
                      <div className="action-buttons">
                        <button 
                          className="action-btn view-btn" 
                          onClick={() => {
                            setSelectedEmployee(employee);
                            setViewModalOpen(true);
                          }}
                          title="View Details"
                        >
                          <VisibilityIcon />
                        </button>
                        {employee.status === 'active' ? (
                          <button 
                            className="action-btn deactivate-btn" 
                            onClick={() => {
                              setSelectedEmployee(employee);
                              setNewStatus('deactivated');
                              setStatusModalOpen(true);
                            }}
                            title="Deactivate Employee"
                          >
                            <BlockIcon />
                          </button>
                        ) : employee.status === 'deactivated' ? (
                          <button 
                            className="action-btn activate-btn" 
                            onClick={() => {
                              setSelectedEmployee(employee);
                              setNewStatus('active');
                              setStatusModalOpen(true);
                            }}
                            title="Activate Employee"
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

        {filteredEmployees.length > 0 && (
          <div className="pagination">
            <div className="pagination-info">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredEmployees.length)} of {filteredEmployees.length} employees
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
        {viewModalOpen && selectedEmployee && (
          <div className="modal-overlay" onClick={() => setViewModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Employee Details</h2>
                <button className="modal-close" onClick={() => setViewModalOpen(false)}>
                  <CloseIcon />
                </button>
              </div>
              <div className="modal-body">
                <div className="employee-profile">
                  <div className="profile-avatar">
                    {selectedEmployee.firstName ? selectedEmployee.firstName.charAt(0).toUpperCase() : 'E'}
                  </div>
                  <div className="profile-name">
                    <h3>{selectedEmployee.firstName} {selectedEmployee.lastName}</h3>
                    <span className={getRoleBadgeClass()}>EMPLOYEE</span>
                  </div>
                </div>

                <div className="details-grid">
                  <div className="detail-item">
                    <label>Email:</label>
                    <span>{selectedEmployee.email}</span>
                  </div>
                  <div className="detail-item">
                    <label>Phone:</label>
                    <span>{selectedEmployee.phone || 'Not provided'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Status:</label>
                    <span className={getStatusBadgeClass(selectedEmployee.status)}>
                      {getStatusText(selectedEmployee.status)}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Email Verified:</label>
                    <span>{selectedEmployee.emailVerified ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Joined:</label>
                    <span>{new Date(selectedEmployee.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="detail-item">
                    <label>Last Login:</label>
                    <span>{selectedEmployee.lastLogin ? new Date(selectedEmployee.lastLogin).toLocaleString() : 'Never'}</span>
                  </div>
                  {selectedEmployee.approvedAt && (
                    <>
                      <div className="detail-item">
                        <label>Approved At:</label>
                        <span>{new Date(selectedEmployee.approvedAt).toLocaleString()}</span>
                      </div>
                      <div className="detail-item">
                        <label>Approved By:</label>
                        <span>{selectedEmployee.approvedBy || 'Admin'}</span>
                      </div>
                    </>
                  )}
                  <div className="detail-item full-width">
                    <label>Employee ID:</label>
                    <span className="employee-id-text">{selectedEmployee.id}</span>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                {selectedEmployee.status === 'active' ? (
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
                ) : selectedEmployee.status === 'deactivated' ? (
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
          title={newStatus === 'active' ? 'Activate Employee' : 'Deactivate Employee'}
          message={
            newStatus === 'active'
              ? `Are you sure you want to activate ${selectedEmployee?.firstName} ${selectedEmployee?.lastName}?`
              : `Are you sure you want to deactivate ${selectedEmployee?.firstName} ${selectedEmployee?.lastName}?`
          }
          onConfirm={handleStatusChange}
          onCancel={() => {
            setStatusModalOpen(false);
            setSelectedEmployee(null);
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

export default Employees;