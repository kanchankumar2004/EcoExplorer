import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookingCard from '../components/BookingCard';
import './MyBookings.css';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/bookings');
      setBookings(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err.response?.data?.message || 'Failed to load bookings');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        const res = await axios.put(`/api/bookings/${id}/cancel`);
        // Update local bookings state
        setBookings(prev =>
          prev.map(booking => (booking._id === id ? res.data : booking))
        );
      } catch (err) {
        console.error('Error cancelling booking:', err);
        alert(err.response?.data?.message || 'Failed to cancel booking');
      }
    }
  };

  const handleDeleteBooking = async (id) => {
    if (window.confirm('Are you sure you want to completely delete this booking record?')) {
      try {
        await axios.delete(`/api/bookings/${id}`);
        // Remove from local bookings state
        setBookings(prev => prev.filter(booking => (booking._id || booking.id) !== id));
      } catch (err) {
        console.error('Error deleting booking:', err);
        alert(err.response?.data?.message || 'Failed to delete booking');
      }
    }
  };

  const filteredBookings = filter === 'all'
    ? bookings
    : bookings.filter(b => b.status.toLowerCase() === filter.toLowerCase());

  if (loading) {
    return (
      <div className="my-bookings-page flex items-center justify-center min-h-[50vh]">
        <div className="text-lg text-text-secondary font-medium animate-pulse">
          ⏳ Loading bookings...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-bookings-page flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="text-red-500 font-semibold text-lg">❌ {error}</div>
        <button className="btn btn-primary" onClick={fetchBookings}>Retry</button>
      </div>
    );
  }

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

        {filteredBookings.length > 0 ? (
          <div className="bookings-list">
            {filteredBookings.map(booking => (
              <BookingCard 
                key={booking._id || booking.id} 
                id={booking._id || booking.id} 
                {...booking} 
                onCancel={handleCancelBooking}
                onDelete={handleDeleteBooking}
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
    </div>
  );
};

export default MyBookings;
