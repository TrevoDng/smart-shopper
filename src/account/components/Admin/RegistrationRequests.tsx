// src/account/components/Admin/RegistrationRequests.tsx
import React, { useState, useEffect } from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AdminLayout from '../layout/AdminLayout';
import ConfirmModal from '../common/ConfirmModal';
import './RegistrationRequests.css';

interface RegistrationRequest {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  createdAt: string;
  status: string;
  emailVerified: boolean;
}

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

const RegistrationRequests: React.FC = () => {
  const [requests, setRequests] = useState<RegistrationRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<RegistrationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<RegistrationRequest | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');
  const [rejectionReason, setRejectionReason] = useState('');

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch(`${API_BASE}/admin/pending-employees`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
        const requestsList = data.data || [];
        setRequests(requestsList);
        setFilteredRequests(requestsList);
      } else {
        setError(data.message || 'Failed to fetch registration requests');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    const filtered = requests.filter(request =>
      `${request.firstName} ${request.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRequests(filtered);
  }, [searchTerm, requests]);

  const handleApprove = (request: RegistrationRequest) => {
    setSelectedRequest(request);
    setActionType('approve');
    setShowConfirmModal(true);
  };

  const handleReject = (request: RegistrationRequest) => {
    setSelectedRequest(request);
    setActionType('reject');
    setShowConfirmModal(true);
  };

  const confirmAction = async () => {
    if (!selectedRequest) return;

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch(`${API_BASE}/admin/approve-employee`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          userId: selectedRequest.id, 
          approve: actionType === 'approve',
          reason: actionType === 'reject' ? rejectionReason : undefined
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        await fetchRequests();
        setShowConfirmModal(false);
        setSelectedRequest(null);
        setRejectionReason('');
      } else {
        setError(data.message || `Failed to ${actionType} request`);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    }
  };

  const getStatusBadge = (request: RegistrationRequest) => {
    if (!request.emailVerified) {
      return <span className="request-status status-pending-email">Pending Email Verification</span>;
    }
    if (request.status === 'pending_approval') {
      return <span className="request-status status-pending-approval">Pending Approval</span>;
    }
    return <span className="request-status status-other">{request.status}</span>;
  };

  const canApprove = (request: RegistrationRequest) => {
    return request.emailVerified === true;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="requests-loading-container">
          <div className="spinner"></div>
          <p>Loading registration requests...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="registration-requests-container">
        <div className="requests-header">
          <h1>Registration Requests</h1>
          <div className="header-actions">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <button 
              className="refresh-btn" 
              onClick={fetchRequests} 
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

        <div className="table-container">
          <table className="requests-table">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Registration Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="empty-state">
                    <p>No pending registration requests</p>
                    <small>All employees have been reviewed</small>
                  </td>
                </tr>
              ) : (
                filteredRequests.map((request) => (
                  <tr key={request.id}>
                    <td className="name-cell">
                      <strong>{request.firstName} {request.lastName}</strong>
                    </td>
                    <td className="email-cell">{request.email}</td>
                    <td className="phone-cell">{request.phone || '-'}</td>
                    <td className="date-cell">{new Date(request.createdAt).toLocaleDateString()}</td>
                    <td className="status-cell">{getStatusBadge(request)}</td>
                    <td className="actions-cell">
                      <div className="action-buttons">
                        <button 
                          className={`action-btn approve-btn ${!canApprove(request) ? 'disabled' : ''}`}
                          onClick={() => handleApprove(request)}
                          disabled={!canApprove(request)}
                          title={!canApprove(request) ? 'Waiting for email verification' : 'Approve employee'}
                        >
                          <CheckCircleIcon />
                          <span>Approve</span>
                        </button>
                        <button 
                          className="action-btn reject-btn"
                          onClick={() => handleReject(request)}
                          title="Reject employee"
                        >
                          <CancelIcon />
                          <span>Reject</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <ConfirmModal
          isOpen={showConfirmModal}
          title={actionType === 'approve' ? 'Approve Employee' : 'Reject Employee'}
          message={
            actionType === 'approve'
              ? `Are you sure you want to approve ${selectedRequest?.firstName} ${selectedRequest?.lastName} as an employee?`
              : `Are you sure you want to reject ${selectedRequest?.firstName} ${selectedRequest?.lastName}'s registration?`
          }
          onConfirm={confirmAction}
          onCancel={() => {
            setShowConfirmModal(false);
            setSelectedRequest(null);
            setRejectionReason('');
          }}
          confirmText={actionType === 'approve' ? 'Approve' : 'Reject'}
          cancelText="Cancel"
          confirmVariant={actionType === 'approve' ? 'primary' : 'danger'}
        >
          {actionType === 'reject' && (
            <div className="rejection-reason">
              <label>Reason for rejection (optional):</label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter reason for rejection..."
                rows={3}
              />
            </div>
          )}
        </ConfirmModal>
      </div>
    </AdminLayout>
  );
};

export default RegistrationRequests;