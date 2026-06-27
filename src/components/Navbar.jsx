import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
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
