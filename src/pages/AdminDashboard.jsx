import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Loader, Toast } from '../components/ui';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { token } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get('/api/admin/stats', config);
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch admin stats:', error);
        setToast({
          message: error.response?.data?.message || 'Failed to load administrative analytics from server',
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchAdminData();
    } else {
      setLoading(false);
    }
  }, [token]);

  const recentUsers = data?.recentUsers || [];
  const filteredUsers = recentUsers.filter(u => 
    !searchTerm.trim() || 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <div className="header-actions">
            <input 
              type="text" 
              placeholder="Filter users..." 
              className="search-box" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '60px 0', textAlign: 'center' }}>
            <Loader size="lg" text="Loading real-time admin analytics..." />
          </div>
        ) : (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-icon">👥</span>
                <div className="stat-content">
                  <p className="stat-label">Total Users</p>
                  <p className="stat-value">{data?.totalUsers ?? 0}</p>
                </div>
              </div>

              <div className="stat-card">
                <span className="stat-icon">🏠</span>
                <div className="stat-content">
                  <p className="stat-label">Total Listings</p>
                  <p className="stat-value">{data?.totalListings ?? 0}</p>
                </div>
              </div>

              <div className="stat-card">
                <span className="stat-icon">📅</span>
                <div className="stat-content">
                  <p className="stat-label">Total Bookings</p>
                  <p className="stat-value">{data?.totalBookings ?? 0}</p>
                </div>
              </div>

              <div className="stat-card">
                <span className="stat-icon">💰</span>
                <div className="stat-content">
                  <p className="stat-label">Platform Revenue</p>
                  <p className="stat-value">{data?.revenue ?? '$0'}</p>
                </div>
              </div>
            </div>

            <div className="admin-content">
              <div className="admin-section">
                <h2>Recent Users ({filteredUsers.length})</h2>
                {filteredUsers.length === 0 ? (
                  <p style={{ color: '#888', marginTop: '10px' }}>No users found.</p>
                ) : (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u) => (
                        <tr key={u._id}>
                          <td>{u.name}</td>
                          <td>{u.email}</td>
                          <td>
                            <span className={`badge ${u.userType === 'admin' ? 'admin' : 'active'}`}>
                              {u.userType || 'traveler'}
                            </span>
                          </td>
                          <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              <div className="admin-section">
                <h2>System Overview</h2>
                <ul className="report-list">
                  <li>
                    <span>Destinations Count</span>
                    <span className="report-count">{data?.reports?.totalDestinations ?? 0}</span>
                  </li>
                  <li>
                    <span>Homestays Count</span>
                    <span className="report-count">{data?.reports?.totalHomestays ?? 0}</span>
                  </li>
                  <li>
                    <span>Pending Bookings</span>
                    <span className="report-count">{data?.reports?.pendingBookings ?? 0}</span>
                  </li>
                  <li>
                    <span>Canceled Bookings</span>
                    <span className="report-count">{data?.reports?.canceledBookings ?? 0}</span>
                  </li>
                </ul>
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
    </div>
  );
};

export default AdminDashboard;
