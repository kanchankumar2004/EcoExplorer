import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Link } from 'react-router-dom';

// Fix for default marker icons in React Leaflet when bundling
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapWrapper = ({ homestays, destinations }) => {
  // Center of Uttarakhand approximately
  const defaultCenter = [30.0668, 79.0193];
  
  const items = homestays || destinations || [];
  const type = homestays ? 'homestay' : 'destination';

  return (
    <div style={{ height: '600px', width: '100%', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', border: '1px solid rgba(127, 208, 81, 0.2)' }}>
      <MapContainer center={defaultCenter} zoom={8} style={{ height: '100%', width: '100%', zIndex: 1 }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {items.map((item) => {
          const id = item._id || item.id;
          const priceText = type === 'homestay' ? `$${item.pricePerNight} / night` : item.price;
          const linkPath = type === 'homestay' ? `/homestays/${id}` : `/destinations/${id}`;
          
          // Ensure valid coordinates
          if (!item.latitude || !item.longitude) return null;

          return (
            <Marker 
              key={id} 
              position={[item.latitude, item.longitude]}
            >
              <Popup>
                <div style={{ textAlign: 'center', width: '180px' }}>
                  <h4 style={{ margin: '0 0 5px 0', fontSize: '1rem', color: '#1f2937', fontWeight: 'bold' }}>{item.name}</h4>
                  <p style={{ margin: '0 0 10px 0', color: '#7fd051', fontWeight: 'bold' }}>{priceText}</p>
                  <img src={item.image} alt={item.name} style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }} />
                  <Link to={linkPath} style={{ display: 'block', background: '#7fd051', color: 'white', padding: '6px 12px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', transition: 'background 0.3s' }}>
                    View Details
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapWrapper;
