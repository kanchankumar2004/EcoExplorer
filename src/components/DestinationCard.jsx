import React from 'react';
import { Link } from 'react-router-dom';
import './DestinationCard.css';

const DestinationCard = ({ 
  id, 
  name, 
  image, 
  description, 
  rating = 4.5, 
  reviews = 0,
  price = 'From $50',
  tags = []
}) => {
  return (
    <Link to={`/destinations/${id}`} className="destination-card">
      <div className="card-image-wrapper">
        <img src={image} alt={name} className="card-image" />
        <div className="card-badge">Featured</div>
      </div>
      
      <div className="card-content">
        <h3 className="card-title">{name}</h3>
        
        <p className="card-description">{description}</p>
        
        <div className="card-tags">
          {tags.map((tag, idx) => (
            <span key={idx} className="tag">{tag}</span>
          ))}
        </div>

        <div className="card-footer">
          <div className="card-rating">
            <span className="stars">⭐ {rating}</span>
            <span className="reviews">({reviews})</span>
          </div>
          <div className="card-price">{price}</div>
        </div>
      </div>
    </Link>
  );
};

export default DestinationCard;
