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
  const [selectedExperiences, setSelectedExperiences] = useState([]);
  const [guests, setGuests] = useState(1);
  const [showBookingSuccess, setShowBookingSuccess] = useState(false);

  const homestayId = parseInt(id, 10);
  const foundHomestay = homestays.find(h => h.id === homestayId) || homestays[0];

  const homestay = {
    ...foundHomestay,
    reviews: foundHomestay.reviewsList || []
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const toggleExperience = (expId) => {
    setSelectedExperiences(prev => 
      prev.includes(expId) 
        ? prev.filter(id => id !== expId) 
         : [...prev, expId]
    );
  };

  const calculateNights = () => {
    if (!selectedDates.checkIn || !selectedDates.checkOut) return 0;
    const start = new Date(selectedDates.checkIn);
    const end = new Date(selectedDates.checkOut);
    const differenceInTime = end.getTime() - start.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    return differenceInDays > 0 ? differenceInDays : 0;
  };

  const nights = calculateNights();
  const stayTotal = homestay.pricePerNight * nights;
  
  const experiencesTotal = selectedExperiences.reduce((sum, expId) => {
    const exp = homestay.localExperiences?.find(e => e.id === expId);
    return sum + (exp ? exp.price * guests : 0);
  }, 0);

  const grandTotal = stayTotal + experiencesTotal;

  const handleBooking = (e) => {
    e.preventDefault();
    if (nights <= 0) {
      alert("Please check your Check-in and Check-out dates. Ensure checkout is after check-in.");
      return;
    }
    setShowBookingSuccess(true);
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

          {/* LOCAL EXPERIENCES SECTION */}
          {homestay.localExperiences && homestay.localExperiences.length > 0 && (
            <div className="details-section local-experiences-section">
              <h2>🌿 Local Cultural Experiences & Activities</h2>
              <p className="section-subtitle">
                Make your stay unforgettable. Book native-hosted workshops and unique nature tours, supporting local Himalayan families directly.
              </p>
              <div className="experiences-grid">
                {homestay.localExperiences.map((exp) => {
                  const isSelected = selectedExperiences.includes(exp.id);
                  return (
                    <div 
                      key={exp.id} 
                      className={`experience-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => toggleExperience(exp.id)}
                    >
                      <div className="experience-image">
                        <img src={exp.image} alt={exp.title} />
                        <span className="experience-badge">{exp.category}</span>
                      </div>
                      <div className="experience-info">
                        <div className="experience-header">
                          <h3>{exp.title}</h3>
                          <span className="experience-price">${exp.price} / guest</span>
                        </div>
                        <p className="experience-desc">{exp.description}</p>
                        <div className="experience-footer">
                          <span>⏱️ {exp.duration}</span>
                          <span>👤 Host: {exp.instructor}</span>
                        </div>
                        <button 
                          type="button"
                          className={`experience-select-btn ${isSelected ? 'selected' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExperience(exp.id);
                          }}
                        >
                          {isSelected ? '✓ Added' : '+ Add to Booking'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

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
                  <select 
                    value={guests} 
                    onChange={(e) => setGuests(parseInt(e.target.value, 10))} 
                    required
                  >
                    {Array.from({ length: homestay.maxGuests || 4 }, (_, i) => i + 1).map(num => (
                      <option key={num} value={num}>{num} guest{num > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>

                <div className="price-breakdown">
                  <div className="breakdown-item">
                    <span>Price per night:</span>
                    <span>${homestay.pricePerNight}</span>
                  </div>
                  <div className="breakdown-item">
                    <span>Number of nights:</span>
                    <span>{nights} {nights === 1 ? 'night' : 'nights'}</span>
                  </div>
                  <div className="breakdown-item">
                    <span>Stay Base Price:</span>
                    <span>${stayTotal}</span>
                  </div>

                  {selectedExperiences.length > 0 && (
                    <div className="experiences-breakdown">
                      <div className="breakdown-subtitle">Experiences ({selectedExperiences.length})</div>
                      {selectedExperiences.map(expId => {
                        const exp = homestay.localExperiences.find(e => e.id === expId);
                        if (!exp) return null;
                        return (
                          <div key={expId} className="breakdown-item item-sub">
                            <span>• {exp.title} (${exp.price} × {guests} guest{guests > 1 ? 's' : ''})</span>
                            <span>${exp.price * guests}</span>
                          </div>
                        );
                      })}
                      <div className="breakdown-item item-sub-total">
                        <span>Activities Subtotal:</span>
                        <span>${experiencesTotal}</span>
                      </div>
                    </div>
                  )}

                  <div className="breakdown-item total">
                    <span>Total:</span>
                    <span>${grandTotal}</span>
                  </div>
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

      {/* BOOKING SUCCESS CUSTOM OVERLAY MODAL */}
      {showBookingSuccess && (
        <div className="booking-modal-overlay">
          <div className="booking-success-modal">
            <div className="modal-icon">🌸</div>
            <h2>Booking Request Submitted!</h2>
            <p className="modal-subtitle">
              Your host in {homestay.location.split(',')[0]} has been notified and will respond within 1 hour.
            </p>
            
            <div className="modal-summary-card">
              <h3>{homestay.name}</h3>
              <p className="modal-location">📍 {homestay.location}</p>
              <div className="modal-divider"></div>
              
              <div className="summary-row">
                <span>Check-in:</span>
                <strong>{selectedDates.checkIn}</strong>
              </div>
              <div className="summary-row">
                <span>Check-out:</span>
                <strong>{selectedDates.checkOut}</strong>
              </div>
              <div className="summary-row">
                <span>Guests:</span>
                <strong>{guests} guest{guests > 1 ? 's' : ''}</strong>
              </div>
              <div className="summary-row">
                <span>Nights:</span>
                <strong>{nights} night{nights > 1 ? 's' : ''}</strong>
              </div>

              {selectedExperiences.length > 0 && (
                <div className="modal-experiences-list">
                  <h4>🌿 Custom Activities Included:</h4>
                  <ul>
                    {selectedExperiences.map(expId => {
                      const exp = homestay.localExperiences.find(e => e.id === expId);
                      return (
                        <li key={expId}>
                          • {exp.title} ({exp.duration}) - <em>Hosted by {exp.instructor}</em>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
              
              <div className="modal-divider"></div>
              <div className="modal-total-row">
                <span>Grand Total:</span>
                <span className="grand-price">${grandTotal}</span>
              </div>
            </div>
            
            <button 
              className="modal-close-btn" 
              onClick={() => setShowBookingSuccess(false)}
            >
              Great, Let's Explorer!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomestayDetails;
