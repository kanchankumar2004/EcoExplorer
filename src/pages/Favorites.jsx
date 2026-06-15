import React, { useState } from 'react';
import DestinationCard from '../components/DestinationCard';
import HomestayCard from '../components/HomestayCard';
import { destinations, homestays } from '../utils/mockData';
import './Favorites.css';

const Favorites = () => {
  const [favorites, setFavorites] = useState([
    {
      ...destinations[0],
      type: 'destination'
    },
    {
      ...homestays[0],
      type: 'homestay'
    },
    {
      ...destinations[1],
      type: 'destination'
    }
  ]);

  const handleRemove = (index) => {
    setFavorites(favorites.filter((_, i) => i !== index));
  };

  const destinations = favorites.filter(f => f.type === 'destination');
  const homestays = favorites.filter(f => f.type === 'homestay');

  return (
    <div className="favorites-page">
      <div className="favorites-container">
        <div className="favorites-header">
          <h1>My Favorites</h1>
          <p>You have saved {favorites.length} items</p>
        </div>

        {destinations.length > 0 && (
          <div className="favorites-section">
            <h2>Favorite Destinations ({destinations.length})</h2>
            <div className="favorites-grid">
              {destinations.map((item, idx) => (
                <div key={idx} className="favorite-item">
                  <DestinationCard {...item} />
                  <button 
                    className="remove-btn"
                    onClick={() => handleRemove(idx)}
                  >
                    ✕ Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {homestays.length > 0 && (
          <div className="favorites-section">
            <h2>Favorite Homestays ({homestays.length})</h2>
            <div className="favorites-grid">
              {homestays.map((item, idx) => (
                <div key={idx} className="favorite-item">
                  <HomestayCard {...item} />
                  <button 
                    className="remove-btn"
                    onClick={() => handleRemove(destinations.length + idx)}
                  >
                    ✕ Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {favorites.length === 0 && (
          <div className="empty-state">
            <p>❤️ You haven't saved any favorites yet.</p>
            <p>Start exploring and save destinations and homestays you love!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
