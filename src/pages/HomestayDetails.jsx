import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ReviewCard from '../components/ReviewCard';
import MapView from '../components/MapView';
import { homestays } from '../utils/mockData';
import './HomestayDetails.css';

const HomestayDetails = () => {
  const { id } = useParams();
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedDates, setSelectedDates] = useState({ checkIn: '', checkOut: '' });

  const homestayId = parseInt(id, 10);
  const foundHomestay = homestays.find(h => h.id === homestayId) || homestays[0];

  const homestay = {
    ...foundHomestay,
    reviews: foundHomestay.reviewsList || []
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleBooking = (e) => {
    e.preventDefault();
    console.log('Booking:', selectedDates);
  };

  return (
    <div className="homestay-details">
      <div className="details-hero">
        <img src={homestay.image} alt={homestay.name} />
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>{homestay.name}</h1>
            <p>📍 {homestay.location}</p>
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
            <h2>About This Homestay</h2>
            <p>{homestay.longDescription}</p>
          </div>

          <div className="details-section">
            <h2>Facilities</h2>
            <ul className="facilities-list">
              {homestay.facilities.map((facility, idx) => (
                <li key={idx}>✓ {facility}</li>
              ))}
            </ul>
          </div>

          <div className="details-section">
            <h2>Location</h2>
            <MapView 
              latitude={homestay.latitude}
              longitude={homestay.longitude}
              title={homestay.name}
              height="300px"
            />
          </div>

          <div className="details-section">
            <h2>Guest Reviews ({homestay.reviews.length})</h2>
            {homestay.reviews.map(review => (
              <ReviewCard key={review.id} {...review} />
            ))}
          </div>
        </div>

        <div className="details-sidebar">
          <div className="sticky-sidebar">
            <div className="booking-form-card">
              <div className="price-section">
                <span className="price">${homestay.pricePerNight}/night</span>
                <span className="rating">⭐ {homestay.rating} ({homestay.reviewsCount} reviews)</span>
              </div>

              <form onSubmit={handleBooking} className="booking-form">
                <div className="form-group">
                  <label>Check-in Date</label>
                  <input 
                    type="date" 
                    value={selectedDates.checkIn}
                    onChange={(e) => setSelectedDates({...selectedDates, checkIn: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Check-out Date</label>
                  <input 
                    type="date"
                    value={selectedDates.checkOut}
                    onChange={(e) => setSelectedDates({...selectedDates, checkOut: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Number of Guests</label>
                  <select required>
                    <option value="">Select guests</option>
                    {[1, 2, 3, 4].map(num => (
                      <option key={num} value={num}>{num} guest{num > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>

                <div className="price-breakdown">
                  <p className="breakdown-item">
                    <span>Price per night:</span>
                    <span>${homestay.pricePerNight}</span>
                  </p>
                  <p className="breakdown-item">
                    <span>Number of nights:</span>
                    <span>TBD</span>
                  </p>
                  <p className="breakdown-item total">
                    <span>Total:</span>
                    <span>TBD</span>
                  </p>
                </div>

                <button type="submit" className="book-btn">Book Now</button>
              </form>

              <button className="contact-btn">Message Host</button>
            </div>

            <div className="host-info">
              <h3>Host Information</h3>
              <div className="host-details">
                <p><strong>Speaks:</strong> English, Hindi</p>
                <p><strong>Response time:</strong> Usually within 1 hour</p>
                <p><strong>Member since:</strong> 2019</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomestayDetails;
