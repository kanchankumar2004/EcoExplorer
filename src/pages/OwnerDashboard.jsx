import React from 'react';
import './OwnerDashboard.css';

const OwnerDashboard = () => {
  const stats = {
    totalListings: 3,
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
          <button className="add-listing-btn">+ Add New Listing</button>
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
            <div className="listings-grid">
              <div className="listing-card">
                <div className="listing-image">🏡</div>
                <h3>Mountain Retreat</h3>
                <p>uttarakhandIndia</p>
                <p className="status">✓ Active</p>
              </div>
              <div className="listing-card">
                <div className="listing-image">🏖️</div>
                <h3>Coastal Cottage</h3>
                <p>Costa Rica Coast</p>
                <p className="status">✓ Active</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
