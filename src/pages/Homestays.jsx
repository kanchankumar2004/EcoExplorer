import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import SearchBar from '../components/SearchBar';
import HomestayCard from '../components/HomestayCard';
import axios from 'axios';
import MapWrapper from '../components/MapWrapper';
import './Homestays.css';

const Homestays = () => {
  const [homestays, setHomestays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'

  useEffect(() => {
    const fetchHomestays = async () => {
      try {
        const res = await axios.get('/api/homestays');
        setHomestays(res.data);
      } catch (err) {
        console.error('Error fetching homestays:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomestays();
  }, []);

  const handleSearch = (query, filters) => {
    console.log('Searching:', query, filters);
  };

  return (
    <div className="homestays-page">
      <Hero 
        title="Find Your Perfect Homestay"
        subtitle="Experience authentic hospitality and cultural immersion"
      />

      <SearchBar onSearch={handleSearch} searchType="homestay" />

      <div className="homestays-container">
        <div className="homestays-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Available Homestays {loading ? '' : `(${homestays.length})`}</h2>
          
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
          <div style={{ textAlign: 'center', padding: '50px 0' }}>Loading homestays...</div>
        ) : viewMode === 'grid' ? (
          <div className="homestays-grid">
            {homestays.map(homestay => (
              <HomestayCard key={homestay._id} {...homestay} id={homestay._id} />
            ))}
          </div>
        ) : (
          <div className="homestays-map-container" style={{ marginTop: '20px' }}>
            <MapWrapper homestays={homestays} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Homestays;
