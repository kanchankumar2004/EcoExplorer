import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import AddListingModal from '../components/AddListingModal';
import './OwnerDashboard.css';

const OwnerDashboard = () => {
  const { token } = useAuth();
  const [listings, setListings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get('/api/destinations/my-listings', config);
        setListings(data);
      } catch (error) {
        console.error('Failed to fetch listings', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (token) {
      fetchListings();
    }
  }, [token]);

  const handleListingAdded = (newListing) => {
    setListings(prev => [...prev, newListing]);
  };

  const stats = {
    totalListings: listings.length,
    totalBookings: 24,
    revenue: '$5,400',
    ratings: 4.8
  };

  const recentBookings = [
    { id: 1, guestName: 'Sarah Johnson', dates: 'Mar 15-20', amount: '$475' },
    { id: 2, guestName: 'Michael Chen', dates: 'Mar 25-28', amount: '$360' }
  ];

  return (
    <div className="owner-dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Host Dashboard</h1>
          <button className="add-listing-btn" onClick={() => setIsModalOpen(true)}>
            + Add New Listing
          </button>
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
            <h2>Recent Bookings</h2>
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Guest</th>
                  <th>Dates</th>
                  <th>Amount</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map(booking => (
                  <tr key={booking.id}>
                    <td>{booking.guestName}</td>
                    <td>{booking.dates}</td>
                    <td>{booking.amount}</td>
                    <td>
                      <button className="action-link">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="section">
            <h2>My Listings</h2>
            {loading ? (
              <p>Loading listings...</p>
            ) : listings.length === 0 ? (
              <p>You haven't added any listings yet.</p>
            ) : (
              <div className="listings-grid">
                {listings.map(listing => (
                  <div className="listing-card" key={listing._id}>
                    <div className="listing-image" style={{ backgroundImage: `url(${listing.image})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '150px' }}></div>
                    <h3>{listing.name}</h3>
                    <p>{listing.location}</p>
                    <p className="status">✓ Active • {listing.price}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <AddListingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onListingAdded={handleListingAdded}
      />
    </div>
  );
};

export default OwnerDashboard;
