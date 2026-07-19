import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, token, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Poll unread message count
  useEffect(() => {
    if (!isAuthenticated || !token) {
      setUnreadCount(0);
      return;
    }

    const fetchUnread = async () => {
      try {
        const { data } = await axios.get('/api/messages/unread-count', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUnreadCount(data.count || 0);
      } catch (err) {
        // Silently fail
      }
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 30000); // Every 30s
    return () => clearInterval(interval);
  }, [isAuthenticated, token]);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          🌿 EcoExplorer
        </Link>
        
        <button className="hamburger" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`nav-menu ${menuOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <NavLink to="/" end className="nav-link" onClick={() => setMenuOpen(false)}>
              Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/destinations" className="nav-link" onClick={() => setMenuOpen(false)}>
              Destinations
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/homestays" className="nav-link" onClick={() => setMenuOpen(false)}>
              Homestays
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/travel-planner" className="nav-link" onClick={() => setMenuOpen(false)}>
              Travel Planner
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/showcase" className="nav-link" onClick={() => setMenuOpen(false)}>
              Showcase
            </NavLink>
          </li>
          
          {isAuthenticated ? (
            <>
              {(user?.userType === 'admin') && (
                <li className="nav-item">
                  <NavLink to="/admin-dashboard" className="nav-link" onClick={() => setMenuOpen(false)}>
                    Admin Panel
                  </NavLink>
                </li>
              )}
              {(user?.userType === 'host' || user?.userType === 'both' || user?.userType === 'admin') && (
                <li className="nav-item">
                  <NavLink to="/owner-dashboard" className="nav-link" onClick={() => setMenuOpen(false)}>
                    Host Dashboard
                  </NavLink>
                </li>
              )}
              <li className="nav-item">
                <NavLink to="/favorites" className="nav-link" onClick={() => setMenuOpen(false)}>
                  Favorites
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/my-bookings" className="nav-link" onClick={() => setMenuOpen(false)}>
                  My Bookings
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/messages" className="nav-link" onClick={() => setMenuOpen(false)}>
                  Messages
                  {unreadCount > 0 && (
                    <span className="nav-messages-badge">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/profile" className="nav-link" onClick={() => setMenuOpen(false)}>
                  Profile
                </NavLink>
              </li>
              <li className="nav-item">
                <button className="nav-link logout-btn" onClick={() => { logout(); setMenuOpen(false); }}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <NavLink to="/login" className="nav-link" onClick={() => setMenuOpen(false)}>
                  Login
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/register" className="nav-link nav-link-btn" onClick={() => setMenuOpen(false)}>
                  Register
                </NavLink>
              </li>
            </>
          )}
          <li className="nav-item theme-toggle-item">
            <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle Theme" aria-label="Toggle Theme">
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

