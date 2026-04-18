// src/components/employee/EmployeeSuggestions.tsx
import React, { useState, useEffect } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ForwardIcon from '@mui/icons-material/Forward';
import RefreshIcon from '@mui/icons-material/Refresh';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import { suggestionsApi, Suggestion } from '../../../services/suggestionsApi';
import { useAuth } from '../../context/AuthContext';
import './EmployeeSuggestions.css';
import EmployeeLayout from '../layout/EmployeeLayout';

const EmployeeSuggestions: React.FC = () => {
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [forwardDialogOpen, setForwardDialogOpen] = useState(false);
  const [forwardNote, setForwardNote] = useState('');
  const [forwarding, setForwarding] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newSuggestion, setNewSuggestion] = useState({
    title: '',
    content: '',
  });
  const [creating, setCreating] = useState(false);

  const fetchSuggestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await suggestionsApi.getSuggestions();
      if (response && response.suggestions) {
        setSuggestions(response.suggestions);
      } else {
        setSuggestions([]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch suggestions');
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  // Filter suggestions based on tab and user role
  const clientSuggestions = suggestions.filter(
    (suggestion) => suggestion.createdByRole === 'CLIENT'
  );
  
  const employeeSuggestions = suggestions.filter(
    (suggestion) => suggestion.createdByRole === 'EMPLOYEE' && suggestion.createdById === user?.id
  );

  const handleViewDetails = (suggestion: Suggestion) => {
    setSelectedSuggestion(suggestion);
    setDialogOpen(true);
  };

  const handleForward = async () => {
    if (!selectedSuggestion) return;
    
    setForwarding(true);
    try {
      await suggestionsApi.forwardSuggestion(selectedSuggestion.id, forwardNote);
      await fetchSuggestions();
      setForwardDialogOpen(false);
      setForwardNote('');
      setSelectedSuggestion(null);
    } catch (err: any) {
      setError(err.message || 'Failed to forward suggestion');
    } finally {
      setForwarding(false);
    }
  };

  const handleCreateSuggestion = async () => {
    if (!newSuggestion.title || !newSuggestion.content) {
      setError('Please fill in all fields');
      return;
    }

    setCreating(true);
    try {
      await suggestionsApi.createSuggestion(newSuggestion.title, newSuggestion.content);
      await fetchSuggestions();
      setCreateDialogOpen(false);
      setNewSuggestion({ title: '', content: '' });
    } catch (err: any) {
      setError(err.message || 'Failed to create suggestion');
    } finally {
      setCreating(false);
    }
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
        return 'Forwarded to Admin';
      case 'under_review':
        return 'Under Review';
      case 'pending':
        return 'Pending';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <EmployeeLayout>
      <div className="suggestions-loading-container">
        <div className="spinner"></div>
        <p>Loading suggestions...</p>
      </div>
      </EmployeeLayout>
    );
  }

  return (
    <EmployeeLayout>
    <div className="suggestions-container">
      {/* Header */}
      <div className="suggestions-header">
        <h1>Suggestions</h1>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => setCreateDialogOpen(true)}>
            <ThumbUpIcon className="btn-icon" />
            New Suggestion
          </button>
          <button className="btn-icon-only" onClick={fetchSuggestions} disabled={loading}>
            <RefreshIcon />
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="close-btn">×</button>
        </div>
      )}

      {/* Tabs */}
      <div className="suggestions-tabs-container">
        <div className="tabs-header">
          <button 
            className={`tab-btn ${tabValue === 0 ? 'active' : ''}`}
            onClick={() => setTabValue(0)}
          >
            <BusinessIcon className="tab-icon" />
            Client Suggestions ({clientSuggestions.length})
          </button>
          <button 
            className={`tab-btn ${tabValue === 1 ? 'active' : ''}`}
            onClick={() => setTabValue(1)}
          >
            <PersonIcon className="tab-icon" />
            My Suggestions ({employeeSuggestions.length})
          </button>
        </div>

        <div className="tab-content">
          {tabValue === 0 && (
            <SuggestionsTable
              suggestions={clientSuggestions}
              onViewDetails={handleViewDetails}
              onForward={(suggestion) => {
                setSelectedSuggestion(suggestion);
                setForwardDialogOpen(true);
              }}
            />
          )}
          {tabValue === 1 && (
            <SuggestionsTable
              suggestions={employeeSuggestions}
              onViewDetails={handleViewDetails}
              onForward={(suggestion) => {
                setSelectedSuggestion(suggestion);
                setForwardDialogOpen(true);
              }}
            />
          )}
        </div>
      </div>

      {/* View Details Modal */}
      {dialogOpen && selectedSuggestion && (
        <div className="modal-overlay" onClick={() => setDialogOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Suggestion Details</h2>
              <button className="modal-close" onClick={() => setDialogOpen(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="details-grid">
                <div className="detail-item">
                  <label>From</label>
                  <p>{selectedSuggestion.createdByRole === 'CLIENT' ? 'Client: ' : 'Employee: '}{selectedSuggestion.createdByName}</p>
                </div>
                <div className="detail-item">
                  <label>Email</label>
                  <p>{selectedSuggestion.createdByEmail}</p>
                </div>
                <div className="detail-item">
                  <label>Title</label>
                  <p>{selectedSuggestion.title}</p>
                </div>
                <div className="detail-item">
                  <label>Date</label>
                  <p>{new Date(selectedSuggestion.createdAt).toLocaleString()}</p>
                </div>
                <div className="detail-item full-width">
                  <label>Suggestion</label>
                  <div className="message-box">{selectedSuggestion.content}</div>
                </div>
                {selectedSuggestion.forwardedAt && (
                  <div className="detail-item full-width">
                    <label>Forwarded At</label>
                    <p>{new Date(selectedSuggestion.forwardedAt).toLocaleString()}</p>
                  </div>
                )}
                {selectedSuggestion.forwardedNote && (
                  <div className="detail-item full-width">
                    <label>Forwarding Note</label>
                    <div className="message-box">{selectedSuggestion.forwardedNote}</div>
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

      {/* Forward Modal */}
      {forwardDialogOpen && selectedSuggestion && (
        <div className="modal-overlay" onClick={() => setForwardDialogOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Forward to Administration</h2>
              <button className="modal-close" onClick={() => setForwardDialogOpen(false)}>×</button>
            </div>
            <div className="modal-body">
              <p className="forward-message">Forward this suggestion to the administration for review.</p>
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

      {/* Create Suggestion Modal */}
      {createDialogOpen && (
        <div className="modal-overlay" onClick={() => setCreateDialogOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Submit a Suggestion</h2>
              <button className="modal-close" onClick={() => setCreateDialogOpen(false)}>×</button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                className="input-field"
                placeholder="Title"
                value={newSuggestion.title}
                onChange={(e) => setNewSuggestion({ ...newSuggestion, title: e.target.value })}
                style={{ marginBottom: '16px' }}
              />
              <textarea
                className="textarea-field"
                placeholder="Your Suggestion"
                rows={4}
                value={newSuggestion.content}
                onChange={(e) => setNewSuggestion({ ...newSuggestion, content: e.target.value })}
              />
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setCreateDialogOpen(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleCreateSuggestion} disabled={creating}>
                {creating ? 'Submitting...' : 'Submit Suggestion'}
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
        return 'Forwarded to Admin';
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
      <table className="data-table">
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
              <td>
                <div className="user-info">
                  <div className="user-avatar">
                    {suggestion.createdByRole === 'CLIENT' ? 'C' : 'E'}
                  </div>
                  <div>
                    <div className="user-name">{suggestion.createdByName}</div>
                    <div className="user-role">{suggestion.createdByRole === 'CLIENT' ? 'Client' : 'Employee'}</div>
                  </div>
                </div>
              </td>
              <td>{suggestion.title}</td>
              <td>{new Date(suggestion.createdAt).toLocaleDateString()}</td>
              <td>
                <span className={getStatusClass(suggestion.status)}>
                  {getStatusText(suggestion.status)}
                </span>
              </td>
              <td>
                <div className="action-buttons">
                  <button 
                    className="action-btn" 
                    onClick={() => onViewDetails(suggestion)} 
                    title="View Details"
                  >
                    <VisibilityIcon />
                  </button>
                  {suggestion.status !== 'forwarded' && (
                    <button 
                      className="action-btn forward" 
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

export default EmployeeSuggestions;