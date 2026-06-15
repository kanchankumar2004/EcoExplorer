import React, { useState } from 'react';
import Hero from '../components/Hero';
import SearchBar from '../components/SearchBar';
import HomestayCard from '../components/HomestayCard';
import { homestays as mockHomestays } from '../utils/mockData';
import './Homestays.css';

const Homestays = () => {
  const [homestays] = useState(mockHomestays);

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
        <div className="homestays-header">
          <h2>Available Homestays ({homestays.length})</h2>
        </div>

        <div className="homestays-grid">
          {homestays.map(homestay => (
            <HomestayCard key={homestay.id} {...homestay} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Homestays;
