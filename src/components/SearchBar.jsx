import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch, placeholder = 'Search destinations, homestays...', searchType = 'all' }) => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({
    type: searchType,
    priceRange: 'all',
    rating: 'all'
  });

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(query, filters);
  };

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="search-container">
      <form className="search-bar" onSubmit={handleSearch}>
        <div className="search-input-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder={placeholder}
            value={query}
            onChange={handleQueryChange}
          />
          <button type="submit" className="search-btn">
            🔍 Search
          </button>
        </div>

        <div className="search-filters">
          <select 
            name="type" 
            value={filters.type} 
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="all">All Types</option>
            <option value="destination">Destinations</option>
            <option value="homestay">Homestays</option>
          </select>

          <select 
            name="priceRange" 
            value={filters.priceRange} 
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="all">All Prices</option>
            <option value="0-100">$0 - $100</option>
            <option value="100-300">$100 - $300</option>
            <option value="300-600">$300 - $600</option>
            <option value="600+">$600+</option>
          </select>

          <select 
            name="rating" 
            value={filters.rating} 
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="all">All Ratings</option>
            <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
            <option value="4">⭐⭐⭐⭐ 4+ Stars</option>
            <option value="3">⭐⭐⭐ 3+ Stars</option>
          </select>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
