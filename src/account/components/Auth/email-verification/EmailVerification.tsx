// src/account/components/Auth/EmailVerification.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './EmailVerification.css';
import { useMainCategoryContext } from '../../../../itemsComponents/products/category-filter/context/MainCategoryFilterContext';
import { useSlider } from '../../../../slider/slidercontext/SliderContext';

const EmailVerification: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
   const {hideSlider} = useSlider();
      const {hideMainCategory} = useMainCategoryContext();
                   //hide slider
                       hideSlider();
                       hideMainCategory();

  useEffect(() => {
    const verified = searchParams.get('verified');
    const error = searchParams.get('reason');
    const msg = searchParams.get('message');

    if (verified === 'true') {
      setStatus('success');
      setMessage(msg || 'Email verified successfully!');
    } else if (error) {
      setStatus('error');
      setMessage('Verification failed. Please try again or contact support.');
    } else {
      // If no params, check if there's a token in the URL
      const token = searchParams.get('token');
      if (token) {
        // The backend will handle the verification, but we're showing the result
        setStatus('loading');
      } else {
        setStatus('error');
        setMessage('Invalid verification link.');
      }
    }
  }, [searchParams]);

  const handleLogin = () => {
    navigate('/login');
  };

  const handleResendVerification = () => {
    // Implement resend logic here
    alert('Verification email resent. Please check your inbox.');
  };

  return (
    <div className="verification-container">
      <div className="verification-card">
        {status === 'loading' && (
          <div className="verification-loading">
            <div className="spinner"></div>
            <h2>Verifying your email...</h2>
            <p>Please wait while we confirm your email address.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="verification-success">
            <div className="success-icon">✓</div>
            <h2>Email Verified!</h2>
            <p>{message}</p>
            <div className="verification-actions">
              <button onClick={handleLogin} className="btn-primary">
                Proceed to Login
              </button>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="verification-error">
            <div className="error-icon">✗</div>
            <h2>Verification Failed</h2>
            <p>{message}</p>
            <div className="verification-actions">
              <button onClick={handleResendVerification} className="btn-secondary">
                Resend Verification Email
              </button>
              <button onClick={handleLogin} className="btn-primary">
                Back to Login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailVerification;