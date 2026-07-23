import React, { useState, useEffect } from 'react';
import DestinationCard from '../components/DestinationCard';
import HomestayCard from '../components/HomestayCard';
import { useFavorites } from '../context/FavoritesContext';
import { Loader, Toast } from '../components/ui';
import './Favorites.css';

const Favorites = () => {
  const { favorites, removeFavorite } = useFavorites();
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleRemove = (id) => {
    removeFavorite(id);
    setToast({ message: 'Item removed from favorites', type: 'info' });
  };

  const destinations = favorites.filter(f => f.type === 'destination');
  const homestays = favorites.filter(f => f.type === 'homestay');

  if (loading) {
    return (
      <div className="favorites-page" style={{ padding: '80px 0', textAlign: 'center' }}>
        <Loader size="lg" text="Loading your saved favorites..." />
      </div>
    );
  }

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
              {destinations.map((item) => (
                <div key={item.id || item._id} className="favorite-item">
                  <DestinationCard {...item} id={item.id || item._id} />
                  <button 
                    className="remove-btn"
                    onClick={() => handleRemove(item.id || item._id)}
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
              {homestays.map((item) => (
                <div key={item.id || item._id} className="favorite-item">
                  <HomestayCard {...item} id={item.id || item._id} />
                  <button 
                    className="remove-btn"
                    onClick={() => handleRemove(item.id || item._id)}
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

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
};

export default Favorites;
