import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookingCard from '../components/BookingCard';
import { Loader, Toast, ConfirmModal } from '../components/ui';
import './MyBookings.css';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState('all');

  const [confirmCancelId, setConfirmCancelId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/bookings');
      setBookings(res.data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setToast({
        message: err.response?.data?.message || 'Failed to load bookings from backend server',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const executeCancelBooking = async () => {
    if (!confirmCancelId) return;
    try {
      const res = await axios.put(`/api/bookings/${confirmCancelId}/cancel`);
      setBookings(prev =>
        prev.map(booking => (booking._id === confirmCancelId || booking.id === confirmCancelId ? res.data : booking))
      );
      setToast({ message: 'Booking cancelled successfully', type: 'info' });
    } catch (err) {
      console.error('Error cancelling booking:', err);
      setToast({
        message: err.response?.data?.message || 'Failed to cancel booking',
        type: 'error'
      });
    } finally {
      setConfirmCancelId(null);
    }
  };

  const executeDeleteBooking = async () => {
    if (!confirmDeleteId) return;
    try {
      await axios.delete(`/api/bookings/${confirmDeleteId}`);
      setBookings(prev => prev.filter(booking => (booking._id || booking.id) !== confirmDeleteId));
      setToast({ message: 'Booking record deleted', type: 'success' });
    } catch (err) {
      console.error('Error deleting booking:', err);
      setToast({
        message: err.response?.data?.message || 'Failed to delete booking',
        type: 'error'
      });
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const handleUpdateBooking = async (id, updatedData) => {
    try {
      const res = await axios.put(`/api/bookings/${id}`, updatedData);
      setBookings(prev => prev.map(b => (b._id === id || b.id === id ? res.data : b)));
      setToast({ message: 'Booking dates/guests updated successfully!', type: 'success' });
    } catch (err) {
      console.error('Error updating booking:', err);
      setToast({
        message: err.response?.data?.message || 'Failed to update booking details',
        type: 'error'
      });
    }
  };

  const filteredBookings = filter === 'all'
    ? bookings
    : bookings.filter(b => b.status?.toLowerCase() === filter.toLowerCase());

  return (
    <div className="my-bookings-page">
      <div className="bookings-container">
        <div className="bookings-header">
          <h1>My Bookings</h1>
          <div className="filter-tabs">
            <button 
              className={`tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({bookings.length})
            </button>
            <button 
              className={`tab ${filter === 'confirmed' ? 'active' : ''}`}
              onClick={() => setFilter('confirmed')}
            >
              Confirmed ({bookings.filter(b => b.status === 'Confirmed').length})
            </button>
            <button 
              className={`tab ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              Pending ({bookings.filter(b => b.status === 'Pending').length})
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '60px 0', textAlign: 'center' }}>
            <Loader size="lg" text="Loading your bookings..." />
          </div>
        ) : filteredBookings.length > 0 ? (
          <div className="bookings-list">
            {filteredBookings.map(booking => (
              <BookingCard 
                key={booking._id || booking.id} 
                id={booking._id || booking.id} 
                {...booking} 
                onCancel={(id) => setConfirmCancelId(id)}
                onDelete={(id) => setConfirmDeleteId(id)}
                onUpdate={handleUpdateBooking}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>📅 No bookings found</p>
            <p>Start booking your next eco-tourism adventure!</p>
          </div>
        )}
      </div>

      <ConfirmModal 
        isOpen={Boolean(confirmCancelId)}
        title="Cancel Reservation?"
        message="Are you sure you want to cancel this booking reservation? The host will be notified."
        confirmText="Cancel Booking"
        variant="warning"
        onConfirm={executeCancelBooking}
        onCancel={() => setConfirmCancelId(null)}
      />

      <ConfirmModal 
        isOpen={Boolean(confirmDeleteId)}
        title="Delete Booking Record?"
        message="Are you sure you want to permanently delete this booking record?"
        confirmText="Delete Record"
        onConfirm={executeDeleteBooking}
        onCancel={() => setConfirmDeleteId(null)}
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

export default MyBookings;
