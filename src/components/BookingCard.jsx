import React from 'react';
import './BookingCard.css';

const BookingCard = ({
  id,
  name,
  type = 'Homestay',
  checkIn,
  checkOut,
  guests,
  totalPrice,
  status = 'Confirmed',
  image
}) => {
  return (
    <div className="booking-card">
      <div className="booking-image">
        <img src={image} alt={name} />
      </div>

      <div className="booking-content">
        <div className="booking-header">
          <div>
            <h3 className="booking-name">{name}</h3>
            <p className="booking-type">{type}</p>
          </div>
          <span className={`booking-status status-${status.toLowerCase()}`}>
            {status}
          </span>
        </div>

        <div className="booking-details">
          <div className="detail-item">
            <span className="detail-label">📅 Check-in:</span>
            <span className="detail-value">{checkIn}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">📅 Check-out:</span>
            <span className="detail-value">{checkOut}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">👥 Guests:</span>
            <span className="detail-value">{guests}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">💰 Total:</span>
            <span className="detail-value">${totalPrice}</span>
          </div>
        </div>

        <div className="booking-actions">
          <button className="btn btn-primary">View Details</button>
          <button className="btn btn-secondary">Cancel Booking</button>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
