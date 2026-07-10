import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Input } from '../components/ui';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login, loginWithToken, loading } = useAuth();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  // Handle OAuth callback token from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    
    if (token) {
      loginWithToken(token).then((result) => {
        if (result.success) {
          navigate('/');
        } else {
          setError('OAuth login failed.');
        }
      });
    }
  }, [location, loginWithToken, navigate]);

  const handleOAuthLogin = (provider) => {
    const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    window.location.href = `${backendUrl}/api/auth/${provider}`;
  };

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
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!formData.password) {
      setError('Password is required.');
      return;
    }

    setError('');
    const result = await login(formData.email.trim(), formData.password);
    if (result.success) {
      if (result.user?.userType === 'admin') {
        navigate('/admin-dashboard');
      } else if (result.user?.userType === 'host') {
        navigate('/owner-dashboard');
      } else {
        navigate('/');
      }
    } else {
      if (result.requiresVerification) {
        navigate('/verify-email', { state: { email: result.email } });
      } else {
        setError(result.message || 'Invalid email or password.');
      }
    }
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
            <Input
              label="Email Address"
              type="email"
              id="email"
              name="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <Input
              label="Password"
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                Remember me
              </label>
              <Link to="#" className="forgot-password">Forgot password?</Link>
            </div>

            <Button type="submit" className="login-btn" loading={loading}>
              Sign In
            </Button>
          </form>

          <div className="login-footer">
            <p>Don't have an account? 
              <Link to="/register" className="register-link">Sign up here</Link>
            </p>
          </div>

          <div className="social-login">
            <p>Or continue with</p>
            <div className="social-buttons">
              <button type="button" className="social-btn github" onClick={() => handleOAuthLogin('github')}>GitHub</button>
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
