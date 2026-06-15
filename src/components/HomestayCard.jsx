import React from 'react';
import { Link } from 'react-router-dom';
import './HomestayCard.css';

const HomestayCard = ({
  id,
  name,
  image,
  location,
  description,
  rating = 4.5,
  reviews = 0,
  pricePerNight = 80,
  maxGuests = 4,
  amenities = []
}) => {
  return (
    <Link to={`/homestays/${id}`} className="homestay-card">
      <div className="card-image-wrapper">
        <img src={image} alt={name} className="card-image" />
        <div className="homestay-badge">Homestay</div>
      </div>

      <div className="card-content">
        <h3 className="card-title">{name}</h3>
        <p className="card-location">📍 {location}</p>
        
        <p className="card-description">{description}</p>

        <div className="card-amenities">
          {amenities.slice(0, 3).map((amenity, idx) => (
            <span key={idx} className="amenity">{amenity}</span>
          ))}
        </div>

        <div className="card-info">
          <span className="guests">👥 {maxGuests} guests</span>
        </div>

        <div className="card-footer">
          <div className="card-rating">
            <span className="stars">⭐ {rating}</span>
            <span className="reviews">({reviews})</span>
          </div>
          <div className="card-price">${pricePerNight}/night</div>
        </div>
      </div>
    </Link>
  );
};

export default HomestayCard;
