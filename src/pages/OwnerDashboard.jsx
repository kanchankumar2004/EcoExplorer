import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Loader, Toast, ConfirmModal } from '../components/ui';
import AddListingModal from '../components/AddListingModal';
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

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingListing, setEditingListing] = useState(null);
  const [confirmDeleteBookingId, setConfirmDeleteBookingId] = useState(null);
  const [confirmDeleteListing, setConfirmDeleteListing] = useState(null);
  const [updatingListing, setUpdatingListing] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: '',
    location: '',
    price: '',
    description: '',
    longDescription: '',
  });

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

  useEffect(() => {
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

  const executeDeleteBooking = async () => {
    if (!confirmDeleteBookingId) return;
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`/api/bookings/${confirmDeleteBookingId}`, config);
      setHostBookings(prev => prev.filter(b => b._id !== confirmDeleteBookingId));
      setToast({ message: 'Booking request deleted.', type: 'info' });
    } catch (error) {
      console.error('Failed to delete booking', error);
      setToast({ message: error.response?.data?.message || 'Failed to delete booking request', type: 'error' });
    } finally {
      setConfirmDeleteBookingId(null);
    }
  };

  const executeDeleteListing = async () => {
    if (!confirmDeleteListing) return;
    const { _id, type } = confirmDeleteListing;
    const route = type === 'Destination' ? 'destinations' : 'homestays';
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`/api/${route}/${_id}`, config);
      setListings(prev => prev.filter(l => l._id !== _id));
      setToast({ message: 'Listing deleted successfully.', type: 'success' });
    } catch (error) {
      console.error('Failed to delete listing', error);
      setToast({ message: error.response?.data?.message || 'Failed to delete listing', type: 'error' });
    } finally {
      setConfirmDeleteListing(null);
    }
  };

  const handleOpenEditModal = (listing) => {
    setEditingListing(listing);
    setEditForm({
      name: listing.name || '',
      location: listing.location || '',
      price: listing.price || listing.pricePerNight || '',
      description: listing.description || '',
      longDescription: listing.longDescription || '',
    });
  };

  const handleSaveEditListing = async (e) => {
    e.preventDefault();
    if (!editingListing) return;

    setUpdatingListing(true);
    const { _id, type } = editingListing;
    const route = type === 'Destination' ? 'destinations' : 'homestays';

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.put(`/api/${route}/${_id}`, editForm, config);
      
      setListings(prev => prev.map(l => l._id === _id ? { ...data, type } : l));
      setToast({ message: 'Listing updated successfully!', type: 'success' });
      setEditingListing(null);
    } catch (error) {
      console.error('Failed to update listing:', error);
      setToast({ message: error.response?.data?.message || 'Failed to update listing', type: 'error' });
    } finally {
      setUpdatingListing(false);
    }
  };

  const handleListingAdded = (newListing) => {
    setListings(prev => [{ ...newListing, type: 'Destination' }, ...prev]);
    setToast({ message: 'New listing created successfully!', type: 'success' });
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
        <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>Host Dashboard</h1>
          <button 
            className="dash-btn dash-btn-primary" 
            onClick={() => setIsAddModalOpen(true)}
            style={{ padding: '10px 18px', background: 'linear-gradient(135deg, #11998e, #38ef7d)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            + Add New Listing
          </button>
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
                          <button className="booking-action-btn booking-delete-btn" onClick={() => setConfirmDeleteBookingId(booking._id)}>Delete</button>
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
            <h2>My Property Listings ({listings.length})</h2>
            {loading ? (
              <div style={{ padding: '30px 0', textAlign: 'center' }}>
                <Loader size="md" text="Loading my listings..." />
              </div>
            ) : listings.length === 0 ? (
              <div style={{ background: 'var(--bg-card)', border: '2px dashed var(--border-color)', borderRadius: '12px', padding: '30px', textAlign: 'center' }}>
                <p>🏡 You haven't added any property listings yet.</p>
                <button 
                  onClick={() => setIsAddModalOpen(true)}
                  style={{ marginTop: '10px', padding: '8px 16px', background: '#7fd051', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  + Add Your First Listing
                </button>
              </div>
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
                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                      <button 
                        onClick={() => handleOpenEditModal(listing)}
                        style={{ flex: 1, padding: '6px 12px', background: 'var(--bg-tertiary, #e2e8f0)', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem' }}
                      >
                        ✏️ Edit
                      </button>
                      <button 
                        onClick={() => setConfirmDeleteListing(listing)}
                        style={{ flex: 1, padding: '6px 12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem' }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ADD LISTING MODAL */}
      <AddListingModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onListingAdded={handleListingAdded}
      />

      {/* EDIT LISTING MODAL */}
      {editingListing && (
        <div className="modal-overlay" onClick={() => setEditingListing(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <button className="close-btn" onClick={() => setEditingListing(null)}>&times;</button>
            <h2>Edit Listing: {editingListing.name}</h2>
            <form onSubmit={handleSaveEditListing} style={{ display: 'grid', gap: '12px', marginTop: '16px' }}>
              <div className="form-group">
                <label>Listing Title</label>
                <input 
                  type="text" 
                  value={editForm.name} 
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} 
                  required 
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input 
                  type="text" 
                  value={editForm.location} 
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} 
                  required 
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div className="form-group">
                <label>Price</label>
                <input 
                  type="text" 
                  value={editForm.price} 
                  onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} 
                  required 
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div className="form-group">
                <label>Short Description</label>
                <textarea 
                  rows="2"
                  value={editForm.description} 
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} 
                  required 
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div className="form-group">
                <label>Detailed Description</label>
                <textarea 
                  rows="4"
                  value={editForm.longDescription} 
                  onChange={(e) => setEditForm({ ...editForm, longDescription: e.target.value })} 
                  required 
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setEditingListing(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={updatingListing}>
                  {updatingListing ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODALS */}
      <ConfirmModal 
        isOpen={Boolean(confirmDeleteBookingId)}
        title="Delete Booking Request?"
        message="Are you sure you want to permanently delete this booking request from your dashboard?"
        confirmText="Delete Booking"
        onConfirm={executeDeleteBooking}
        onCancel={() => setConfirmDeleteBookingId(null)}
      />

      <ConfirmModal 
        isOpen={Boolean(confirmDeleteListing)}
        title="Delete Property Listing?"
        message={`Are you sure you want to delete "${confirmDeleteListing?.name}"? This action cannot be undone.`}
        confirmText="Delete Listing"
        onConfirm={executeDeleteListing}
        onCancel={() => setConfirmDeleteListing(null)}
      />

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
