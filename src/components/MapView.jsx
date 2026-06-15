import React from 'react';
import './MapView.css';

const MapView = ({ latitude, longitude, title, height = '400px' }) => {
  return (
    <div className="map-view" style={{ height }}>
      <div className="map-placeholder">
        <div className="map-content">
          <p>🗺️</p>
          <p>Map View</p>
          <p style={{ fontSize: '0.9rem', color: '#999' }}>
            Location: {latitude.toFixed(4)}, {longitude.toFixed(4)}
          </p>
          {title && <p style={{ fontSize: '0.95rem', fontWeight: 'bold' }}>{title}</p>}
          <p style={{ fontSize: '0.8rem', color: '#ccc', marginTop: '1rem' }}>
            (Integrate Google Maps or Leaflet.js for full functionality)
          </p>
        </div>
      </div>
    </div>
  );
};

export default MapView;
