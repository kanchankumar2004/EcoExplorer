import React, { useState } from 'react';
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
  guests = 1,
  totalPrice,
  status = 'Confirmed',
  image,
  onCancel,
  onDelete,
  onUpdate
}) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editCheckIn, setEditCheckIn] = useState(checkIn ? checkIn.split('T')[0] : '');
  const [editCheckOut, setEditCheckOut] = useState(checkOut ? checkOut.split('T')[0] : '');
  const [editGuests, setEditGuests] = useState(guests);
  const [updating, setUpdating] = useState(false);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    if (isNaN(Date.parse(dateStr)) || dateStr.includes(',')) return dateStr;
    try {
      const options = { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' };
      return new Date(dateStr).toLocaleDateString('en-US', options);
    } catch (e) {
      return dateStr;
    }
  };

  const handleViewDetails = async () => {
    const route = type === 'Homestay' ? 'homestays' : 'destinations';

    if (itemId) {
      navigate(`/${route}/${itemId}`);
      return;
    }

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

  const origNights = (checkIn && checkOut && !isNaN(new Date(checkOut) - new Date(checkIn)))
    ? Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 3600 * 24)))
    : 1;
  const origGuests = Number(guests) || 1;
  const baseRate = (totalPrice && origNights && origGuests) ? (totalPrice / (origNights * origGuests)) : 45;

  const currentEditNights = (editCheckIn && editCheckOut && !isNaN(new Date(editCheckOut) - new Date(editCheckIn)))
    ? Math.max(1, Math.ceil((new Date(editCheckOut) - new Date(editCheckIn)) / (1000 * 3600 * 24)))
    : 1;
  const numGuests = Number(editGuests) || 1;
  const estimatedTotal = Math.round(baseRate * currentEditNights * numGuests);

  const handleSaveUpdate = async (e) => {
    e.preventDefault();
    if (onUpdate) {
      setUpdating(true);
      await onUpdate(id, { 
        checkIn: editCheckIn, 
        checkOut: editCheckOut, 
        guests: editGuests,
        totalPrice: estimatedTotal
      });
      setUpdating(false);
      setIsEditing(false);
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

        {isEditing ? (
          <form onSubmit={handleSaveUpdate} style={{ display: 'grid', gap: '8px', margin: '8px 0' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '0.75rem', color: '#64748b' }}>Check-in Date</label>
              <input 
                type="date" 
                value={editCheckIn} 
                onChange={(e) => setEditCheckIn(e.target.value)} 
                required 
                style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '0.75rem', color: '#64748b' }}>Check-out Date</label>
              <input 
                type="date" 
                value={editCheckOut} 
                onChange={(e) => setEditCheckOut(e.target.value)} 
                required 
                style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontSize: '0.75rem', color: '#64748b' }}>Guests</label>
              <input 
                type="number" 
                min="1" 
                max="10"
                value={editGuests} 
                onChange={(e) => setEditGuests(parseInt(e.target.value, 10))} 
                required 
                style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
              />
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#16a34a', marginTop: '4px' }}>
              Est. Total ({currentEditNights} night{currentEditNights > 1 ? 's' : ''}): ${estimatedTotal}
            </div>
            <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
              <button type="submit" className="btn btn-primary" disabled={updating}>
                {updating ? 'Saving...' : 'Save Changes'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
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
              <span className="detail-value">{guests} guest{guests > 1 ? 's' : ''}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">💰 Total:</span>
              <span className="detail-value">${totalPrice}</span>
            </div>
          </div>
        )}

        <div className="booking-actions">
          <button className="btn btn-primary" onClick={handleViewDetails}>Details</button>
          {onUpdate && !isEditing && (
            <button className="btn btn-secondary" onClick={() => setIsEditing(true)}>Edit</button>
          )}
          {status !== 'Cancelled' ? (
            <button className="btn btn-warning" onClick={() => onCancel && onCancel(id)}>Cancel</button>
          ) : (
            <button className="btn btn-secondary" disabled>Cancelled</button>
          )}
          <button className="btn btn-danger" onClick={() => onDelete && onDelete(id)}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
