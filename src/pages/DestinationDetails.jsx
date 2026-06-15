import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReviewCard from '../components/ReviewCard';
import MapView from '../components/MapView';
import { destinations } from '../utils/mockData';
import './DestinationDetails.css';

const DestinationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  const destinationId = parseInt(id, 10);
  const foundDestination = destinations.find(d => d.id === destinationId) || destinations[0];

  const destination = {
    ...foundDestination,
    reviews: foundDestination.reviewsList || []
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="destination-details">
      <div className="details-hero">
        <img src={destination.image} alt={destination.name} />
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>{destination.name}</h1>
            <p>{destination.location}</p>
          </div>
          <button 
            className={`favorite-btn ${isFavorite ? 'active' : ''}`}
            onClick={handleFavorite}
          >
            {isFavorite ? '❤️ Saved' : '🤍 Save'}
          </button>
        </div>
      </div>

      <div className="details-container">
        <div className="details-main">
          <div className="details-section">
            <h2>About</h2>
            <p>{destination.longDescription}</p>
          </div>

          <div className="details-section">
            <h2>Highlights</h2>
            <ul className="highlights-list">
              {destination.highlights.map((highlight, idx) => (
                <li key={idx}>✓ {highlight}</li>
              ))}
            </ul>
          </div>

          <div className="details-section">
            <h2>Location</h2>
            <MapView 
              latitude={destination.latitude}
              longitude={destination.longitude}
              title={destination.name}
              height="300px"
            />
          </div>

          <div className="details-section">
            <h2>Reviews ({destination.reviews.length})</h2>
            {destination.reviews.map(review => (
              <ReviewCard key={review.id} {...review} />
            ))}
          </div>
        </div>

        <div className="details-sidebar">
          <div className="sticky-sidebar">
            <div className="detail-booking-card">
              <div className="price-section">
                <span className="price">{destination.price}</span>
                <span className="rating">⭐ {destination.rating} ({destination.reviewsCount} reviews)</span>
              </div>

              <div className="amenities-section">
                <h3>Included</h3>
                {destination.amenities.map((amenity, idx) => (
                  <p key={idx}>• {amenity}</p>
                ))}
              </div>

              <button className="book-btn">Book Now</button>
              <button className="contact-btn">Contact Host</button>
            </div>

            <div className="share-section">
              <h3>Share</h3>
              <div className="share-buttons">
                <button className="share-btn">Facebook</button>
                <button className="share-btn">Twitter</button>
                <button className="share-btn">Email</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetails;
