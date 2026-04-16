// src/account/components/Admin/AdminSetup.tsx
//only accessible if no admin exists, otherwise shows access denied and prompts to login
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './AdminSetup.css';

const AdminSetup: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [step, setStep] = useState<'check' | 'setup'>('check');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [adminExists, setAdminExists] = useState<boolean | null>(null);

  // Check if any admin exists in the system
  useEffect(() => {
    const checkAdminExists = async () => {
      try {
        // Try to get users - if we get a 403/401, it might mean no admin exists
        // But better to have a dedicated endpoint
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api'}/setup/check-admin`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        
        const data = await response.json();
        setAdminExists(data.hasAdmin || false);
      } catch (error) {
        console.error('Failed to check admin existence:', error);
        setAdminExists(false);
      }
    };
    
    checkAdminExists();
  }, []);

  // If user is already logged in and is admin, redirect to dashboard
  useEffect(() => {
    if (!authLoading && user && user.role === 'ADMIN') {
      window.location.href = '/admin/dashboard';
    }
  }, [user, authLoading]);

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api'}/setup/first-admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess('Admin account created successfully! Redirecting to login...');
        setTimeout(() => {
          window.location.href = '/login?admin_created=true';
        }, 2000);
      } else {
        setError(data.message || data.error?.message || 'Failed to create admin account.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during setup.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  // Add check admin endpoint to backend (optional but helpful)
  useEffect(() => {
    const checkAdminEndpoint = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api'}/setup/check-admin`);
        if (response.ok) {
          const data = await response.json();
          setAdminExists(data.hasAdmin);
        }
      } catch (error) {
        console.error('Check admin error:', error);
      }
    };
    checkAdminEndpoint();
  }, []);

  // Loading state
  if (authLoading || adminExists === null) {
    return (
      <div className="admin-setup-container">
        <div className="admin-setup-card">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Checking system status...</p>
          </div>
        </div>
      </div>
    );
  }

  // If admin already exists, show access denied
  if (adminExists === true && (!user || user.role !== 'ADMIN')) {
    return (
      <div className="admin-setup-container">
        <div className="admin-setup-card">
          <div className="access-denied">
            <div className="denied-icon">🚫</div>
            <h2>Access Denied</h2>
            <p>Admin accounts already exist in the system.</p>
            <p>Please login with your admin credentials.</p>
            <a href="/login" className="login-link">Go to Login</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-setup-container">
      <div className="admin-setup-card">
        <div className="setup-header">
          <div className="setup-icon">👑</div>
          <h1 className="setup-title">Admin Setup</h1>
          <p className="setup-subtitle">
            Create the first administrator account for the system
          </p>
        </div>

        {error && (
          <div className="setup-error">
            <span className="error-icon">⚠️</span>
            <span className="error-text">{error}</span>
          </div>
        )}

        {success && (
          <div className="setup-success">
            <span className="success-icon">✅</span>
            <span className="success-text">{success}</span>
          </div>
        )}

        <form className="setup-form" onSubmit={handleSetup}>
          <div className="setup-field">
            <label htmlFor="firstName" className="setup-label">
              First Name *
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              value={formData.firstName}
              onChange={handleChange}
              className="setup-input"
              placeholder="Enter your first name"
              autoComplete="given-name"
            />
          </div>

          <div className="setup-field">
            <label htmlFor="lastName" className="setup-label">
              Last Name *
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              value={formData.lastName}
              onChange={handleChange}
              className="setup-input"
              placeholder="Enter your last name"
              autoComplete="family-name"
            />
          </div>

          <div className="setup-field">
            <label htmlFor="email" className="setup-label">
              Email Address *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="setup-input"
              placeholder="Enter your email"
              autoComplete="email"
            />
            <p className="setup-hint">
              This email will be used for admin notifications
            </p>
          </div>

          <div className="setup-field">
            <label htmlFor="password" className="setup-label">
              Password *
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="setup-input"
              placeholder="Minimum 6 characters"
              autoComplete="new-password"
            />
          </div>

          <div className="setup-field">
            <label htmlFor="confirmPassword" className="setup-label">
              Confirm Password *
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="setup-input"
              placeholder="Confirm your password"
              autoComplete="new-password"
            />
          </div>

          <div className="setup-info">
            <div className="info-icon">ℹ️</div>
            <div className="info-content">
              <p className="info-title">What happens next?</p>
              <p className="info-text">
                After creating the admin account, you'll be able to:
              </p>
              <ul className="info-list">
                <li>Generate security codes for employee registration</li>
                <li>Approve or reject employee registrations</li>
                <li>Manage all users in the system</li>
                <li>View audit logs and system activity</li>
              </ul>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="setup-button"
          >
            {isSubmitting ? (
              <span className="button-loading">
                <span className="button-spinner"></span>
                Creating Admin...
              </span>
            ) : (
              'Create Admin Account'
            )}
          </button>
        </form>

        <div className="setup-footer">
          <p>
            This setup is only available when no admin accounts exist.
            <br />
            For security, this page will be disabled after the first admin is created.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminSetup;