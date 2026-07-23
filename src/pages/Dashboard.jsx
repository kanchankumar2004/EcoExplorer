import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import BookingCard from '../components/BookingCard';
import DestinationCard from '../components/DestinationCard';
import HomestayCard from '../components/HomestayCard';
import { Loader, Toast } from '../components/ui';
import './Dashboard.css';

const Dashboard = () => {
  const { user, token } = useAuth();
  const { favorites } = useFavorites();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentConversations, setRecentConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        const [bookingsRes, unreadRes, convRes] = await Promise.all([
          axios.get('/api/bookings', config),
          axios.get('/api/messages/unread-count', config),
          axios.get('/api/messages/conversations', config)
        ]);

        setBookings(bookingsRes.data || []);
        setUnreadCount(unreadRes.data.count || 0);
        setRecentConversations((convRes.data || []).slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch user dashboard data:', error);
        setToast({
          message: error.response?.data?.message || 'Failed to load user dashboard data.',
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [token]);

  const handleCancelBooking = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.put(`/api/bookings/${id}/cancel`, {}, config);
        setBookings(prev =>
          prev.map(b => (b._id === id || b.id === id ? res.data : b))
        );
        setToast({ message: 'Booking cancelled successfully.', type: 'info' });
      } catch (err) {
        console.error('Error cancelling booking:', err);
        setToast({ message: err.response?.data?.message || 'Failed to cancel booking', type: 'error' });
      }
    }
  };

  const handleDeleteBooking = async (id) => {
    if (window.confirm('Delete this booking record?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.delete(`/api/bookings/${id}`, config);
        setBookings(prev => prev.filter(b => (b._id || b.id) !== id));
        setToast({ message: 'Booking deleted.', type: 'success' });
      } catch (err) {
        console.error('Error deleting booking:', err);
        setToast({ message: err.response?.data?.message || 'Failed to delete booking', type: 'error' });
      }
    }
  };

  const renderAvatar = () => {
    if (user?.avatar) {
      if (user.avatar.startsWith('data:image')) {
        return <img src={user.avatar} alt="Profile Avatar" className="welcome-avatar-img" />;
      }
      return <span>{user.avatar}</span>;
    }
    return <span>👤</span>;
  };

  const activeBookings = bookings.filter(b => b.status !== 'Cancelled');
  const userRole = user?.userType || 'traveler';

  return (
    <div className="user-dashboard-page">
      {/* Welcome Banner */}
      <div className="dashboard-welcome-card">
        <div className="welcome-user-info">
          <div className="welcome-avatar-wrapper">
            {renderAvatar()}
          </div>
          <div className="welcome-text-details">
            <h1>
              Welcome back, {user?.name || 'Explorer'}!
              <span className={`user-role-badge ${userRole}`}>
                {userRole === 'host' ? '🏡 Host' : userRole === 'admin' ? '🛡️ Admin' : '🌍 Traveler'}
              </span>
            </h1>
            <p>{user?.email} • Member since {user?.createdAt ? new Date(user.createdAt).getFullYear() : '2026'}</p>
            {user?.bio && <p style={{ marginTop: '4px', fontStyle: 'italic' }}>"{user.bio}"</p>}
          </div>
        </div>

        <div className="welcome-actions">
          <Link to="/profile" className="dash-btn dash-btn-outline">
            ⚙️ Edit Profile
          </Link>
          <Link to="/travel-planner" className="dash-btn dash-btn-primary">
            🤖 AI Planner
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="user-stats-grid">
        <div className="user-stat-card">
          <div className="user-stat-icon icon-blue">📅</div>
          <div className="user-stat-info">
            <p className="user-stat-label">Active Bookings</p>
            <p className="user-stat-value">{activeBookings.length}</p>
          </div>
        </div>

        <div className="user-stat-card">
          <div className="user-stat-icon icon-red">❤️</div>
          <div className="user-stat-info">
            <p className="user-stat-label">Saved Favorites</p>
            <p className="user-stat-value">{favorites.length}</p>
          </div>
        </div>

        <div className="user-stat-card">
          <div className="user-stat-icon icon-green">💬</div>
          <div className="user-stat-info">
            <p className="user-stat-label">Unread Messages</p>
            <p className="user-stat-value">{unreadCount}</p>
          </div>
        </div>

        <div className="user-stat-card">
          <div className="user-stat-icon icon-purple">🌱</div>
          <div className="user-stat-info">
            <p className="user-stat-label">Eco-Contribution</p>
            <p className="user-stat-value">{bookings.filter(b => b.status === 'Confirmed').length * 25} pts</p>
          </div>
        </div>
      </div>

      {/* Main Content Loading */}
      {loading ? (
        <div style={{ padding: '60px 0', textAlign: 'center' }}>
          <Loader size="lg" text="Loading your dashboard session data..." />
        </div>
      ) : (
        <>
          {/* Active Bookings Section */}
          <div className="dashboard-section">
            <div className="dashboard-section-header">
              <h2>📅 My Active Bookings & Trips ({bookings.length})</h2>
              <Link to="/my-bookings" className="see-all-link">Manage All Bookings →</Link>
            </div>

            {bookings.length === 0 ? (
              <div className="dashboard-empty-box">
                <p style={{ fontSize: '1.2rem' }}>🌿 No bookings created yet.</p>
                <p>Start planning your next sustainable adventure!</p>
                <Link to="/destinations" className="dash-btn dash-btn-primary">Explore Destinations</Link>
              </div>
            ) : (
              <div className="cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                {bookings.slice(0, 3).map((booking) => (
                  <BookingCard
                    key={booking._id || booking.id}
                    id={booking._id || booking.id}
                    {...booking}
                    onCancel={handleCancelBooking}
                    onDelete={handleDeleteBooking}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Saved Favorites Section */}
          <div className="dashboard-section">
            <div className="dashboard-section-header">
              <h2>❤️ Saved Favorites ({favorites.length})</h2>
              <Link to="/favorites" className="see-all-link">View All Favorites →</Link>
            </div>

            {favorites.length === 0 ? (
              <div className="dashboard-empty-box">
                <p>Heart items while browsing to save them for your next trip.</p>
                <Link to="/homestays" className="dash-btn dash-btn-outline">Browse Homestays</Link>
              </div>
            ) : (
              <div className="cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {favorites.slice(0, 3).map((item) => (
                  item.type === 'destination' ? (
                    <DestinationCard key={item.id || item._id} id={item.id || item._id} {...item} />
                  ) : (
                    <HomestayCard key={item.id || item._id} id={item.id || item._id} {...item} />
                  )
                ))}
              </div>
            )}
          </div>

          {/* Recent Messages Section */}
          {recentConversations.length > 0 && (
            <div className="dashboard-section">
              <div className="dashboard-section-header">
                <h2>💬 Recent Host Conversations</h2>
                <Link to="/messages" className="see-all-link">Open Inbox →</Link>
              </div>
              <div style={{ display: 'grid', gap: '12px' }}>
                {recentConversations.map((conv) => (
                  <div key={conv.conversationId} style={{ background: 'var(--bg-card, #fff)', border: '1px solid var(--border-color, #e2e8f0)', borderRadius: '12px', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong style={{ fontSize: '1rem', color: 'var(--text-title)' }}>{conv.otherUser?.name || 'Host'}</strong>
                      <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{conv.lastMessage}</p>
                    </div>
                    <button 
                      className="dash-btn dash-btn-outline" 
                      onClick={() => navigate(`/messages?chatWith=${conv.otherUser?._id}&name=${encodeURIComponent(conv.otherUser?.name || 'User')}`)}
                    >
                      Reply
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions Strip */}
          <div className="quick-actions-strip">
            <div className="quick-actions-content">
              <h3>Need help planning your next itinerary?</h3>
              <p>Ask our custom AI assistant for personalized, eco-friendly recommendations.</p>
            </div>
            <div className="quick-actions-btns">
              <Link to="/travel-planner" className="quick-btn">Ask AI Planner 🤖</Link>
              <Link to="/destinations" className="quick-btn">Browse Destinations 🏔️</Link>
            </div>
          </div>
        </>
      )}

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

export default Dashboard;
