// src/account/components/Admin/RegistrationInviteCode.tsx
import React, { useState, useEffect, useCallback } from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ScheduleIcon from '@mui/icons-material/Schedule';
import CancelIcon from '@mui/icons-material/Cancel';
import AdminLayout from '../layout/AdminLayout';
import ConfirmModal from '../common/ConfirmModal';
import { useAuth } from '../../context/AuthContext';
import './RegistrationInviteCode.css';

interface InviteCode {
  id: string;
  code: string;
  expiresAt: string;
  isUsed: boolean;
  createdAt: string;
  createdBy?: string;
  assignedEmail: string;
  usedBy?: string;
  usedAt?: string;
  isExpiringSoon?: boolean;
}

interface GenerateCodeRequest {
  email: string;
  expiresInHours?: number;
}

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100];
const DEFAULT_ITEMS_PER_PAGE = 25;

const RegistrationInviteCode: React.FC = () => {
  const { getToken } = useAuth();
  
  // State for invite codes
  const [inviteCodes, setInviteCodes] = useState<InviteCode[]>([]);
  const [filteredCodes, setFilteredCodes] = useState<InviteCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // State for filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'used' | 'expired'>('all');
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);
  
  // State for generate modal
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [newInviteEmail, setNewInviteEmail] = useState('');
  const [expiryHours, setExpiryHours] = useState(168); // 7 days default
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<InviteCode | null>(null);
  
  // State for delete confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [codeToDelete, setCodeToDelete] = useState<InviteCode | null>(null);
  
  // State for copy success indicator
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

  // Fetch invite codes
  const fetchInviteCodes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE}/admin/secret-codes`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
        const codes = data.data?.codes || data.codes || [];
        // Mark expiring soon (within 24 hours)
        const codesWithExpiry = codes.map((code: InviteCode) => ({
          ...code,
          isExpiringSoon: !code.isUsed && new Date(code.expiresAt).getTime() - Date.now() < 24 * 60 * 60 * 1000
        }));
        setInviteCodes(codesWithExpiry);
        setFilteredCodes(codesWithExpiry);
      } else {
        setError(data.message || 'Failed to fetch invite codes');
        // Sample data for demo
        setInviteCodes(sampleInviteCodes);
        setFilteredCodes(sampleInviteCodes);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setInviteCodes(sampleInviteCodes);
      setFilteredCodes(sampleInviteCodes);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  // Sample data for demo/fallback
  const sampleInviteCodes: InviteCode[] = [
    {
      id: '1',
      code: 'EMP-ABC123',
      assignedEmail: 'john.smith@company.com',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      isUsed: false,
      createdAt: new Date().toISOString(),
      createdBy: 'admin@system.com',
      isExpiringSoon: false
    },
    {
      id: '2',
      code: 'EMP-DEF456',
      assignedEmail: 'sarah.johnson@company.com',
      expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      isUsed: false,
      createdAt: new Date().toISOString(),
      createdBy: 'admin@system.com',
      isExpiringSoon: true
    },
    {
      id: '3',
      code: 'EMP-GHI789',
      assignedEmail: 'mike.williams@company.com',
      expiresAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      isUsed: false,
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      createdBy: 'admin@system.com',
      isExpiringSoon: false
    },
    {
      id: '4',
      code: 'EMP-JKL012',
      assignedEmail: 'lisa.brown@company.com',
      expiresAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      isUsed: true,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      usedBy: 'lisa.brown@company.com',
      usedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      createdBy: 'admin@system.com',
      isExpiringSoon: false
    },
    {
      id: '5',
      code: 'EMP-MNO345',
      assignedEmail: 'david.wilson@company.com',
      expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      isUsed: false,
      createdAt: new Date().toISOString(),
      createdBy: 'admin@system.com',
      isExpiringSoon: false
    },
  ];

  useEffect(() => {
    fetchInviteCodes();
  }, [fetchInviteCodes]);

  // Apply filters and search
  useEffect(() => {
    let filtered = [...inviteCodes];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(code => {
        if (statusFilter === 'active') return !code.isUsed && new Date(code.expiresAt) > new Date();
        if (statusFilter === 'used') return code.isUsed;
        if (statusFilter === 'expired') return !code.isUsed && new Date(code.expiresAt) <= new Date();
        return true;
      });
    }
    
    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(code =>
        code.code.toLowerCase().includes(term) ||
        code.assignedEmail.toLowerCase().includes(term) ||
        (code.createdBy && code.createdBy.toLowerCase().includes(term))
      );
    }
    
    setFilteredCodes(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, statusFilter, inviteCodes]);

  // Generate new invite code
  const generateInviteCode = async () => {
    if (!newInviteEmail.trim()) {
      setError('Please enter an email address');
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newInviteEmail)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setError(null);
    setIsGenerating(true);
    
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE}/admin/generate-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          employeeEmail: newInviteEmail,
          expiresInHours: expiryHours
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        const newCode = data.data;
        const codeWithExpiry = {
          ...newCode,
          isExpiringSoon: new Date(newCode.expiresAt).getTime() - Date.now() < 24 * 60 * 60 * 1000
        };
        setGeneratedCode(codeWithExpiry);
        setSuccess(`Invite code generated for ${newInviteEmail}`);
        fetchInviteCodes(); // Refresh the list
      } else {
        setError(data.message || data.error?.message || 'Failed to generate code');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  // Delete invite code
  const deleteInviteCode = async () => {
    if (!codeToDelete) return;
    
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE}/admin/secret-codes/${codeToDelete.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setSuccess('Invite code deleted successfully');
        fetchInviteCodes();
        setShowDeleteModal(false);
        setCodeToDelete(null);
      } else {
        setError(data.message || 'Failed to delete code');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    }
  };

  // Copy code to clipboard
  const copyToClipboard = async (code: string, codeId: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCodeId(codeId);
      setTimeout(() => setCopiedCodeId(null), 2000);
      setSuccess('Code copied to clipboard!');
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      setError('Failed to copy code');
    }
  };

  // Get status badge class and text
  const getCodeStatus = (code: InviteCode) => {
    if (code.isUsed) {
      return { text: 'Used', class: 'status-used', icon: <CheckCircleIcon /> };
    }
    if (new Date(code.expiresAt) < new Date()) {
      return { text: 'Expired', class: 'status-expired', icon: <CancelIcon /> };
    }
    if (code.isExpiringSoon) {
      return { text: 'Expiring Soon', class: 'status-expiring', icon: <ScheduleIcon /> };
    }
    return { text: 'Active', class: 'status-active', icon: null };
  };

  // Pagination calculations
  const totalItems = filteredCodes.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCodes = filteredCodes.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    // Scroll to top of table
    const tableContainer = document.querySelector('.invite-codes-table-container');
    if (tableContainer) {
      tableContainer.scrollTop = 0;
    }
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Stats
  const stats = {
    total: inviteCodes.length,
    active: inviteCodes.filter(c => !c.isUsed && new Date(c.expiresAt) > new Date()).length,
    used: inviteCodes.filter(c => c.isUsed).length,
    expired: inviteCodes.filter(c => !c.isUsed && new Date(c.expiresAt) <= new Date()).length,
    expiringSoon: inviteCodes.filter(c => c.isExpiringSoon && !c.isUsed).length
  };

  // Close modals with Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowGenerateModal(false);
        setGeneratedCode(null);
        setShowDeleteModal(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  // Helper function to generate page numbers for pagination
  const getPageNumbers = (): number[] => {
    const pageNumbers: number[] = [];
    
    if (totalPages <= 5) {
      // Show all pages if total pages are 5 or less
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else if (currentPage <= 3) {
      // Show first 5 pages
      for (let i = 1; i <= 5; i++) {
        pageNumbers.push(i);
      }
    } else if (currentPage >= totalPages - 2) {
      // Show last 5 pages
      for (let i = totalPages - 4; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show pages around current page
      for (let i = currentPage - 2; i <= currentPage + 2; i++) {
        pageNumbers.push(i);
      }
    }
    
    return pageNumbers;
  };

  return (
    <AdminLayout>
      <div className="invite-codes-container">
        {/* Header */}
        <div className="invite-codes-header">
          <div>
            <h1>Registration Invite Codes</h1>
            <p>Generate and manage employee registration invite codes</p>
          </div>
          <button 
            className="generate-btn"
            onClick={() => {
              setShowGenerateModal(true);
              setGeneratedCode(null);
              setNewInviteEmail('');
              setExpiryHours(168);
            }}
          >
            <AddIcon /> Generate New Code
          </button>
        </div>

        {/* Error/Success Messages */}
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
            <div className="stat-icon">🔑</div>
            <div className="stat-info">
              <h3>Total Codes</h3>
              <p className="stat-value">{stats.total}</p>
            </div>
          </div>
          <div className="stat-card active">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>Active</h3>
              <p className="stat-value">{stats.active}</p>
            </div>
          </div>
          <div className="stat-card expiring">
            <div className="stat-icon">⚠️</div>
            <div className="stat-info">
              <h3>Expiring Soon</h3>
              <p className="stat-value">{stats.expiringSoon}</p>
            </div>
          </div>
          <div className="stat-card used">
            <div className="stat-icon">✓</div>
            <div className="stat-info">
              <h3>Used</h3>
              <p className="stat-value">{stats.used}</p>
            </div>
          </div>
          <div className="stat-card expired">
            <div className="stat-icon">✗</div>
            <div className="stat-info">
              <h3>Expired</h3>
              <p className="stat-value">{stats.expired}</p>
            </div>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="filters-bar">
          <div className="search-box">
            <SearchIcon className="search-icon" />
            <input
              type="text"
              placeholder="Search by code, email, or creator..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-group">
            <label>Status:</label>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="status-filter"
            >
              <option value="all">All Codes</option>
              <option value="active">Active</option>
              <option value="used">Used</option>
              <option value="expired">Expired</option>
            </select>
          </div>
          
          <button 
            className="refresh-btn" 
            onClick={fetchInviteCodes} 
            disabled={loading}
            title="Refresh"
          >
            <RefreshIcon />
          </button>
        </div>

        {/* Warning Banner for Expiring Codes */}
        {stats.expiringSoon > 0 && (
          <div className="warning-banner">
            <span>⚠️</span>
            <span>{stats.expiringSoon} code(s) expiring within 24 hours! Consider sending reminders.</span>
          </div>
        )}

        {/* Table Container */}
        <div className="invite-codes-table-container">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading invite codes...</p>
            </div>
          ) : paginatedCodes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔑</div>
              <p>No invite codes found</p>
              <small>Generate your first invite code using the button above</small>
            </div>
          ) : (
            <>
              <table className="invite-codes-table">
                <thead>
                  <tr>
                    <th>Invite Code</th>
                    <th>Assigned To</th>
                    <th>Created By</th>
                    <th>Created At</th>
                    <th>Expires At</th>
                    <th>Status</th>
                    <th>Used Info</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCodes.map((code) => {
                    const status = getCodeStatus(code);
                    return (
                      <tr key={code.id} className={code.isExpiringSoon && !code.isUsed ? 'expiring-row' : ''}>
                        <td className="code-cell">
                          <code className="invite-code">{code.code}</code>
                        </td>
                        <td className="email-cell">{code.assignedEmail}</td>
                        <td className="creator-cell">{code.createdBy || 'Admin'}</td>
                        <td className="date-cell">
                          {new Date(code.createdAt).toLocaleDateString()}
                          <br />
                          <small>{new Date(code.createdAt).toLocaleTimeString()}</small>
                        </td>
                        <td className="date-cell">
                          {new Date(code.expiresAt).toLocaleDateString()}
                          <br />
                          <small>{new Date(code.expiresAt).toLocaleTimeString()}</small>
                        </td>
                        <td className="status-cell">
                          <span className={`status-badge ${status.class}`}>
                            {status.icon}
                            {status.text}
                          </span>
                        </td>
                        <td className="used-info-cell">
                          {code.isUsed ? (
                            <>
                              <div className="used-by">{code.usedBy || 'Employee'}</div>
                              <small>{code.usedAt ? new Date(code.usedAt).toLocaleDateString() : ''}</small>
                            </>
                          ) : (
                            <span className="not-used">—</span>
                          )}
                        </td>
                        <td className="actions-cell">
                          <div className="action-buttons">
                            <button 
                              className="action-btn copy-btn" 
                              onClick={() => copyToClipboard(code.code, code.id)}
                              title="Copy Code"
                            >
                              {copiedCodeId === code.id ? <CheckCircleIcon /> : <ContentCopyIcon />}
                            </button>
                            {!code.isUsed && new Date(code.expiresAt) > new Date() && (
                              <button 
                                className="action-btn delete-btn" 
                                onClick={() => {
                                  setCodeToDelete(code);
                                  setShowDeleteModal(true);
                                }}
                                title="Delete Code"
                              >
                                <DeleteIcon />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </>
          )}
        </div>

        {/* Pagination */}
        {!loading && filteredCodes.length > 0 && (
          <div className="pagination-container">
            <div className="pagination-info">
              Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} codes
            </div>
            
            <div className="pagination-controls">
              <div className="items-per-page">
                <label>Show:</label>
                <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
                  {ITEMS_PER_PAGE_OPTIONS.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              
              <div className="page-buttons">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="page-btn prev"
                >
                  ← Previous
                </button>
                
                <div className="page-numbers">
                  {getPageNumbers().map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`page-number ${currentPage === pageNum ? 'active' : ''}`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="page-btn next"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Generate Modal */}
      {showGenerateModal && !generatedCode && (
        <div className="modal-overlay" onClick={() => setShowGenerateModal(false)}>
          <div className="modal-content generate-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Generate Invite Code</h2>
              <button className="modal-close" onClick={() => setShowGenerateModal(false)}>
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Employee Email *</label>
                <input
                  type="email"
                  value={newInviteEmail}
                  onChange={(e) => setNewInviteEmail(e.target.value)}
                  placeholder="employee@company.com"
                  className="form-input"
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label>Expires In</label>
                <select 
                  value={expiryHours} 
                  onChange={(e) => setExpiryHours(Number(e.target.value))}
                  className="form-select"
                >
                  <option value={24}>24 hours (1 day)</option>
                  <option value={72}>72 hours (3 days)</option>
                  <option value={168}>168 hours (7 days)</option>
                  <option value={336}>336 hours (14 days)</option>
                  <option value={720}>720 hours (30 days)</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowGenerateModal(false)}>
                Cancel
              </button>
              <button 
                className="btn-primary" 
                onClick={generateInviteCode}
                disabled={isGenerating || !newInviteEmail.trim()}
              >
                {isGenerating ? 'Generating...' : 'Generate Code'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generated Code Display Modal */}
      {generatedCode && (
        <div className="modal-overlay" onClick={() => setGeneratedCode(null)}>
          <div className="modal-content generated-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header success">
              <h2>✨ Invite Code Generated!</h2>
              <button className="modal-close" onClick={() => setGeneratedCode(null)}>
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              <p className="success-message-text">
                Share this code with the employee. They'll need it to register.
              </p>
              <div className="generated-code-display">
                <code>{generatedCode.code}</code>
                <button 
                  onClick={() => copyToClipboard(generatedCode.code, generatedCode.id)}
                  className="copy-generated-btn"
                >
                  <ContentCopyIcon /> Copy Code
                </button>
              </div>
              <div className="code-details">
                <div className="detail-row">
                  <span className="detail-label">Assigned To:</span>
                  <span className="detail-value">{generatedCode.assignedEmail}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Expires At:</span>
                  <span className="detail-value">
                    {new Date(generatedCode.expiresAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-primary" onClick={() => setGeneratedCode(null)}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Invite Code"
        message={`Are you sure you want to delete the invite code for "${codeToDelete?.assignedEmail}"? This action cannot be undone.`}
        onConfirm={deleteInviteCode}
        onCancel={() => {
          setShowDeleteModal(false);
          setCodeToDelete(null);
        }}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
      />
    </AdminLayout>
  );
};

export default RegistrationInviteCode;