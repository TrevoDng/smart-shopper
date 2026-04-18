// src/account/components/Admin/Enquiries.tsx
import React, { useState, useEffect } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RefreshIcon from '@mui/icons-material/Refresh';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import CloseIcon from '@mui/icons-material/Close';
import AdminLayout from '../layout/AdminLayout';
import './Enquiries.css';

interface Enquiry {
  id: string;
  subject: string;
  message: string;
  status: 'pending' | 'in_progress' | 'resolved';
  createdById: string;
  createdByName: string;
  createdByEmail: string;
  createdByRole: 'ADMIN' | 'EMPLOYEE' | 'CLIENT';
  resolvedAt?: string;
  resolvedBy?: string;
  resolutionNote?: string;
  createdAt: string;
  updatedAt: string;
}

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

const Enquiries: React.FC = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false);
  const [resolveNote, setResolveNote] = useState('');
  const [resolving, setResolving] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchEnquiries = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch(`${API_BASE}/enquiries`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (response.ok) {
        const enquiriesList = data.data?.enquiries || data.enquiries || [];
        setEnquiries(enquiriesList);
      } else {
        setError(data.message || 'Failed to fetch enquiries');
        // Sample data for demo
        setEnquiries(sampleEnquiries);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setEnquiries(sampleEnquiries);
    } finally {
      setLoading(false);
    }
  };

  const sampleEnquiries: Enquiry[] = [
    {
      id: '1',
      subject: 'Product Inquiry',
      message: 'I would like to know more about the gaming laptop specifications.',
      status: 'pending',
      createdById: 'client1',
      createdByName: 'John Client',
      createdByEmail: 'client@example.com',
      createdByRole: 'CLIENT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      subject: 'Order Status',
      message: 'When will my order be delivered?',
      status: 'in_progress',
      createdById: 'client2',
      createdByName: 'Sarah Client',
      createdByEmail: 'sarah@example.com',
      createdByRole: 'CLIENT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '3',
      subject: 'Return Request',
      message: 'I want to return a defective product.',
      status: 'resolved',
      createdById: 'client3',
      createdByName: 'Mike Client',
      createdByEmail: 'mike@example.com',
      createdByRole: 'CLIENT',
      resolvedAt: new Date().toISOString(),
      resolvedBy: 'Admin User',
      resolutionNote: 'Return approved. Customer will receive refund.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleResolve = async () => {
    if (!selectedEnquiry) return;
    
    setResolving(true);
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch(`${API_BASE}/enquiries/${selectedEnquiry.id}/resolve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ note: resolveNote })
      });
      
      if (response.ok) {
        await fetchEnquiries();
        setResolveDialogOpen(false);
        setResolveNote('');
        setSelectedEnquiry(null);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to resolve enquiry');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setResolving(false);
    }
  };

  const getFilteredEnquiries = () => {
    let filtered = enquiries;
    
    if (activeTab === 0) {
      filtered = filtered.filter(e => e.createdByRole === 'CLIENT');
    } else if (activeTab === 1) {
      filtered = filtered.filter(e => e.createdByRole === 'EMPLOYEE');
    }
    
    if (searchTerm) {
      filtered = filtered.filter(e =>
        e.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.createdByName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  const getStatusClass = (status: string): string => {
    switch (status) {
      case 'resolved':
        return 'status-badge status-resolved';
      case 'in_progress':
        return 'status-badge status-in-progress';
      case 'pending':
        return 'status-badge status-pending';
      default:
        return 'status-badge';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'resolved':
        return 'Resolved';
      case 'in_progress':
        return 'In Progress';
      case 'pending':
        return 'Pending';
      default:
        return status;
    }
  };

  const filteredEnquiries = getFilteredEnquiries();

  if (loading && enquiries.length === 0) {
    return (
      <AdminLayout>
        <div className="admin-enquiries-loading">
          <div className="spinner"></div>
          <p>Loading enquiries...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-enquiries-container">
        <div className="enquiries-header">
          <h1>Enquiries Management</h1>
          <div className="header-actions">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search enquiries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <button className="refresh-btn" onClick={fetchEnquiries} disabled={loading}>
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

        <div className="tabs-container">
          <div className="tabs-header">
            <button 
              className={`tab-btn ${activeTab === 0 ? 'active' : ''}`}
              onClick={() => setActiveTab(0)}
            >
              <BusinessIcon className="tab-icon" />
              Client Enquiries ({enquiries.filter(e => e.createdByRole === 'CLIENT').length})
            </button>
            <button 
              className={`tab-btn ${activeTab === 1 ? 'active' : ''}`}
              onClick={() => setActiveTab(1)}
            >
              <PersonIcon className="tab-icon" />
              Employee Enquiries ({enquiries.filter(e => e.createdByRole === 'EMPLOYEE').length})
            </button>
          </div>

          <div className="tab-content">
            <EnquiriesTable
              enquiries={filteredEnquiries}
              onViewDetails={(enquiry) => {
                setSelectedEnquiry(enquiry);
                setDialogOpen(true);
              }}
              onResolve={(enquiry) => {
                setSelectedEnquiry(enquiry);
                setResolveDialogOpen(true);
              }}
            />
          </div>
        </div>

        {/* View Details Modal */}
        {dialogOpen && selectedEnquiry && (
          <div className="modal-overlay" onClick={() => setDialogOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Enquiry Details</h2>
                <button className="modal-close" onClick={() => setDialogOpen(false)}>
                  <CloseIcon />
                </button>
              </div>
              <div className="modal-body">
                <div className="details-grid">
                  <div className="detail-item">
                    <label>From</label>
                    <p>{selectedEnquiry.createdByName}</p>
                  </div>
                  <div className="detail-item">
                    <label>Role</label>
                    <p>{selectedEnquiry.createdByRole}</p>
                  </div>
                  <div className="detail-item">
                    <label>Email</label>
                    <p>{selectedEnquiry.createdByEmail}</p>
                  </div>
                  <div className="detail-item">
                    <label>Date</label>
                    <p>{new Date(selectedEnquiry.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="detail-item">
                    <label>Status</label>
                    <p className={getStatusClass(selectedEnquiry.status)}>
                      {getStatusText(selectedEnquiry.status)}
                    </p>
                  </div>
                  <div className="detail-item full-width">
                    <label>Subject</label>
                    <p className="subject-text">{selectedEnquiry.subject}</p>
                  </div>
                  <div className="detail-item full-width">
                    <label>Message</label>
                    <div className="message-box">{selectedEnquiry.message}</div>
                  </div>
                  {selectedEnquiry.resolvedAt && (
                    <>
                      <div className="detail-item">
                        <label>Resolved At</label>
                        <p>{new Date(selectedEnquiry.resolvedAt).toLocaleString()}</p>
                      </div>
                      <div className="detail-item full-width">
                        <label>Resolution Note</label>
                        <div className="message-box">{selectedEnquiry.resolutionNote || 'No note provided'}</div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn-secondary" onClick={() => setDialogOpen(false)}>Close</button>
              </div>
            </div>
          </div>
        )}

        {/* Resolve Modal */}
        {resolveDialogOpen && selectedEnquiry && (
          <div className="modal-overlay" onClick={() => setResolveDialogOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Resolve Enquiry</h2>
                <button className="modal-close" onClick={() => setResolveDialogOpen(false)}>
                  <CloseIcon />
                </button>
              </div>
              <div className="modal-body">
                <p className="resolve-message">
                  Mark enquiry "<strong>{selectedEnquiry.subject}</strong>" as resolved?
                </p>
                <textarea
                  className="textarea-field"
                  placeholder="Resolution Notes (Optional)"
                  rows={3}
                  value={resolveNote}
                  onChange={(e) => setResolveNote(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button className="btn-secondary" onClick={() => setResolveDialogOpen(false)}>Cancel</button>
                <button className="btn-primary" onClick={handleResolve} disabled={resolving}>
                  {resolving ? 'Resolving...' : 'Confirm Resolve'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

// Table Component
const EnquiriesTable: React.FC<{
  enquiries: Enquiry[];
  onViewDetails: (enquiry: Enquiry) => void;
  onResolve: (enquiry: Enquiry) => void;
}> = ({ enquiries, onViewDetails, onResolve }) => {
  const getStatusClass = (status: string): string => {
    switch (status) {
      case 'resolved':
        return 'status-badge status-resolved';
      case 'in_progress':
        return 'status-badge status-in-progress';
      case 'pending':
        return 'status-badge status-pending';
      default:
        return 'status-badge';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'resolved':
        return 'Resolved';
      case 'in_progress':
        return 'In Progress';
      case 'pending':
        return 'Pending';
      default:
        return status;
    }
  };

  if (enquiries.length === 0) {
    return (
      <div className="empty-state">
        <p>No enquiries found</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="enquiries-table">
        <thead>
          <tr>
            <th>From</th>
            <th>Subject</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {enquiries.map((enquiry) => (
            <tr key={enquiry.id}>
              <td className="user-cell">
                <div className="user-info">
                  <div className="user-avatar">
                    {enquiry.createdByRole === 'CLIENT' ? 'C' : 'E'}
                  </div>
                  <div className="user-details">
                    <div className="user-name">{enquiry.createdByName}</div>
                    <div className="user-role">{enquiry.createdByRole}</div>
                  </div>
                </div>
               </td>
              <td className="subject-cell">{enquiry.subject}</td>
              <td className="date-cell">{new Date(enquiry.createdAt).toLocaleDateString()}</td>
              <td className="status-cell">
                <span className={getStatusClass(enquiry.status)}>
                  {getStatusText(enquiry.status)}
                </span>
              </td>
              <td className="actions-cell">
                <div className="action-buttons">
                  <button 
                    className="action-btn view-btn" 
                    onClick={() => onViewDetails(enquiry)} 
                    title="View Details"
                  >
                    <VisibilityIcon />
                  </button>
                  {enquiry.status !== 'resolved' && (
                    <button 
                      className="action-btn resolve-btn" 
                      onClick={() => onResolve(enquiry)} 
                      title="Mark as Resolved"
                    >
                      <CheckCircleIcon />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Enquiries;