import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('Login is currently disabled.');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>🌿 EcoExplorer</h1>
            <h2>Welcome Back</h2>
            <p>Sign in to your account</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                Remember me
              </label>
              <Link to="#" className="forgot-password">Forgot password?</Link>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="login-footer">
            <p>Don't have an account? 
              <Link to="/register" className="register-link">Sign up here</Link>
            </p>
          </div>

          <div className="social-login">
            <p>Or continue with</p>
            <div className="social-buttons">
              <button className="social-btn google">Google</button>
              <button className="social-btn facebook">Facebook</button>
            </div>
          </div>
        </div>

        <div className="login-benefits">
          <h3>Why Join EcoExplorer?</h3>
          <ul>
            <li>✓ Discover sustainable destinations</li>
            <li>✓ Save your favorite places</li>
            <li>✓ Manage your bookings</li>
            <li>✓ Access exclusive deals</li>
            <li>✓ Connect with other travelers</li>
            <li>✓ Get AI-powered recommendations</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Login;
