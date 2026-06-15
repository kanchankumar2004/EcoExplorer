import React from 'react';
import './ReviewCard.css';

const ReviewCard = ({
  id,
  author,
  rating = 4.5,
  date,
  title,
  text,
  images = [],
  helpful = 0
}) => {
  const [isHelpful, setIsHelpful] = React.useState(false);

  const handleHelpful = () => {
    setIsHelpful(!isHelpful);
  };

  const renderStars = (rating) => {
    return '⭐'.repeat(Math.floor(rating)) + (rating % 1 !== 0 ? '½' : '');
  };

  return (
    <div className="review-card">
      <div className="review-header">
        <div className="review-author">
          <h4 className="author-name">{author}</h4>
          <span className="review-date">{date}</span>
        </div>
        <div className="review-rating">
          <span className="stars">{renderStars(rating)}</span>
          <span className="rating-value">{rating}</span>
        </div>
      </div>

      <h3 className="review-title">{title}</h3>
      <p className="review-text">{text}</p>

      {images.length > 0 && (
        <div className="review-images">
          {images.map((img, idx) => (
            <img key={idx} src={img} alt="Review" className="review-image" />
          ))}
        </div>
      )}

      <div className="review-footer">
        <button 
          className={`helpful-btn ${isHelpful ? 'active' : ''}`}
          onClick={handleHelpful}
        >
          👍 Helpful ({helpful + (isHelpful ? 1 : 0)})
        </button>
      </div>
    </div>
  );
};

export default ReviewCard;
