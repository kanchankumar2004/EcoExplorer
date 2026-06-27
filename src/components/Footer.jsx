import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4>About EcoExplorer</h4>
          <p>
            Discover sustainable tourism destinations and authentic homestays around the world.
          </p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/destinations">Destinations</Link></li>
            <li><Link to="/homestays">Homestays</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 >Follow Us</h4>
          <div className="social-links">
            <a href="#facebook">Facebook</a>
           
            <a href="#instagram">Instagram</a>
            
            <a href="#linkedin">LinkedIn</a>
            
          </div>
        </div>

        <div className="footer-section">
          <h4>Contact Info</h4>
          <p>Email:kanchankumarmandal2004@gmail.com</p>
          <p>Phone: +91 6207239405</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2026 EcoExplorer. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
