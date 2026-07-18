import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Hero from '../components/Hero';
import SearchBar from '../components/SearchBar';
import DestinationCard from '../components/DestinationCard';
import MapWrapper from '../components/MapWrapper';
import './Destinations.css';

const Destinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/destinations');
        setDestinations(response.data);
      } catch (error) {
        console.error('Error fetching destinations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  const handleSearch = (query, filters) => {
    console.log('Searching:', query, filters);
  };

  return (
    <div className="destinations-page">
      <Hero 
        title="Discover Destinations"
        subtitle="Explore sustainable tourism destinations around the world"
      />

      <SearchBar onSearch={handleSearch} searchType="destination" />

      <div className="destinations-container">
        <div className="destinations-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>All Destinations ({destinations.length})</h2>
          
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
          <p>Loading destinations...</p>
        ) : viewMode === 'grid' ? (
          <div className="destinations-grid">
            {destinations.map(destination => (
              <DestinationCard key={destination._id} id={destination._id} {...destination} />
            ))}
          </div>
        ) : (
          <div className="destinations-map-container" style={{ marginTop: '20px' }}>
            <MapWrapper destinations={destinations} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Destinations;
