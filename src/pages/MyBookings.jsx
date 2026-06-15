import React, { useState } from 'react';
import BookingCard from '../components/BookingCard';
import { destinations, homestays } from '../utils/mockData';
import './MyBookings.css';

const MyBookings = () => {
  const [bookings] = useState([
    {
      id: 1,
      name: 'Eco-Lodge Mountain Retreat',
      type: 'Homestay',
      checkIn: 'March 15, 2024',
      checkOut: 'March 20, 2024',
      guests: 2,
      totalPrice: 475,
      status: 'Confirmed',
      image: homestays[0].image
    },
    {
      id: 2,
      name: 'Valley of Flowers Trek',
      type: 'Destination',
      checkIn: 'April 10, 2024',
      checkOut: 'April 15, 2024',
      guests: 1,
      totalPrice: 600,
      status: 'Pending',
      image: destinations[0].image
    },
    {
      id: 3,
      name: 'Coastal Cottage',
      type: 'Homestay',
      checkIn: 'May 1, 2024',
      checkOut: 'May 7, 2024',
      guests: 3,
      totalPrice: 840,
      status: 'Confirmed',
      image: homestays[1].image
    }
  ]);

  const [filter, setFilter] = useState('all');

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status.toLowerCase() === filter.toLowerCase());

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
              <BookingCard key={booking.id} {...booking} />
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
