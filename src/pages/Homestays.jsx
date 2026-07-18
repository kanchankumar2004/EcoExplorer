import React, { useState } from 'react';
import Hero from '../components/Hero';
import SearchBar from '../components/SearchBar';
import HomestayCard from '../components/HomestayCard';
import MapWrapper from '../components/MapWrapper';
import { homestays as mockHomestays } from '../utils/mockData';
import './Homestays.css';

const Homestays = () => {
  const [homestays] = useState(mockHomestays);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'

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
          <h2>Available Homestays ({homestays.length})</h2>
          
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

        {viewMode === 'grid' ? (
          <div className="homestays-grid">
            {homestays.map(homestay => (
              <HomestayCard key={homestay.id} {...homestay} />
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
