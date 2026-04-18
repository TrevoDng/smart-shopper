// src/components/employee/EmployeeEnquiries.tsx
import React, { useState, useEffect } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RefreshIcon from '@mui/icons-material/Refresh';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import CloseIcon from '@mui/icons-material/Close';
import { enquiriesApi, Enquiry } from '../../../services/enquiriesApi';
import { useAuth } from '../../context/AuthContext';
import './EmployeeEnquiries.css';
import EmployeeLayout from '../layout/EmployeeLayout';

const EmployeeEnquiries: React.FC = () => {
  const { user } = useAuth();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false);
  const [resolveNote, setResolveNote] = useState('');
  const [resolving, setResolving] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newEnquiry, setNewEnquiry] = useState({
    subject: '',
    message: '',
  });
  const [creating, setCreating] = useState(false);

  const fetchEnquiries = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await enquiriesApi.getEnquiries();
      if (response && response.enquiries) {
        setEnquiries(response.enquiries);
      } else {
        setEnquiries([]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch enquiries');
      setEnquiries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const clientEnquiries = enquiries.filter(
    (enquiry) => enquiry.createdByRole === 'CLIENT'
  );
  
  const employeeEnquiries = enquiries.filter(
    (enquiry) => enquiry.createdByRole === 'EMPLOYEE' && enquiry.createdById === user?.id
  );

  const handleViewDetails = (enquiry: Enquiry) => {
    setSelectedEnquiry(enquiry);
    setDialogOpen(true);
  };

  const handleResolve = async () => {
    if (!selectedEnquiry) return;
    
    setResolving(true);
    try {
      await enquiriesApi.resolveEnquiry(selectedEnquiry.id, resolveNote);
      await fetchEnquiries();
      setResolveDialogOpen(false);
      setResolveNote('');
      setSelectedEnquiry(null);
    } catch (err: any) {
      setError(err.message || 'Failed to resolve enquiry');
    } finally {
      setResolving(false);
    }
  };

  const handleCreateEnquiry = async () => {
    if (!newEnquiry.subject || !newEnquiry.message) {
      setError('Please fill in all fields');
      return;
    }

    setCreating(true);
    try {
      await enquiriesApi.createEnquiry(newEnquiry.subject, newEnquiry.message);
      await fetchEnquiries();
      setCreateDialogOpen(false);
      setNewEnquiry({ subject: '', message: '' });
    } catch (err: any) {
      setError(err.message || 'Failed to create enquiry');
    } finally {
      setCreating(false);
    }
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

  if (loading) {
    return (
      <EmployeeLayout>
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading enquiries...</p>
      </div>
      </EmployeeLayout>
    );
  }

  return (
    <EmployeeLayout>
    <div className="enquiries-container">
      {/* Header */}
      <div className="enquiries-header">
        <h1>Enquiries</h1>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => setCreateDialogOpen(true)}>
            <PersonIcon className="btn-icon" />
            New Enquiry
          </button>
          <button className="btn-icon-only" onClick={fetchEnquiries} disabled={loading}>
            <RefreshIcon />
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="close-btn">
            <CloseIcon />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="tabs-container">
        <div className="tabs-header">
          <button 
            className={`tab-btn ${activeTab === 0 ? 'active' : ''}`}
            onClick={() => setActiveTab(0)}
          >
            <BusinessIcon className="tab-icon" />
            Client Enquiries ({clientEnquiries.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 1 ? 'active' : ''}`}
            onClick={() => setActiveTab(1)}
          >
            <PersonIcon className="tab-icon" />
            My Enquiries ({employeeEnquiries.length})
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 0 && (
            <EnquiriesTable
              enquiries={clientEnquiries}
              onViewDetails={handleViewDetails}
              onResolve={(enquiry) => {
                setSelectedEnquiry(enquiry);
                setResolveDialogOpen(true);
              }}
            />
          )}
          {activeTab === 1 && (
            <EnquiriesTable
              enquiries={employeeEnquiries}
              onViewDetails={handleViewDetails}
              onResolve={(enquiry) => {
                setSelectedEnquiry(enquiry);
                setResolveDialogOpen(true);
              }}
            />
          )}
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
                  <p>
                    {selectedEnquiry.createdByRole === 'CLIENT' ? 'Client: ' : 'Employee: '}
                    {selectedEnquiry.createdByName}
                  </p>
                </div>
                <div className="detail-item">
                  <label>Email</label>
                  <p>{selectedEnquiry.createdByEmail}</p>
                </div>
                <div className="detail-item">
                  <label>Subject</label>
                  <p>{selectedEnquiry.subject}</p>
                </div>
                <div className="detail-item">
                  <label>Date</label>
                  <p>{new Date(selectedEnquiry.createdAt).toLocaleString()}</p>
                </div>
                <div className="detail-item full-width">
                  <label>Message</label>
                  <div className="message-box">{selectedEnquiry.message}</div>
                </div>
                {selectedEnquiry.resolvedAt && (
                  <div className="detail-item full-width">
                    <label>Resolved At</label>
                    <p>{new Date(selectedEnquiry.resolvedAt).toLocaleString()}</p>
                  </div>
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
              <p className="resolve-message">Are you sure you want to mark this enquiry as resolved?</p>
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

      {/* Create Enquiry Modal */}
      {createDialogOpen && (
        <div className="modal-overlay" onClick={() => setCreateDialogOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Enquiry</h2>
              <button className="modal-close" onClick={() => setCreateDialogOpen(false)}>
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                className="input-field"
                placeholder="Subject"
                value={newEnquiry.subject}
                onChange={(e) => setNewEnquiry({ ...newEnquiry, subject: e.target.value })}
              />
              <textarea
                className="textarea-field"
                placeholder="Message"
                rows={4}
                value={newEnquiry.message}
                onChange={(e) => setNewEnquiry({ ...newEnquiry, message: e.target.value })}
              />
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setCreateDialogOpen(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleCreateEnquiry} disabled={creating}>
                {creating ? 'Submitting...' : 'Submit Enquiry'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </EmployeeLayout>
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
      <table className="data-table">
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
                    <div className="user-role">
                      {enquiry.createdByRole === 'CLIENT' ? 'Client' : 'Employee'}
                    </div>
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
                    aria-label={`View details for enquiry: ${enquiry.subject}`}
                  >
                    <VisibilityIcon />
                  </button>
                  {enquiry.status !== 'resolved' && (
                    <button 
                      className="action-btn resolve-btn" 
                      onClick={() => onResolve(enquiry)} 
                      title="Mark as Resolved"
                      aria-label={`Mark enquiry ${enquiry.subject} as resolved`}
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

export default EmployeeEnquiries;