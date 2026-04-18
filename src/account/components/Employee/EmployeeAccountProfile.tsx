// src/components/employee/EmployeeAccountProfile.tsx
import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { getUserProfile, updateUserProfile } from '../../../services/userApi';
//import { updateUserProfile, getUserProfile } from '../../services/userApi';
import { useAuth } from '../../context/AuthContext';
import { User } from '../../types/user';
import './EmployeeAccountProfile.css';
import EmployeeLayout from '../layout/EmployeeLayout';

const EmployeeAccountProfile: React.FC = () => {
  // const { user: authUser, token } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
  });

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const response = await getUserProfile();
      if (response.success && response.data?.user) {
        const userData = response.data.user;
        setUser(userData);
        setFormData({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          phone: userData.phone || '',
          email: userData.email || '',
        });
      } else {
        setError(response.message || 'Failed to load profile');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await updateUserProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
      });
      if (response.success) {
        setSuccess('Profile updated successfully');
        setIsEditing(false);
        await fetchUserProfile();
      } else {
        setError(response.message || 'Failed to update profile');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        email: user.email || '',
      });
    }
    setIsEditing(false);
    setError(null);
  };

  const getStatusInfo = () => {
    switch (user?.status) {
      case 'active':
        return { label: 'Active', color: 'success', icon: '✓' };
      case 'pending_approval':
        return { label: 'Pending Admin Approval', color: 'warning', icon: '⏳' };
      case 'pending_email':
        return { label: 'Email Not Verified', color: 'error', icon: '✉' };
      case 'rejected':
        return { label: 'Rejected', color: 'error', icon: '✗' };
      case 'deactivated':
        return { label: 'Deactivated', color: 'default', icon: '⛔' };
      default:
        return { label: user?.status || 'Unknown', color: 'default', icon: '?' };
    }
  };

  if (loading) {
    return (
      <div className="profile-loading-container">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  const statusInfo = getStatusInfo();

  return (
    <EmployeeLayout>
    <div className="profile-container">
      <h1 className="profile-title">Account Profile</h1>

      {error && (
        <div className="error-message">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="close-btn">×</button>
        </div>
      )}

      {success && (
        <div className="success-message">
          <span>{success}</span>
          <button onClick={() => setSuccess(null)} className="close-btn">×</button>
        </div>
      )}

      <div className="profile-grid">
        {/* Status Card */}
        <div className="status-card">
          <div className="status-avatar">
            <span className="status-icon">{statusInfo.icon}</span>
          </div>
          <h3 className="status-title">Account Status</h3>
          <span className={`status-badge status-${statusInfo.color}`}>
            {statusInfo.label}
          </span>
          {user?.status === 'pending_approval' && (
            <p className="status-message">
              Your account is waiting for admin approval. You'll be notified once approved.
            </p>
          )}
          {user?.status === 'active' && (
            <p className="status-message">
              Your account is active and fully functional.
            </p>
          )}
          {user?.status === 'pending_email' && (
            <p className="status-message">
              Please check your email to verify your account.
            </p>
          )}
        </div>

        {/* Profile Info Card */}
        <div className="profile-card">
          <div className="profile-card-header">
            <h3 className="profile-card-title">Personal Information</h3>
            {!isEditing ? (
              <button 
                className="edit-btn" 
                onClick={() => setIsEditing(true)}
                title="Edit Profile"
              >
                <EditIcon />
              </button>
            ) : (
              <div className="action-buttons">
                <button 
                  className="save-btn" 
                  onClick={handleSave} 
                  disabled={saving}
                  title="Save Changes"
                >
                  <SaveIcon />
                </button>
                <button 
                  className="cancel-btn" 
                  onClick={handleCancel}
                  title="Cancel"
                >
                  <CancelIcon />
                </button>
              </div>
            )}
          </div>
          
          <hr className="divider" />

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                className={`form-input ${!isEditing ? 'readonly' : ''}`}
                value={formData.firstName}
                onChange={handleInputChange}
                disabled={!isEditing}
                readOnly={!isEditing}
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className={`form-input ${!isEditing ? 'readonly' : ''}`}
                value={formData.lastName}
                onChange={handleInputChange}
                disabled={!isEditing}
                readOnly={!isEditing}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input readonly"
                value={formData.email}
                disabled
                readOnly
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className={`form-input ${!isEditing ? 'readonly' : ''}`}
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                readOnly={!isEditing}
              />
            </div>
          </div>

          {user?.createdAt && (
            <div className="member-since">
              Member since: {new Date(user.createdAt).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </div>
    </EmployeeLayout>
  );
};

export default EmployeeAccountProfile;