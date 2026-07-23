import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Loader, Toast } from '../components/ui';
import './OwnerDashboard.css';

const DEFAULT_LISTING_IMAGE = 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80';

const OwnerDashboard = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [hostBookings, setHostBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [recentMessages, setRecentMessages] = useState([]);
  const [unreadMsgCount, setUnreadMsgCount] = useState(0);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchListingsAndBookings = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const [destinationsRes, homestaysRes, bookingsRes] = await Promise.all([
          axios.get('/api/destinations/my-listings', config),
          axios.get('/api/homestays/my-listings', config),
          axios.get('/api/bookings/host-bookings', config)
        ]);
        
        const combinedListings = [
          ...destinationsRes.data.map(d => ({ ...d, type: 'Destination' })),
          ...homestaysRes.data.map(h => ({ ...h, type: 'Homestay' }))
        ];
        
        setListings(combinedListings);
        setHostBookings(bookingsRes.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
        setToast({
          message: error.response?.data?.message || 'Failed to load host dashboard data',
          type: 'error'
        });
      } finally {
        setLoading(false);
        setBookingsLoading(false);
      }
    };

    const fetchMessages = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const [convRes, unreadRes] = await Promise.all([
          axios.get('/api/messages/conversations', config),
          axios.get('/api/messages/unread-count', config),
        ]);
        setRecentMessages(convRes.data.slice(0, 5));
        setUnreadMsgCount(unreadRes.data.count || 0);
      } catch (error) {
        console.error('Failed to fetch messages', error);
      }
    };
    
    if (token) {
      fetchListingsAndBookings();
      fetchMessages();
    } else {
      setLoading(false);
      setBookingsLoading(false);
    }
  }, [token]);

  const handleConfirm = async (bookingId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.put(`/api/bookings/${bookingId}/confirm`, {}, config);
      setHostBookings(prev => prev.map(b => b._id === bookingId ? data : b));
      setToast({ message: 'Booking confirmed successfully!', type: 'success' });
    } catch (error) {
      console.error('Failed to confirm booking', error);
      setToast({ message: error.response?.data?.message || 'Failed to confirm booking', type: 'error' });
    }
  };

  const handleDecline = async (bookingId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.put(`/api/bookings/${bookingId}/decline`, {}, config);
      setHostBookings(prev => prev.map(b => b._id === bookingId ? data : b));
      setToast({ message: 'Booking declined.', type: 'info' });
    } catch (error) {
      console.error('Failed to decline booking', error);
      setToast({ message: error.response?.data?.message || 'Failed to decline booking', type: 'error' });
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm('Delete this booking request? This will remove it from the dashboard.')) {
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`/api/bookings/${bookingId}`, config);
      setHostBookings(prev => prev.filter(b => b._id !== bookingId));
      setToast({ message: 'Booking request deleted.', type: 'info' });
    } catch (error) {
      console.error('Failed to delete booking', error);
      setToast({ message: error.response?.data?.message || 'Failed to delete booking request', type: 'error' });
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return date.toLocaleDateString([], { weekday: 'short' });
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const stats = {
    totalListings: listings.length,
    totalBookings: hostBookings.length,
    pendingApprovals: hostBookings.filter(b => b.status === 'Pending').length,
    revenue: `$${hostBookings.filter(b => b.status === 'Confirmed').reduce((sum, b) => sum + (b.totalPrice || 0), 0)}`,
    ratings: 4.8
  };

  const pendingBookings = hostBookings.filter(booking => booking.status === 'Pending');
  const latestBooking = hostBookings[0];

  return (
    <div className="owner-dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Host Dashboard</h1>
        </div>

        <div className={`booking-alert ${stats.pendingApprovals > 0 ? 'booking-alert-warning' : 'booking-alert-success'}`}>
          <div>
            <strong>
              {stats.pendingApprovals > 0
                ? `${stats.pendingApprovals} booking request${stats.pendingApprovals > 1 ? 's' : ''} need your approval`
                : 'No pending booking requests right now'}
            </strong>
            <p>
              {stats.pendingApprovals > 0 && pendingBookings[0]
                ? `${pendingBookings[0].guestName} booked ${pendingBookings[0].name}. Confirm or decline it from the table below.`
                : latestBooking
                  ? `Latest booking: ${latestBooking.name} is currently ${latestBooking.status.toLowerCase()}.`
                  : 'When a traveler books one of your listings, it will appear here immediately.'}
            </p>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-icon">🏠</span>
            <div className="stat-content">
              <p className="stat-label">Total Listings</p>
              <p className="stat-value">{stats.totalListings}</p>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">📅</span>
            <div className="stat-content">
              <p className="stat-label">Total Bookings</p>
              <p className="stat-value">{stats.totalBookings}</p>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">💬</span>
            <div className="stat-content">
              <p className="stat-label">Unread Messages</p>
              <p className="stat-value">{unreadMsgCount}</p>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">💰</span>
            <div className="stat-content">
              <p className="stat-label">Revenue</p>
              <p className="stat-value">{stats.revenue}</p>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">⭐</span>
            <div className="stat-content">
              <p className="stat-label">Rating</p>
              <p className="stat-value">{stats.ratings}</p>
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="section">
            <h2>Booking Requests</h2>
            {bookingsLoading ? (
              <div style={{ padding: '30px 0', textAlign: 'center' }}>
                <Loader size="md" text="Loading booking requests..." />
              </div>
            ) : hostBookings.length === 0 ? (
              <p>You have no bookings yet.</p>
            ) : (
              <table className="bookings-table">
                <thead>
                  <tr>
                    <th>Guest</th>
                    <th>Property</th>
                    <th>Dates</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {hostBookings.map(booking => (
                    <tr key={booking._id}>
                      <td>{booking.guestName}</td>
                      <td>{booking.name}</td>
                      <td>{new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}</td>
                      <td>${booking.totalPrice}</td>
                      <td>
                        <span className={`status-badge ${booking.status?.toLowerCase()}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td>
                        <div className="booking-actions-inline">
                          {booking.status === 'Pending' && (
                            <>
                            <button className="booking-action-btn booking-confirm-btn" onClick={() => handleConfirm(booking._id)}>Confirm</button>
                            <button className="booking-action-btn booking-decline-btn" onClick={() => handleDecline(booking._id)}>Decline</button>
                            </>
                          )}
                          <button className="booking-action-btn booking-delete-btn" onClick={() => handleDeleteBooking(booking._id)}>Delete</button>
                        </div>
                        {booking.status !== 'Pending' && (
                          <span className="booking-status-note">
                            {booking.status === 'Confirmed' ? 'Approval complete' : 'Request closed'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Recent Messages Section */}
          <div className="dashboard-messages-section">
            <h2>💬 Recent Messages</h2>
            {recentMessages.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>No messages yet. When travelers contact you, their messages will appear here.</p>
            ) : (
              <>
                {recentMessages.map((conv) => (
                  <div className="dashboard-message-item" key={conv.conversationId}>
                    <div className="dashboard-msg-avatar">
                      {conv.otherUser?.avatar ? (
                        <img src={conv.otherUser.avatar} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        getInitials(conv.otherUser?.name)
                      )}
                    </div>
                    <div className="dashboard-msg-content">
                      <div className="dashboard-msg-name">
                        {conv.otherUser?.name || 'Unknown'}
                        {conv.unreadCount > 0 && <span style={{ marginLeft: 6, fontSize: '0.7rem', background: '#7fd051', color: '#fff', borderRadius: 10, padding: '1px 6px' }}>{conv.unreadCount} new</span>}
                      </div>
                      <div className="dashboard-msg-preview">{conv.lastMessage}</div>
                    </div>
                    <span className="dashboard-msg-time">{formatTime(conv.lastMessageAt)}</span>
                    <button
                      className="dashboard-msg-reply-btn"
                      onClick={() => navigate(`/messages?chatWith=${conv.otherUser?._id}&name=${encodeURIComponent(conv.otherUser?.name || 'User')}`)}
                    >
                      Reply
                    </button>
                  </div>
                ))}
                <button className="dashboard-view-all-btn" onClick={() => navigate('/messages')}>
                  View All Messages →
                </button>
              </>
            )}
          </div>

          <div className="section">
            <h2>My Listings</h2>
            {loading ? (
              <div style={{ padding: '30px 0', textAlign: 'center' }}>
                <Loader size="md" text="Loading my listings..." />
              </div>
            ) : listings.length === 0 ? (
              <p>You haven't added any listings yet.</p>
            ) : (
              <div className="listings-grid">
                {listings.map(listing => (
                  <div className="listing-card" key={listing._id}>
                    <div
                      className="listing-image"
                      style={{
                        backgroundImage: `url(${listing.image || DEFAULT_LISTING_IMAGE})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        height: '150px'
                      }}
                    ></div>
                    <h3>{listing.name}</h3>
                    <p>{listing.location}</p>
                    <p className="status">✓ Active • {listing.price || listing.pricePerNight} • {listing.type}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
};

export default OwnerDashboard;
