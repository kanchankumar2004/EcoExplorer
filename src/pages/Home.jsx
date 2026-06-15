import React, { useState } from 'react';
import Hero from '../components/Hero';
import SearchBar from '../components/SearchBar';
import DestinationCard from '../components/DestinationCard';
import HomestayCard from '../components/HomestayCard';
import { destinations, homestays } from '../utils/mockData';
import './Home.css';

const Home = () => {
  const [searchResults, setSearchResults] = useState(null);

  const handleSearch = (query, filters) => {
    console.log('Searching for:', query, filters);
    setSearchResults({ query, filters });
  };

  const featuredDestinations = destinations.slice(0, 3);
  const featuredHomestays = homestays.slice(0, 3);

  return (
    <div className="home">
      <Hero 
        title="Welcome to EcoExplorer"
        subtitle="Discover sustainable tourism destinations and authentic homestays"
      />

      <SearchBar onSearch={handleSearch} />

      <div className="featured-section">
        <div className="section-header">
          <h2>Featured Destinations</h2>
          <p>Explore the most popular eco-tourism destinations</p>
        </div>

        <div className="cards-grid">
          {featuredDestinations.map(destination => (
            <DestinationCard key={destination.id} {...destination} />
          ))}
        </div>
      </div>

      <div className="featured-section">
        <div className="section-header">
          <h2>Featured Homestays</h2>
          <p>Stay with local hosts and experience authentic hospitality</p>
        </div>

        <div className="cards-grid">
          {featuredHomestays.map(homestay => (
            <HomestayCard key={homestay.id} {...homestay} />
          ))}
        </div>
      </div>

      <div className="cta-section">
        <h2>Ready to Start Your Eco Adventure?</h2>
        <p>Join thousands of travelers exploring sustainable tourism</p>
        <button className="cta-btn">Explore Now</button>
      </div>
    </div>
  );
};

export default Home;
