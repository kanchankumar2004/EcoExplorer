import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { user, logout, updateProfile, changePassword } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [alert, setAlert] = useState({ text: '', type: '' });
  const [activeModal, setActiveModal] = useState(null); // 'password', 'notifications', 'privacy', 'payments', 'avatar'

  // Profile data state
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    country: '',
    city: '',
    avatar: ''
  });

  // Settings state
  const [settings, setSettings] = useState({
    notifications: { emailAlerts: true, weeklyNewsletter: false, bookingUpdates: true },
    privacy: { profilePublic: true, showActivity: true },
    paymentMethods: []
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Payment method form state
  const [cardData, setCardData] = useState({
    cardholderName: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  // Sync state with user context
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        country: user.country || '',
        city: user.city || '',
        avatar: user.avatar || ''
      });
      if (user.settings) {
        setSettings({
          notifications: {
            emailAlerts: user.settings.notifications?.emailAlerts ?? true,
            weeklyNewsletter: user.settings.notifications?.weeklyNewsletter ?? false,
            bookingUpdates: user.settings.notifications?.bookingUpdates ?? true,
          },
          privacy: {
            profilePublic: user.settings.privacy?.profilePublic ?? true,
            showActivity: user.settings.privacy?.showActivity ?? true,
          },
          paymentMethods: user.settings.paymentMethods || []
        });
      }
    }
  }, [user]);

  // Alert notifier
  const showAlert = (text, type = 'success') => {
    setAlert({ text, type });
    setTimeout(() => setAlert({ text: '', type: '' }), 4000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    const res = await updateProfile({
      ...profileData,
      settings // retain settings as well
    });
    if (res.success) {
      setIsEditing(false);
      showAlert('Profile updated successfully!');
    } else {
      showAlert(res.message || 'Failed to update profile', 'error');
    }
  };

  // Avatar Presets
  const presetAvatars = [
    { label: 'Leaf', emoji: '🍃', color: 'linear-gradient(135deg, #11998e, #38ef7d)' },
    { label: 'Mountain', emoji: '🏔️', color: 'linear-gradient(135deg, #3a7bd5, #3a6073)' },
    { label: 'Tree', emoji: '🌲', color: 'linear-gradient(135deg, #134e5e, #71b280)' },
    { label: 'Compass', emoji: '🧭', color: 'linear-gradient(135deg, #f857a6, #ff5858)' },
    { label: 'Sun', emoji: '☀️', color: 'linear-gradient(135deg, #f1c40f, #f39c12)' },
    { label: 'Campfire', emoji: '🔥', color: 'linear-gradient(135deg, #d31027, #ea720c)' },
    { label: 'Waves', emoji: '🌊', color: 'linear-gradient(135deg, #00c6ff, #0072ff)' },
    { label: 'Bicycle', emoji: '🚲', color: 'linear-gradient(135deg, #4568dc, #b06ab3)' }
  ];

  const renderAvatar = () => {
    if (profileData.avatar) {
      if (profileData.avatar.startsWith('data:image')) {
        return <img src={profileData.avatar} alt="Profile" className="avatar-img" />;
      }
      
      // Match color from preset if it exists
      const preset = presetAvatars.find(p => p.emoji === profileData.avatar);
      const bgStyle = preset ? { background: preset.color } : { background: 'linear-gradient(135deg, #2d5016, #7fd051)' };
      
      return (
        <div className="avatar-preview-inner" style={bgStyle}>
          {profileData.avatar}
        </div>
      );
    }
    return <div className="avatar-preview-inner">👤</div>;
  };

  const handleCustomPhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 1.5 * 1024 * 1024) {
      showAlert('Custom photo file size must be less than 1.5MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result;
      setProfileData(prev => ({ ...prev, avatar: base64 }));
      const res = await updateProfile({ ...profileData, avatar: base64, settings });
      if (res.success) {
        showAlert('Custom photo uploaded successfully!');
        setActiveModal(null);
      } else {
        showAlert(res.message || 'Failed to update photo', 'error');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = async (emoji) => {
    setProfileData(prev => ({ ...prev, avatar: emoji }));
    const res = await updateProfile({ ...profileData, avatar: emoji, settings });
    if (res.success) {
      showAlert('Avatar updated successfully!');
      setActiveModal(null);
    } else {
      showAlert(res.message || 'Failed to update avatar', 'error');
    }
  };

  // Settings Toggles
  const toggleNotification = async (field) => {
    const updated = {
      ...settings,
      notifications: {
        ...settings.notifications,
        [field]: !settings.notifications[field]
      }
    };
    setSettings(updated);
    const res = await updateProfile({ ...profileData, settings: updated });
    if (!res.success) {
      showAlert('Failed to update notification settings', 'error');
      setSettings(settings); // revert
    }
  };

  const togglePrivacy = async (field) => {
    const updated = {
      ...settings,
      privacy: {
        ...settings.privacy,
        [field]: !settings.privacy[field]
      }
    };
    setSettings(updated);
    const res = await updateProfile({ ...profileData, settings: updated });
    if (!res.success) {
      showAlert('Failed to update privacy settings', 'error');
      setSettings(settings); // revert
    }
  };

  // Change Password API Call
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showAlert('New passwords do not match', 'error');
      return;
    }
    const res = await changePassword(passwordData.currentPassword, passwordData.newPassword);
    if (res.success) {
      showAlert(res.message);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setActiveModal(null);
    } else {
      showAlert(res.message, 'error');
    }
  };

  // Cards Helpers
  const getCardType = (number) => {
    const val = number.replace(/\D/g, '');
    if (val.startsWith('4')) return 'Visa';
    if (/^5[1-5]/.test(val)) return 'Mastercard';
    if (/^3[47]/.test(val)) return 'American Express';
    return 'Credit Card';
  };

  const handleCardSubmit = async (e) => {
    e.preventDefault();
    const { cardholderName, cardNumber, expiry, cvv } = cardData;

    if (!cardholderName || !cardNumber || !expiry || !cvv) {
      showAlert('Please enter all card details', 'error');
      return;
    }

    const digits = cardNumber.replace(/\D/g, '');
    if (digits.length < 13 || digits.length > 19) {
      showAlert('Invalid credit card number', 'error');
      return;
    }

    const cardType = getCardType(digits);
    const last4 = digits.slice(-4);
    const newCard = {
      id: Date.now().toString(),
      cardholderName: cardholderName.trim(),
      cardType,
      last4,
      expiry: expiry.trim()
    };

    const updatedSettings = {
      ...settings,
      paymentMethods: [...settings.paymentMethods, newCard]
    };
    setSettings(updatedSettings);
    setCardData({ cardholderName: '', cardNumber: '', expiry: '', cvv: '' });

    const res = await updateProfile({ ...profileData, settings: updatedSettings });
    if (res.success) {
      showAlert('Card added successfully!');
    } else {
      showAlert('Failed to add card', 'error');
      setSettings(settings); // revert
    }
  };

  const handleDeleteCard = async (cardId) => {
    const updatedSettings = {
      ...settings,
      paymentMethods: settings.paymentMethods.filter(c => c.id !== cardId)
    };
    setSettings(updatedSettings);

    const res = await updateProfile({ ...profileData, settings: updatedSettings });
    if (res.success) {
      showAlert('Card deleted successfully!');
    } else {
      showAlert('Failed to delete card', 'error');
      setSettings(settings); // revert
    }
  };

  // Download user profile data in JSON format
  const handleDownloadData = () => {
    const cleanUser = {
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      bio: user.bio || '',
      country: user.country || '',
      city: user.city || '',
      userType: user.userType,
      createdAt: user.createdAt,
      settings: {
        notifications: settings.notifications,
        privacy: settings.privacy,
        paymentMethods: settings.paymentMethods.map(c => ({
          cardType: c.cardType,
          last4: c.last4,
          expiry: c.expiry
        }))
      }
    };

    const data = JSON.stringify(cleanUser, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ecoexplorer_profile_${user.name.toLowerCase().replace(/\s+/g, '_')}_data.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showAlert('Your profile data has been generated and downloaded!');
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        {alert.text && (
          <div className={`alert-banner ${alert.type === 'error' ? 'alert-error' : 'alert-success'}`}>
            {alert.text}
          </div>
        )}

        <div className="profile-header">
          <h1>My Profile</h1>
        </div>

        <div className="profile-content">
          <div className="profile-card">
            <div className="profile-avatar">
              <div className="avatar-preview-outer">
                {renderAvatar()}
              </div>
              <button className="avatar-btn" onClick={() => setActiveModal('avatar')}>Change Photo</button>
            </div>

            <div className="profile-info">
              {!isEditing ? (
                <>
                  <div className="info-section">
                    <h2>{profileData.name || 'Set Name'}</h2>
                    <p className="email">{profileData.email || 'Set Email'}</p>
                  </div>

                  <div className="info-grid">
                    <div className="info-item">
                      <span className="label">Phone:</span>
                      <span className="value">{profileData.phone || 'Not set'}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Bio:</span>
                      <span className="value">{profileData.bio || 'No bio added yet'}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Country:</span>
                      <span className="value">{profileData.country || 'Not set'}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">City:</span>
                      <span className="value">{profileData.city || 'Not set'}</span>
                    </div>
                  </div>

                  <button className="edit-btn" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </button>
                </>
              ) : (
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
                      disabled
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleChange}
                      placeholder="+1 555-0199"
                    />
                  </div>

                  <div className="form-group">
                    <label>Bio</label>
                    <textarea
                      name="bio"
                      value={profileData.bio}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Share your travel experiences..."
                    />
                  </div>

                  <div className="form-group">
                    <label>Country</label>
                    <input
                      type="text"
                      name="country"
                      value={profileData.country}
                      onChange={handleChange}
                      placeholder="e.g. Canada"
                    />
                  </div>

                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      name="city"
                      value={profileData.city}
                      onChange={handleChange}
                      placeholder="e.g. Vancouver"
                    />
                  </div>

                  <div className="form-actions">
                    <button className="save-btn" onClick={handleSave}>Save Changes</button>
                    <button className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="profile-sidebar">
            <div className="sidebar-card">
              <h3>Account Settings</h3>
              <ul className="settings-links">
                <li><button onClick={() => setActiveModal('password')} className="settings-link-btn">Change Password</button></li>
                <li><button onClick={() => setActiveModal('notifications')} className="settings-link-btn">Notifications</button></li>
                <li><button onClick={() => setActiveModal('privacy')} className="settings-link-btn">Privacy Settings</button></li>
                <li><button onClick={() => setActiveModal('payments')} className="settings-link-btn">Payment Methods</button></li>
              </ul>
            </div>

            <div className="sidebar-card">
              <h3>Actions</h3>
              <button className="action-btn" onClick={handleDownloadData}>Download My Data</button>
              <button className="action-btn logout-btn" onClick={logout}>Logout</button>
            </div>
          </div>
        </div>
      </div>

      {/* AVATAR PHOTO SELECTOR MODAL */}
      {activeModal === 'avatar' && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Select Profile Photo</h2>
              <button className="close-modal-btn" onClick={() => setActiveModal(null)}>&times;</button>
            </div>
            <div className="modal-body">
              <h4>Preset Avatars</h4>
              <div className="avatar-preset-grid">
                {presetAvatars.map((preset) => (
                  <button
                    key={preset.label}
                    className="avatar-preset-item"
                    style={{ background: preset.color }}
                    onClick={() => handleSelectPreset(preset.emoji)}
                    title={preset.label}
                  >
                    {preset.emoji}
                  </button>
                ))}
              </div>
              <div className="avatar-divider">
                <span>OR</span>
              </div>
              <h4>Upload Custom Image</h4>
              <div className="custom-photo-uploader">
                <input
                  type="file"
                  id="custom-avatar-file"
                  accept="image/*"
                  onChange={handleCustomPhoto}
                  className="hidden-file-input"
                />
                <label htmlFor="custom-avatar-file" className="file-upload-label">
                  📁 Choose an image file
                </label>
                <p className="upload-tip">Supports JPEG, PNG under 1.5MB</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CHANGE PASSWORD MODAL */}
      {activeModal === 'password' && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Change Password</h2>
              <button className="close-modal-btn" onClick={() => setActiveModal(null)}>&times;</button>
            </div>
            <form onSubmit={handlePasswordSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Current Password</label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="save-btn">Update Password</button>
                <button type="button" className="cancel-btn" onClick={() => setActiveModal(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NOTIFICATIONS MODAL */}
      {activeModal === 'notifications' && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Notifications Settings</h2>
              <button className="close-modal-btn" onClick={() => setActiveModal(null)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="settings-toggle-row">
                <div className="toggle-info">
                  <h4>Email Alerts</h4>
                  <p>Receive notifications about new bookings and travel logs.</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.notifications.emailAlerts}
                    onChange={() => toggleNotification('emailAlerts')}
                  />
                  <span className="slider"></span>
                </label>
              </div>
              <div className="settings-toggle-row">
                <div className="toggle-info">
                  <h4>Weekly Newsletter</h4>
                  <p>Stay updated on the best eco-destinations and weekly blogs.</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.notifications.weeklyNewsletter}
                    onChange={() => toggleNotification('weeklyNewsletter')}
                  />
                  <span className="slider"></span>
                </label>
              </div>
              <div className="settings-toggle-row">
                <div className="toggle-info">
                  <h4>Booking Updates</h4>
                  <p>Immediate transaction and reservation confirmation alerts.</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.notifications.bookingUpdates}
                    onChange={() => toggleNotification('bookingUpdates')}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRIVACY SETTINGS MODAL */}
      {activeModal === 'privacy' && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Privacy Settings</h2>
              <button className="close-modal-btn" onClick={() => setActiveModal(null)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="settings-toggle-row">
                <div className="toggle-info">
                  <h4>Make Profile Public</h4>
                  <p>Allow other travelers to search and view your badges, ratings, and bio.</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.privacy.profilePublic}
                    onChange={() => togglePrivacy('profilePublic')}
                  />
                  <span className="slider"></span>
                </label>
              </div>
              <div className="settings-toggle-row">
                <div className="toggle-info">
                  <h4>Show Activities and Bookings</h4>
                  <p>Display your travels logs and homestays inside showcase lists.</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.privacy.showActivity}
                    onChange={() => togglePrivacy('showActivity')}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PAYMENT METHODS MODAL */}
      {activeModal === 'payments' && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-content payments-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Payment Methods</h2>
              <button className="close-modal-btn" onClick={() => setActiveModal(null)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="cards-list">
                <h4>Saved Cards</h4>
                {settings.paymentMethods.length === 0 ? (
                  <p className="no-cards-msg">No cards saved yet.</p>
                ) : (
                  <div className="payment-cards-grid">
                    {settings.paymentMethods.map((card) => (
                      <div key={card.id} className="payment-card-item">
                        <div className="card-top">
                          <span className="card-brand">{card.cardType}</span>
                          <button className="delete-card-btn" onClick={() => handleDeleteCard(card.id)} title="Remove Card">
                            &times;
                          </button>
                        </div>
                        <div className="card-middle">
                          <span className="card-number-mask">•••• •••• •••• {card.last4}</span>
                        </div>
                        <div className="card-bottom">
                          <div className="card-holder">
                            <span className="card-meta-label">CARD HOLDER</span>
                            <span className="card-meta-val">{card.cardholderName}</span>
                          </div>
                          <div className="card-expiry">
                            <span className="card-meta-label">EXPIRES</span>
                            <span className="card-meta-val">{card.expiry}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="avatar-divider">
                <span>ADD NEW CARD</span>
              </div>

              <form onSubmit={handleCardSubmit} className="add-card-form">
                <div className="form-group">
                  <label>Cardholder Name</label>
                  <input
                    type="text"
                    value={cardData.cardholderName}
                    onChange={(e) => setCardData(prev => ({ ...prev, cardholderName: e.target.value }))}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Card Number</label>
                  <input
                    type="text"
                    value={cardData.cardNumber}
                    onChange={(e) => setCardData(prev => ({ ...prev, cardNumber: e.target.value }))}
                    placeholder="4111 2222 3333 4444"
                    maxLength="19"
                    required
                  />
                </div>
                <div className="form-double-group">
                  <div className="form-group">
                    <label>Expiry (MM/YY)</label>
                    <input
                      type="text"
                      value={cardData.expiry}
                      onChange={(e) => setCardData(prev => ({ ...prev, expiry: e.target.value }))}
                      placeholder="12/28"
                      maxLength="5"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input
                      type="password"
                      value={cardData.cvv}
                      onChange={(e) => setCardData(prev => ({ ...prev, cvv: e.target.value }))}
                      placeholder="***"
                      maxLength="4"
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="save-btn add-card-btn">Save Payment Method</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
