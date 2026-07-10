import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Input } from '../components/ui';
import './Login.css'; // Reuse login styles

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyEmailCode, loading } = useAuth();
  
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  
  // Get email from router state if available
  const email = location.state?.email || '';

  if (!email) {
    return (
      <div className="login-page">
        <div className="login-container">
          <div className="login-card">
            <h2>Error</h2>
            <p>No email found to verify. Please log in again.</p>
            <Button onClick={() => navigate('/login')} className="login-btn">Go to Login</Button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError('Please enter the verification code.');
      return;
    }

    setError('');
    const result = await verifyEmailCode(email, token);
    
    if (result.success) {
      if (result.user?.userType === 'admin') {
        navigate('/admin-dashboard');
      } else if (result.user?.userType === 'host') {
        navigate('/owner-dashboard');
      } else {
        navigate('/');
      }
    } else {
      setError(result.message || 'Invalid verification code.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>🌿 EcoExplorer</h1>
            <h2>Verify Your Email</h2>
            <p>We've sent a 6-digit verification code to <strong>{email}</strong>.</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form className="login-form" onSubmit={handleSubmit}>
            <Input
              label="Verification Code"
              type="text"
              id="token"
              name="token"
              placeholder="e.g., 123456"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
            />

            <Button type="submit" className="login-btn" loading={loading}>
              Verify & Login
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
