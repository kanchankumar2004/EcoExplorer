import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Hero from '../components/Hero';
import SearchBar from '../components/SearchBar';
import DestinationCard from '../components/DestinationCard';
import MapWrapper from '../components/MapWrapper';
import { Loader, Toast } from '../components/ui';
import './Destinations.css';

const Destinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [searchParams, setSearchParams] = useState({ query: '', filters: { priceRange: 'all', rating: 'all' } });
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/destinations');
        setDestinations(response.data);
      } catch (error) {
        console.error('Error fetching destinations:', error);
        setToast({
          message: error.response?.data?.message || 'Failed to load destinations from backend server.',
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  const handleSearch = (query, filters) => {
    setSearchParams({ query, filters });
  };

  const parsePrice = (priceVal) => {
    if (typeof priceVal === 'number') return priceVal;
    if (!priceVal) return 0;
    const match = String(priceVal).match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  };

  const filteredDestinations = destinations.filter((item) => {
    const { query, filters } = searchParams;
    const lowerQuery = (query || '').toLowerCase();

    const matchesQuery = !query || 
      (item.name && item.name.toLowerCase().includes(lowerQuery)) ||
      (item.location && item.location.toLowerCase().includes(lowerQuery)) ||
      (item.tags && item.tags.some(t => t.toLowerCase().includes(lowerQuery)));

    if (!matchesQuery) return false;

    if (filters?.priceRange && filters.priceRange !== 'all') {
      const price = parsePrice(item.price);
      if (filters.priceRange === '0-100' && (price < 0 || price > 100)) return false;
      if (filters.priceRange === '100-300' && (price <= 100 || price > 300)) return false;
      if (filters.priceRange === '300-600' && (price <= 300 || price > 600)) return false;
      if (filters.priceRange === '600+' && price <= 600) return false;
    }

    if (filters?.rating && filters.rating !== 'all') {
      const minRating = Number(filters.rating);
      if ((item.rating || 0) < minRating) return false;
    }

    return true;
  });

  return (
    <div className="destinations-page">
      <Hero 
        title="Discover Destinations"
        subtitle="Explore sustainable tourism destinations around the world"
      />

      <SearchBar onSearch={handleSearch} searchType="destination" />

      <div className="destinations-container">
        <div className="destinations-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>All Destinations ({filteredDestinations.length})</h2>
          
          <div className="view-toggle">
            <button 
              className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <i className="fas fa-th-large"></i> Grid
            </button>
            <button 
              className={`toggle-btn ${viewMode === 'map' ? 'active' : ''}`}
              onClick={() => setViewMode('map')}
            >
              <i className="fas fa-map-marked-alt"></i> Map
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '60px 0', textAlign: 'center' }}>
            <Loader size="lg" text="Loading eco-destinations..." />
          </div>
        ) : filteredDestinations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#666' }}>
            <p style={{ fontSize: '1.2rem' }}>No destinations matching your search criteria.</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="destinations-grid">
            {filteredDestinations.map(destination => (
              <DestinationCard key={destination._id || destination.id} id={destination._id || destination.id} {...destination} />
            ))}
          </div>
        ) : (
          <div className="destinations-map-container" style={{ marginTop: '20px' }}>
            <MapWrapper destinations={filteredDestinations} />
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

export default Destinations;
