import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import SearchBar from '../components/SearchBar';
import HomestayCard from '../components/HomestayCard';
import axios from 'axios';
import MapWrapper from '../components/MapWrapper';
import { Loader, Toast } from '../components/ui';
import './Homestays.css';

const Homestays = () => {
  const [homestays, setHomestays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [searchParams, setSearchParams] = useState({ query: '', filters: { priceRange: 'all', rating: 'all' } });
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchHomestays = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/homestays');
        setHomestays(res.data);
      } catch (err) {
        console.error('Error fetching homestays:', err);
        setToast({
          message: err.response?.data?.message || 'Failed to load homestays from backend server.',
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    };
    fetchHomestays();
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

  const filteredHomestays = homestays.filter((item) => {
    const { query, filters } = searchParams;
    const lowerQuery = (query || '').toLowerCase();

    const matchesQuery = !query || 
      (item.name && item.name.toLowerCase().includes(lowerQuery)) ||
      (item.location && item.location.toLowerCase().includes(lowerQuery)) ||
      (item.tags && item.tags.some(t => t.toLowerCase().includes(lowerQuery)));

    if (!matchesQuery) return false;

    if (filters?.priceRange && filters.priceRange !== 'all') {
      const price = parsePrice(item.pricePerNight || item.price);
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
    <div className="homestays-page">
      <Hero 
        title="Find Your Perfect Homestay"
        subtitle="Experience authentic hospitality and cultural immersion"
      />

      <SearchBar onSearch={handleSearch} searchType="homestay" />

      <div className="homestays-container">
        <div className="homestays-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Available Homestays {loading ? '' : `(${filteredHomestays.length})`}</h2>
          
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
            <Loader size="lg" text="Loading authentic homestays..." />
          </div>
        ) : filteredHomestays.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#666' }}>
            <p style={{ fontSize: '1.2rem' }}>No homestays matching your search criteria.</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="homestays-grid">
            {filteredHomestays.map(homestay => (
              <HomestayCard key={homestay._id || homestay.id} {...homestay} id={homestay._id || homestay.id} />
            ))}
          </div>
        ) : (
          <div className="homestays-map-container" style={{ marginTop: '20px' }}>
            <MapWrapper homestays={filteredHomestays} />
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

export default Homestays;
