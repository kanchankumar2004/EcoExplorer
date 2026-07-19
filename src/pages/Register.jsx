import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Input } from '../components/ui';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    bio: '',
    country: '',
    city: '',
    password: '',
    confirmPassword: '',
    userType: 'traveler'
  });
  const [error, setError] = useState('');

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

    // Client-side validations
    const nameTrimmed = formData.fullName.trim();
    if (nameTrimmed.length < 3) {
      setError('Full Name must be at least 3 characters long.');
      return;
    }
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(nameTrimmed)) {
      setError('Full Name must contain only letters and spaces.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(formData.password)) {
      setError('Password must contain at least one letter and one number.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError('');
    const result = await register({
      name: nameTrimmed,
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      bio: formData.bio.trim(),
      country: formData.country.trim(),
      city: formData.city.trim(),
      password: formData.password,
      userType: formData.userType
    });

    if (result.success) {
      navigate('/login');
    } else {
      setError(result.message || 'Registration failed.');
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-card">
          <div className="register-header">
            <h1>🌿 EcoExplorer</h1>
            <h2>Create Your Account</h2>
            <p>Join our community of eco-conscious travelers</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form className="register-form" onSubmit={handleSubmit}>
            <Input
              label="Full Name"
              type="text"
              id="fullName"
              name="fullName"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={handleChange}
              required
            />

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
              label="Phone Number"
              type="tel"
              id="phone"
              name="phone"
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                name="bio"
                placeholder="Tell us a little about yourself"
                value={formData.bio}
                onChange={handleChange}
                rows="4"
                required
              />
            </div>

            <Input
              label="Country"
              type="text"
              id="country"
              name="country"
              placeholder="India"
              value={formData.country}
              onChange={handleChange}
              required
            />

            <Input
              label="City"
              type="text"
              id="city"
              name="city"
              placeholder="Dehradun"
              value={formData.city}
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

            <Input
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            <div className="form-group">
              <label htmlFor="userType">I am a</label>
              <select
                id="userType"
                name="userType"
                value={formData.userType}
                onChange={handleChange}
              >
                <option value="traveler">Traveler</option>
                <option value="host">Homestay Host</option>
              </select>
            </div>

            <div className="terms">
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms">
                I agree to the Terms of Service and Privacy Policy
              </label>
            </div>

            <Button type="submit" className="register-btn" loading={loading}>
              Create Account
            </Button>
          </form>

          <div className="register-footer">
            <p>Already have an account? 
              <Link to="/login" className="login-link">Sign in here</Link>
            </p>
          </div>

          <div className="social-login">
            <p>Or continue with</p>
            <div className="social-buttons">
              <button type="button" className="social-btn github" onClick={() => handleOAuthLogin('github')}>GitHub</button>
            </div>
          </div>
        </div>

        <div className="register-benefits">
          <h3>Benefits of Joining</h3>
          <ul>
            <li>📚 Access exclusive eco-tourism content</li>
            <li>💰 Get special discounts on bookings</li>
            <li>❤️ Save your favorite destinations</li>
            <li>📅 Manage multiple bookings</li>
            <li>🤝 Connect with like-minded travelers</li>
            <li>🏡 Host if you have a property to share</li>
            <li>🎯 Get AI-powered travel recommendations</li>
            <li>🌱 Support sustainable tourism</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Register;
