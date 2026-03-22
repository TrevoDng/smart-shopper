import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; //from '../contexts/AuthContext';
import { LoginCredentials } from '../types/user';
import { useSlider } from '../../slider/slidercontext/SliderContext';
import './Login.css';

const Login: React.FC=()=> {
    const { login, isLoading } = useAuth();
    const [credentials, setCredentials] = useState<LoginCredentials>({
        email: '',
        password: '',
        rememberMe: false
    });
    const [error, setError] = useState('');

      const {hideSlider} = useSlider();
        hideSlider();

    const handleSubmit = async (e: React.FormEvent)=> {
        e.preventDefault();
        setError('');

        try {
            login(credentials);
        } catch (error) {
            setError("Invalid email or password");
        }
    }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };


   return (
  <div className="login-container">
    <div className="login-box">
      <div>
        <h2 className="login-title">Sign in to your account</h2>
        <p className="login-subtitle">
          Or{' '}
          <a href="#" className="login-link">
            start your 14-day free trial
          </a>
        </p>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        {error && (
          <div className="login-error">
            <div className="login-error-text">{error}</div>
          </div>
        )}

        <div className="login-input-group">
          <div>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={credentials.email}
              onChange={handleChange}
              className="login-input"
              placeholder="Email address"
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={credentials.password}
              onChange={handleChange}
              className="login-input"
              placeholder="Password"
            />
          </div>
        </div>

        <div className="login-options">
          <div className="login-checkbox-wrapper">
            <input
              id="remember-me"
              name="rememberMe"
              type="checkbox"
              checked={credentials.rememberMe}
              onChange={handleChange}
              className="login-checkbox"
            />
            <label htmlFor="remember-me" className="login-checkbox-label">
              Remember me
            </label>
          </div>

          <div className="login-forgot">
            <a href="#" className="login-forgot-link">
              Forgot your password?
            </a>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="login-button"
          >
            {isLoading ? (
              <span className="login-button-loading">
                <svg
                  className="login-spinner"
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
                Signing in...
              </span>
            ) : (
              'Sign in'
            )}
          </button>
        </div>

        <div className="login-register-link">
          <a href="/register">Register</a>
        </div>
      </form>
    </div>
  </div>
)
}

export default Login;