import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BookingCard.css';

const BookingCard = ({
  id,
  itemId,
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

  const handleViewDetails = async () => {
    const route = type === 'Homestay' ? 'homestays' : 'destinations';

    // Use itemId from the booking if available
    if (itemId) {
      navigate(`/${route}/${itemId}`);
      return;
    }

    // Fallback: look up by name from the API
    try {
      const res = await axios.get(`/api/${route}`);
      const match = res.data.find(item => item.name === name);
      if (match) {
        navigate(`/${route}/${match._id}`);
      } else {
        alert(`${type} details not found.`);
      }
    } catch (err) {
      alert(`Could not load ${type.toLowerCase()} details.`);
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
