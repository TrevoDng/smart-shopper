// src/account/components/Admin/AdminAccountProfile.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userApi, UpdateUserProfileData, ApiUser } from '../../../services/userApi';
import AdminLayout from '../layout/AdminLayout';
import './AdminAccountProfile.css';

const AdminAccountProfile: React.FC = () => {
  const { user: authUser, refreshUser } = useAuth();
  const [user, setUser] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const response = await userApi.getUserProfile();
      if (response.success && response.data?.user) {
        const userData = response.data.user;
        setUser(userData);
        setFormData({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          phone: userData.phone || '',
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
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      const updateData: UpdateUserProfileData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone || undefined,
      };
      
      const response = await userApi.updateUserProfile(updateData);
      
      if (response.success) {
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        await refreshUser();
        await fetchUserProfile();
        setTimeout(() => setSuccess(null), 3000);
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
      });
    }
    setIsEditing(false);
    setError(null);
  };

  // Helper functions that work with string values (not literal types)
  const getRoleBadgeClass = (role?: string) => {
    const roleUpper = role?.toUpperCase();
    if (roleUpper === 'ADMIN') return 'role-badge admin';
    if (roleUpper === 'EMPLOYEE') return 'role-badge employee';
    if (roleUpper === 'CLIENT') return 'role-badge client';
    return 'role-badge';
  };

  const getStatusBadgeClass = (status?: string) => {
    if (status === 'active') return 'status-badge active';
    if (status === 'pending_approval') return 'status-badge pending';
    if (status === 'deactivated') return 'status-badge deactivated';
    if (status === 'pending_email') return 'status-badge pending';
    if (status === 'email_verified') return 'status-badge active';
    if (status === 'rejected') return 'status-badge deactivated';
    return 'status-badge';
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-profile-loading">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-profile-container">
        <div className="profile-header">
          <h1>My Profile</h1>
          {!isEditing && (
            <button className="edit-btn" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          )}
        </div>

        {error && (
          <div className="error-message">
            <span>⚠️ {error}</span>
            <button onClick={() => setError(null)} className="close-btn">×</button>
          </div>
        )}

        {success && (
          <div className="success-message">
            <span>✅ {success}</span>
            <button onClick={() => setSuccess(null)} className="close-btn">×</button>
          </div>
        )}

        <div className="profile-content">
          {/* Avatar Section */}
          <div className="avatar-section">
            <div className="avatar">
              {formData.firstName ? formData.firstName.charAt(0).toUpperCase() : 
               formData.lastName ? formData.lastName.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="avatar-info">
              <h2>{user?.firstName} {user?.lastName}</h2>
              <div className="badges">
                <span className={getRoleBadgeClass(user?.role)}>
                  {user?.role || 'USER'}
                </span>
                <span className={getStatusBadgeClass(user?.status)}>
                  {user?.status || 'Unknown'}
                </span>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="profile-form">
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="readonly-input"
              />
              <small>Email cannot be changed</small>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  disabled={!isEditing || saving}
                  placeholder="Enter your first name"
                />
              </div>

              <div className="form-group">
                <label>Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  disabled={!isEditing || saving}
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing || saving}
                placeholder="Enter your phone number"
              />
            </div>

            <div className="form-group">
              <label>Account Created</label>
              <input
                type="text"
                value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                disabled
                className="readonly-input"
              />
            </div>

            {user?.lastLogin && (
              <div className="form-group">
                <label>Last Login</label>
                <input
                  type="text"
                  value={new Date(user.lastLogin).toLocaleString()}
                  disabled
                  className="readonly-input"
                />
              </div>
            )}

            {isEditing && (
              <div className="form-actions">
                <button 
                  className="save-btn" 
                  onClick={handleSave} 
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button 
                  className="cancel-btn" 
                  onClick={handleCancel} 
                  disabled={saving}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Account Information Card */}
          <div className="info-card">
            <h3>Account Information</h3>
            <div className="info-item">
              <span className="info-label">User ID:</span>
              <span className="info-value">{user?.id || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Role:</span>
              <span className="info-value">{user?.role || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Status:</span>
              <span className="info-value">{user?.status || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email Verified:</span>
              <span className="info-value">
                {user?.emailVerified ? 'Yes' : 'No'}
              </span>
            </div>
            {user?.approvedAt && (
              <div className="info-item">
                <span className="info-label">Approved At:</span>
                <span className="info-value">{new Date(user.approvedAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAccountProfile;