import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

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
            <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/destinations" className="nav-link" onClick={() => setMenuOpen(false)}>
              Destinations
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/homestays" className="nav-link" onClick={() => setMenuOpen(false)}>
              Homestays
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/travel-planner" className="nav-link" onClick={() => setMenuOpen(false)}>
              Travel Planner
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/showcase" className="nav-link" onClick={() => setMenuOpen(false)}>
              Showcase
            </Link>
          </li>
          
          {isAuthenticated ? (
            <>
              <li className="nav-item">
                <Link to="/favorites" className="nav-link" onClick={() => setMenuOpen(false)}>
                  Favorites
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/my-bookings" className="nav-link" onClick={() => setMenuOpen(false)}>
                  My Bookings
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/profile" className="nav-link" onClick={() => setMenuOpen(false)}>
                  Profile
                </Link>
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
                <Link to="/login" className="nav-link" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link nav-link-btn" onClick={() => setMenuOpen(false)}>
                  Register
                </Link>
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
