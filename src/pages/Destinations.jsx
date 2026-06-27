import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Hero from '../components/Hero';
import SearchBar from '../components/SearchBar';
import DestinationCard from '../components/DestinationCard';
import './Destinations.css';

const Destinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

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
        <div className="destinations-header">
          <h2>All Destinations ({destinations.length})</h2>
        </div>

        {loading ? (
          <p>Loading destinations...</p>
        ) : (
          <div className="destinations-grid">
            {destinations.map(destination => (
              <DestinationCard key={destination._id} id={destination._id} {...destination} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Destinations;
