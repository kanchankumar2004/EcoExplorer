import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './MapView.css';

// Fix for default marker icons in React Leaflet when bundling
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapView = ({ latitude, longitude, title, height = '400px' }) => {
  // Ensure valid coordinates
  if (!latitude || !longitude) {
    return (
      <div className="map-view" style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', borderRadius: '12px' }}>
        <p>Location coordinates not available.</p>
      </div>
    );
  }

  const position = [latitude, longitude];

  return (
    <div className="map-view" style={{ height, borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 15px -5px rgba(0, 0, 0, 0.1)', border: '1px solid rgba(127, 208, 81, 0.2)' }}>
      <MapContainer center={position} zoom={12} style={{ height: '100%', width: '100%', zIndex: 1 }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            <div style={{ textAlign: 'center' }}>
              <h4 style={{ margin: '0 0 5px 0', fontSize: '1rem', color: '#1f2937', fontWeight: 'bold' }}>{title || 'Location'}</h4>
              <p style={{ margin: '0', fontSize: '0.85rem', color: '#666' }}>Lat: {latitude.toFixed(4)}, Lng: {longitude.toFixed(4)}</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapView;
