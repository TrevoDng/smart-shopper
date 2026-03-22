import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; 
import { RegisterData } from '../types/user';
import { useSlider } from '../../slider/slidercontext/SliderContext';
import './Register.css';

const Register: React.FC = () => {
  const { register, isLoading } = useAuth();
  const [formData, setFormData] = useState<RegisterData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
    const {hideSlider} = useSlider();
      hideSlider();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await register(formData);
    } catch (err) {
      setErrors(prev => ({
        ...prev,
        submit: 'Registration failed. Please try again.',
      }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
  <div className="register-container">
    <div className="register-card">
      <div className="register-card-inner">
        <div className="register-header">
          <h2 className="register-title">Create your account</h2>
          <p className="register-subtitle">Join our e-commerce community today</p>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          {errors.submit && (
            <div className="register-error">
              <div className="register-error-icon">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="register-error-text">{errors.submit}</div>
            </div>
          )}

          <div className="register-input-group">
            <div className="register-field">
              <label htmlFor="name" className="register-label">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={formData.name}
                onChange={handleChange}
                className={`register-input ${errors.name ? 'error' : ''}`}
                placeholder="Enter your full name"
              />
              {errors.name && <p className="register-field-error">{errors.name}</p>}
            </div>

            <div className="register-field">
              <label htmlFor="email" className="register-label">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`register-input ${errors.email ? 'error' : ''}`}
                placeholder="Enter your email"
              />
              {errors.email && <p className="register-field-error">{errors.email}</p>}
            </div>

            <div className="register-field">
              <label htmlFor="password" className="register-label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className={`register-input ${errors.password ? 'error' : ''}`}
                placeholder="Create a password"
              />
              {errors.password && <p className="register-field-error">{errors.password}</p>}
            </div>

            <div className="register-field">
              <label htmlFor="confirmPassword" className="register-label">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`register-input ${errors.confirmPassword ? 'error' : ''}`}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <p className="register-field-error">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <div className="register-terms">
            By creating an account, you agree to our{' '}
            <a href="#">Terms of Service</a> and{' '}
            <a href="#">Privacy Policy</a>.
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="register-button"
            >
              {isLoading ? (
                <span className="register-button-loading">
                  <svg
                    className="register-spinner"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating Account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </div>

          <div className="register-footer">
            Already have an account?{' '}
            <a href="/login">Sign in</a>
          </div>
        </form>
      </div>
    </div>
  </div>
)
}

export default Register;