import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Hero from '../components/Hero';
import SearchBar from '../components/SearchBar';
import DestinationCard from '../components/DestinationCard';
import HomestayCard from '../components/HomestayCard';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [homestays, setHomestays] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [destRes, homeRes] = await Promise.all([
          axios.get('/api/destinations'),
          axios.get('/api/homestays')
        ]);
        setDestinations(destRes.data);
        setHomestays(homeRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (query, filters) => {
    setSearchResults({ query, filters });
  };

  const clearSearch = () => {
    setSearchResults(null);
  };

  const parsePrice = (priceVal) => {
    if (typeof priceVal === 'number') return priceVal;
    if (!priceVal) return 0;
    const match = String(priceVal).match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  };

  const getFilteredResults = () => {
    if (!searchResults) return { filteredDestinations: [], filteredHomestays: [] };
    const { query, filters } = searchResults;
    const lowerQuery = query.toLowerCase();

    const matchesQuery = (item) => {
      if (!query) return true;
      return (
        item.name.toLowerCase().includes(lowerQuery) || 
        item.location.toLowerCase().includes(lowerQuery) || 
        (item.tags && item.tags.some(t => t.toLowerCase().includes(lowerQuery)))
      );
    };

    const matchesPrice = (item) => {
      if (filters.priceRange === 'all') return true;
      const price = parsePrice(item.price || item.pricePerNight);
      if (filters.priceRange === '0-100') return price >= 0 && price <= 100;
      if (filters.priceRange === '100-300') return price > 100 && price <= 300;
      if (filters.priceRange === '300-600') return price > 300 && price <= 600;
      if (filters.priceRange === '600+') return price > 600;
      return true;
    };

    const matchesRating = (item) => {
      if (filters.rating === 'all') return true;
      const rating = Number(filters.rating);
      return item.rating >= rating;
    };

    let filteredDestinations = destinations.filter(d => matchesQuery(d) && matchesPrice(d) && matchesRating(d));
    let filteredHomestays = homestays.filter(h => matchesQuery(h) && matchesPrice(h) && matchesRating(h));

    if (filters.type === 'destination') {
      filteredHomestays = [];
    } else if (filters.type === 'homestay') {
      filteredDestinations = [];
    }

    return { filteredDestinations, filteredHomestays };
  };

  const featuredDestinations = destinations.slice(0, 3);
  const featuredHomestays = homestays.slice(0, 3);

  const { filteredDestinations, filteredHomestays } = getFilteredResults();
  const hasSearchResults = searchResults !== null;
  const noResultsFound = hasSearchResults && filteredDestinations.length === 0 && filteredHomestays.length === 0;

  return (
    <div className="home">
      <Hero 
        title="Welcome to EcoExplorer"
        subtitle="Discover sustainable tourism destinations and authentic homestays"
      />

      <SearchBar onSearch={handleSearch} />

      {hasSearchResults ? (
        <div className="search-results-section" style={{ padding: '40px 5%', maxWidth: '1200px', margin: '0 auto' }}>
          <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Search Results</h2>
            <button onClick={clearSearch} style={{ padding: '8px 16px', background: '#e0e0e0', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
              Clear Search
            </button>
          </div>

          {noResultsFound ? (
            <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '1.2rem', color: '#666' }}>No results found matching your criteria.</p>
          ) : (
            <>
              {filteredDestinations.length > 0 && (
                <div style={{ marginBottom: '40px' }}>
                  <h3 style={{ marginBottom: '20px', fontSize: '1.5rem', color: 'var(--text-title)' }}>Destinations ({filteredDestinations.length})</h3>
                  <div className="cards-grid">
                    {filteredDestinations.map(destination => (
                      <DestinationCard key={destination._id || destination.id} id={destination._id || destination.id} {...destination} />
                    ))}
                  </div>
                </div>
              )}

              {filteredHomestays.length > 0 && (
                <div>
                  <h3 style={{ marginBottom: '20px', fontSize: '1.5rem', color: 'var(--text-title)' }}>Homestays ({filteredHomestays.length})</h3>
                  <div className="cards-grid">
                    {filteredHomestays.map(homestay => (
                      <HomestayCard key={homestay._id || homestay.id} id={homestay._id || homestay.id} {...homestay} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <>
          <div className="featured-section">
            <div className="section-header">
              <h2>Featured Destinations</h2>
              <p>Explore the most popular eco-tourism destinations</p>
            </div>

            {loading ? (
              <p>Loading destinations...</p>
            ) : (
              <div className="cards-grid">
                {featuredDestinations.map(destination => (
                  <DestinationCard key={destination._id || destination.id} id={destination._id || destination.id} {...destination} />
                ))}
              </div>
            )}
          </div>

          <div className="featured-section">
            <div className="section-header">
              <h2>Featured Homestays</h2>
              <p>Stay with local hosts and experience authentic hospitality</p>
            </div>

            {loading ? (
              <p>Loading homestays...</p>
            ) : (
              <div className="cards-grid">
                {featuredHomestays.map(homestay => (
                  <HomestayCard key={homestay._id || homestay.id} id={homestay._id || homestay.id} {...homestay} />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      <div className="cta-section">
        <h2>Ready to Start Your Eco Adventure?</h2>
        <p>Join thousands of travelers exploring sustainable tourism</p>
        <button className="cta-btn" onClick={() => navigate('/destinations')}>Explore Now</button>
      </div>
    </div>
  );
};

export default Home;
