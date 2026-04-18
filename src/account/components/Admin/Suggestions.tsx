// src/account/components/Admin/Suggestions.tsx
import React, { useState, useEffect } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ForwardIcon from '@mui/icons-material/Forward';
import RefreshIcon from '@mui/icons-material/Refresh';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import CloseIcon from '@mui/icons-material/Close';
import AdminLayout from '../layout/AdminLayout';
import './Suggestions.css';

interface Suggestion {
  id: string;
  title: string;
  content: string;
  status: 'pending' | 'under_review' | 'forwarded';
  createdById: string;
  createdByName: string;
  createdByEmail: string;
  createdByRole: 'ADMIN' | 'EMPLOYEE' | 'CLIENT';
  forwardedAt?: string;
  forwardedBy?: string;
  forwardedNote?: string;
  createdAt: string;
  updatedAt: string;
}

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

const Suggestions: React.FC = () => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [forwardDialogOpen, setForwardDialogOpen] = useState(false);
  const [forwardNote, setForwardNote] = useState('');
  const [forwarding, setForwarding] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchSuggestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch(`${API_BASE}/suggestions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (response.ok) {
        const suggestionsList = data.data?.suggestions || data.suggestions || [];
        setSuggestions(suggestionsList);
      } else {
        setError(data.message || 'Failed to fetch suggestions');
        setSuggestions(sampleSuggestions);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setSuggestions(sampleSuggestions);
    } finally {
      setLoading(false);
    }
  };

  const sampleSuggestions: Suggestion[] = [
    {
      id: '1',
      title: 'Improve Search Feature',
      content: 'Add filters for price range and brands to make searching easier.',
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
      title: 'Mobile App Development',
      content: 'Consider developing a mobile app for better user experience.',
      status: 'under_review',
      createdById: 'emp1',
      createdByName: 'Jane Employee',
      createdByEmail: 'jane@example.com',
      createdByRole: 'EMPLOYEE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'Loyalty Program',
      content: 'Implement a loyalty program to reward returning customers.',
      status: 'forwarded',
      createdById: 'client2',
      createdByName: 'Sarah Client',
      createdByEmail: 'sarah@example.com',
      createdByRole: 'CLIENT',
      forwardedAt: new Date().toISOString(),
      forwardedBy: 'Admin User',
      forwardedNote: 'Great suggestion! Forwarded to marketing team.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const handleForward = async () => {
    if (!selectedSuggestion) return;
    
    setForwarding(true);
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch(`${API_BASE}/suggestions/${selectedSuggestion.id}/forward`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ note: forwardNote })
      });
      
      if (response.ok) {
        await fetchSuggestions();
        setForwardDialogOpen(false);
        setForwardNote('');
        setSelectedSuggestion(null);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to forward suggestion');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setForwarding(false);
    }
  };

  const getFilteredSuggestions = () => {
    let filtered = suggestions;
    
    if (activeTab === 0) {
      filtered = filtered.filter(s => s.createdByRole === 'CLIENT');
    } else if (activeTab === 1) {
      filtered = filtered.filter(s => s.createdByRole === 'EMPLOYEE');
    }
    
    if (searchTerm) {
      filtered = filtered.filter(s =>
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.createdByName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  const getStatusClass = (status: string): string => {
    switch (status) {
      case 'forwarded':
        return 'status-badge status-forwarded';
      case 'under_review':
        return 'status-badge status-under-review';
      case 'pending':
        return 'status-badge status-pending';
      default:
        return 'status-badge';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'forwarded':
        return 'Forwarded';
      case 'under_review':
        return 'Under Review';
      case 'pending':
        return 'Pending';
      default:
        return status;
    }
  };

  const filteredSuggestions = getFilteredSuggestions();

  if (loading && suggestions.length === 0) {
    return (
      <AdminLayout>
        <div className="admin-suggestions-loading">
          <div className="spinner"></div>
          <p>Loading suggestions...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-suggestions-container">
        <div className="suggestions-header">
          <h1>Suggestions Management</h1>
          <div className="header-actions">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search suggestions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <button className="refresh-btn" onClick={fetchSuggestions} disabled={loading}>
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
              Client Suggestions ({suggestions.filter(s => s.createdByRole === 'CLIENT').length})
            </button>
            <button 
              className={`tab-btn ${activeTab === 1 ? 'active' : ''}`}
              onClick={() => setActiveTab(1)}
            >
              <PersonIcon className="tab-icon" />
              Employee Suggestions ({suggestions.filter(s => s.createdByRole === 'EMPLOYEE').length})
            </button>
          </div>

          <div className="tab-content">
            <SuggestionsTable
              suggestions={filteredSuggestions}
              onViewDetails={(suggestion) => {
                setSelectedSuggestion(suggestion);
                setDialogOpen(true);
              }}
              onForward={(suggestion) => {
                setSelectedSuggestion(suggestion);
                setForwardDialogOpen(true);
              }}
            />
          </div>
        </div>

        {/* View Details Modal */}
        {dialogOpen && selectedSuggestion && (
          <div className="modal-overlay" onClick={() => setDialogOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Suggestion Details</h2>
                <button className="modal-close" onClick={() => setDialogOpen(false)}>
                  <CloseIcon />
                </button>
              </div>
              <div className="modal-body">
                <div className="details-grid">
                  <div className="detail-item">
                    <label>From</label>
                    <p>{selectedSuggestion.createdByName}</p>
                  </div>
                  <div className="detail-item">
                    <label>Role</label>
                    <p>{selectedSuggestion.createdByRole}</p>
                  </div>
                  <div className="detail-item">
                    <label>Email</label>
                    <p>{selectedSuggestion.createdByEmail}</p>
                  </div>
                  <div className="detail-item">
                    <label>Date</label>
                    <p>{new Date(selectedSuggestion.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="detail-item">
                    <label>Status</label>
                    <p className={getStatusClass(selectedSuggestion.status)}>
                      {getStatusText(selectedSuggestion.status)}
                    </p>
                  </div>
                  <div className="detail-item full-width">
                    <label>Title</label>
                    <p className="title-text">{selectedSuggestion.title}</p>
                  </div>
                  <div className="detail-item full-width">
                    <label>Suggestion</label>
                    <div className="message-box">{selectedSuggestion.content}</div>
                  </div>
                  {selectedSuggestion.forwardedAt && (
                    <>
                      <div className="detail-item">
                        <label>Forwarded At</label>
                        <p>{new Date(selectedSuggestion.forwardedAt).toLocaleString()}</p>
                      </div>
                      <div className="detail-item full-width">
                        <label>Forwarding Note</label>
                        <div className="message-box">{selectedSuggestion.forwardedNote || 'No note provided'}</div>
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

        {/* Forward Modal */}
        {forwardDialogOpen && selectedSuggestion && (
          <div className="modal-overlay" onClick={() => setForwardDialogOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Forward Suggestion</h2>
                <button className="modal-close" onClick={() => setForwardDialogOpen(false)}>
                  <CloseIcon />
                </button>
              </div>
              <div className="modal-body">
                <p className="forward-message">
                  Forward suggestion "<strong>{selectedSuggestion.title}</strong>" to administration?
                </p>
                <textarea
                  className="textarea-field"
                  placeholder="Additional Notes (Optional)"
                  rows={3}
                  value={forwardNote}
                  onChange={(e) => setForwardNote(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button className="btn-secondary" onClick={() => setForwardDialogOpen(false)}>Cancel</button>
                <button className="btn-primary" onClick={handleForward} disabled={forwarding}>
                  {forwarding ? 'Forwarding...' : 'Confirm Forward'}
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
const SuggestionsTable: React.FC<{
  suggestions: Suggestion[];
  onViewDetails: (suggestion: Suggestion) => void;
  onForward: (suggestion: Suggestion) => void;
}> = ({ suggestions, onViewDetails, onForward }) => {
  const getStatusClass = (status: string): string => {
    switch (status) {
      case 'forwarded':
        return 'status-badge status-forwarded';
      case 'under_review':
        return 'status-badge status-under-review';
      case 'pending':
        return 'status-badge status-pending';
      default:
        return 'status-badge';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'forwarded':
        return 'Forwarded';
      case 'under_review':
        return 'Under Review';
      case 'pending':
        return 'Pending';
      default:
        return status;
    }
  };

  if (suggestions.length === 0) {
    return (
      <div className="empty-state">
        <p>No suggestions found</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="suggestions-table">
        <thead>
          <tr>
            <th>From</th>
            <th>Title</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {suggestions.map((suggestion) => (
            <tr key={suggestion.id}>
              <td className="user-cell">
                <div className="user-info">
                  <div className="user-avatar">
                    {suggestion.createdByRole === 'CLIENT' ? 'C' : 'E'}
                  </div>
                  <div className="user-details">
                    <div className="user-name">{suggestion.createdByName}</div>
                    <div className="user-role">{suggestion.createdByRole}</div>
                  </div>
                </div>
              </td>
              <td className="title-cell">{suggestion.title}</td>
              <td className="date-cell">{new Date(suggestion.createdAt).toLocaleDateString()}</td>
              <td className="status-cell">
                <span className={getStatusClass(suggestion.status)}>
                  {getStatusText(suggestion.status)}
                </span>
              </td>
              <td className="actions-cell">
                <div className="action-buttons">
                  <button 
                    className="action-btn view-btn" 
                    onClick={() => onViewDetails(suggestion)} 
                    title="View Details"
                  >
                    <VisibilityIcon />
                  </button>
                  {suggestion.status !== 'forwarded' && (
                    <button 
                      className="action-btn forward-btn" 
                      onClick={() => onForward(suggestion)} 
                      title="Forward to Administration"
                    >
                      <ForwardIcon />
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

export default Suggestions;