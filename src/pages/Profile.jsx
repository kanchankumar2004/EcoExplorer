import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { user, logout, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || 'John Doe',
    email: user?.email || 'john@example.com',
    phone: '+1-234-567-8900',
    bio: 'Passionate eco-traveler',
    country: 'United States',
    city: 'San Francisco'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    await updateProfile({
      name: profileData.name,
      email: profileData.email
    });
    setIsEditing(false);
    console.log('Profile updated:', profileData);
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1>My Profile</h1>
        </div>

        <div className="profile-content">
          <div className="profile-card">
            <div className="profile-avatar">
              <div className="avatar">👤</div>
              <button className="avatar-btn">Change Photo</button>
            </div>

            <div className="profile-info">
              {!isEditing ? (
                <>
                  <div className="info-section">
                    <h2>{profileData.name}</h2>
                    <p className="email">{profileData.email}</p>
                  </div>

                  <div className="info-grid">
                    <div className="info-item">
                      <span className="label">Phone:</span>
                      <span className="value">{profileData.phone}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Bio:</span>
                      <span className="value">{profileData.bio}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Country:</span>
                      <span className="value">{profileData.country}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">City:</span>
                      <span className="value">{profileData.city}</span>
                    </div>
                  </div>

                  <button className="edit-btn" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </button>
                </>
              ) : (
                <>
                  <div className="edit-form">
                    <div className="form-group">
                      <label>Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={profileData.name}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-group">
                      <label>Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-group">
                      <label>Bio</label>
                      <textarea
                        name="bio"
                        value={profileData.bio}
                        onChange={handleChange}
                        rows="3"
                      />
                    </div>

                    <div className="form-group">
                      <label>Country</label>
                      <input
                        type="text"
                        name="country"
                        value={profileData.country}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-group">
                      <label>City</label>
                      <input
                        type="text"
                        name="city"
                        value={profileData.city}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-actions">
                      <button className="save-btn" onClick={handleSave}>Save Changes</button>
                      <button className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="profile-sidebar">
            <div className="sidebar-card">
              <h3>Account Settings</h3>
              <ul>
                <li><a href="#password">Change Password</a></li>
                <li><a href="#notifications">Notifications</a></li>
                <li><a href="#privacy">Privacy Settings</a></li>
                <li><a href="#payments">Payment Methods</a></li>
              </ul>
            </div>

            <div className="sidebar-card">
              <h3>Actions</h3>
              <button className="action-btn">Download My Data</button>
              <button className="action-btn logout-btn" onClick={logout}>Logout</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
