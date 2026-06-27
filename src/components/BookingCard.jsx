import React from 'react';
import { useNavigate } from 'react-router-dom';
import { destinations, homestays } from '../utils/mockData';
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
  image,
  onCancel,
  onDelete
}) => {
  const navigate = useNavigate();

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    // If it's already a formatted string (like "March 15, 2024"), keep it.
    if (isNaN(Date.parse(dateStr)) || dateStr.includes(',')) return dateStr;
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' };
      return new Date(dateStr).toLocaleDateString('en-US', options);
    } catch (e) {
      return dateStr;
    }
  };

  const handleViewDetails = () => {
    if (type === 'Homestay') {
      const homestay = homestays.find(h => h.name === name);
      if (homestay) {
        navigate(`/homestays/${homestay.id}`);
      } else {
        alert('Homestay details not found.');
      }
    } else if (type === 'Destination') {
      const destination = destinations.find(d => d.name === name);
      if (destination) {
        navigate(`/destinations/${destination.id}`);
      } else {
        alert('Destination details not found.');
      }
    }
  };

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
            <span className="detail-value">{formatDate(checkIn)}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">📅 Check-out:</span>
            <span className="detail-value">{formatDate(checkOut)}</span>
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
          <button className="btn btn-primary" onClick={handleViewDetails}>View Details</button>
          {status !== 'Cancelled' ? (
            <button className="btn btn-secondary" onClick={() => onCancel && onCancel(id)}>Cancel Booking</button>
          ) : (
            <button className="btn btn-secondary" disabled>Cancelled</button>
          )}
          <button className="btn btn-danger" style={{ marginLeft: 'auto' }} onClick={() => onDelete && onDelete(id)}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
