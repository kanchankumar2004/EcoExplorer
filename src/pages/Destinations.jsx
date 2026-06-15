import React, { useState } from 'react';
import Hero from '../components/Hero';
import SearchBar from '../components/SearchBar';
import DestinationCard from '../components/DestinationCard';
import { destinations as mockDestinations } from '../utils/mockData';
import './Destinations.css';

const Destinations = () => {
  const [destinations, setDestinations] = useState(mockDestinations);

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

        <div className="destinations-grid">
          {destinations.map(destination => (
            <DestinationCard key={destination.id} {...destination} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Destinations;
