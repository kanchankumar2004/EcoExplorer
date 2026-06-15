import React from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const stats = {
    totalUsers: 1250,
    totalListings: 856,
    totalBookings: 3420,
    revenue: '$125,400'
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <div className="header-actions">
            <input type="text" placeholder="Search..." className="search-box" />
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-icon">👥</span>
            <div className="stat-content">
              <p className="stat-label">Total Users</p>
              <p className="stat-value">{stats.totalUsers}</p>
            </div>
          </div>

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
              <p className="stat-label">Platform Revenue</p>
              <p className="stat-value">{stats.revenue}</p>
            </div>
          </div>
        </div>

        <div className="admin-content">
          <div className="admin-section">
            <h2>Recent Users</h2>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>John Doe</td>
                  <td>john@example.com</td>
                  <td><span className="badge active">Active</span></td>
                  <td>2024-01-15</td>
                </tr>
                <tr>
                  <td>Sarah Wilson</td>
                  <td>sarah@example.com</td>
                  <td><span className="badge active">Active</span></td>
                  <td>2024-01-10</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="admin-section">
            <h2>Reports</h2>
            <ul className="report-list">
              <li>
                <a href="#disputed-bookings">Disputed Bookings</a>
                <span className="report-count">3</span>
              </li>
              <li>
                <a href="#flagged-listings">Flagged Listings</a>
                <span className="report-count">5</span>
              </li>
              <li>
                <a href="#user-complaints">User Complaints</a>
                <span className="report-count">2</span>
              </li>
              <li>
                <a href="#payment-issues">Payment Issues</a>
                <span className="report-count">1</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
