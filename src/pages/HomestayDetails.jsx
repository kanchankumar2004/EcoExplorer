import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import ReviewCard from '../components/ReviewCard';
import MapView from '../components/MapView';
import { Loader, Toast } from '../components/ui';
import './HomestayDetails.css';

const HomestayDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  const { addFavorite, removeFavorite, isFavorite: checkIsFavorite } = useFavorites();
  
  const [selectedDates, setSelectedDates] = useState({ checkIn: '', checkOut: '' });
  const [selectedExperiences, setSelectedExperiences] = useState([]);
  const [guests, setGuests] = useState(1);
  const [showBookingSuccess, setShowBookingSuccess] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [contactSending, setContactSending] = useState(false);
  const [contactStatus, setContactStatus] = useState('');
  const [homestay, setHomestay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchHomestay = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/homestays/${id}`);
        setHomestay({
          ...response.data,
          reviews: response.data.reviewsList || []
        });
      } catch (error) {
        console.error('Error fetching homestay:', error);
        setToast({
          message: error.response?.data?.message || 'Failed to load homestay details from server.',
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHomestay();
  }, [id]);

  const isFavorite = homestay ? checkIsFavorite(homestay._id || homestay.id) : false;

  const handleFavorite = () => {
    if (!homestay) return;
    const homestayId = homestay._id || homestay.id;
    if (isFavorite) {
      removeFavorite(homestayId);
      setToast({ message: 'Removed from favorites', type: 'info' });
    } else {
      addFavorite(homestay, 'homestay');
      setToast({ message: 'Saved to favorites!', type: 'success' });
    }
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

  const homestayHostId = homestay?.host?._id || homestay?.host;
  const currentUserId = user?.id || user?._id;
  const isOwnListing = Boolean(
    isAuthenticated &&
    homestayHostId &&
    currentUserId &&
    homestayHostId.toString() === currentUserId.toString()
  );

  const canBook = isAuthenticated && !isOwnListing;

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setToast({ message: 'Please login to book this homestay!', type: 'info' });
      navigate('/login');
      return;
    }
    if (isOwnListing) {
      setToast({ message: 'You cannot book your own property listing.', type: 'error' });
      return;
    }
    if (nights <= 0) {
      setToast({ message: 'Please check your dates. Checkout must be after check-in.', type: 'error' });
      return;
    }

    try {
      const bookingPayload = {
        name: homestay.name,
        type: 'Homestay',
        checkIn: selectedDates.checkIn,
        checkOut: selectedDates.checkOut,
        guests: Number(guests),
        totalPrice: grandTotal,
        image: homestay.image,
        host: homestay.host,
        itemId: homestay._id || homestay.id,
        guestName: user.name
      };

      await axios.post('/api/bookings', bookingPayload);
      setShowBookingSuccess(true);
    } catch (err) {
      console.error('Error creating booking:', err);
      setToast({
        message: err.response?.data?.message || 'Failed to submit booking. Please try again.',
        type: 'error'
      });
    }
  };

  const handleContactHost = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setToast({ message: 'Please login to contact the host.', type: 'info' });
      navigate('/login');
      return;
    }

    if (!contactMessage.trim()) {
      setContactStatus('Please enter a message before sending.');
      return;
    }

    try {
      setContactSending(true);
      setContactStatus('');
      await axios.post('/api/bookings/contact-host', {
        type: 'Homestay',
        itemId: homestay._id || homestay.id,
        message: contactMessage.trim(),
      });
      setContactStatus('Message sent to host successfully.');
      setContactMessage('');
      setToast({ message: 'Message sent to host successfully!', type: 'success' });
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to contact host.';
      setContactStatus(msg);
      setToast({ message: msg, type: 'error' });
    } finally {
      setContactSending(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '100px 0', textAlign: 'center' }}>
        <Loader size="lg" text="Loading homestay details..." />
      </div>
    );
  }

  if (!homestay) {
    return (
      <div style={{ padding: '100px 0', textAlign: 'center', fontSize: '1.2rem', color: '#666' }}>
        Homestay not found
      </div>
    );
  }

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

          {homestay.amenities && homestay.amenities.length > 0 && (
            <div className="details-section">
              <h2>Facilities</h2>
              <ul className="facilities-list">
                {homestay.amenities.map((facility, idx) => (
                  <li key={idx}>✓ {facility}</li>
                ))}
              </ul>
            </div>
          )}

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
            <h2>Guest Reviews ({homestay.reviews?.length || 0})</h2>
            {homestay.reviews && homestay.reviews.length > 0 ? (
              homestay.reviews.map(review => (
                <ReviewCard key={review.id || review._id} {...review} />
              ))
            ) : (
              <p style={{ color: '#888' }}>No reviews yet for this homestay.</p>
            )}
          </div>
        </div>

        <div className="details-sidebar">
          <div className="sticky-sidebar">
            <div className="booking-form-card">
              <div className="price-section">
                <span className="price">${homestay.pricePerNight}/night</span>
                <span className="rating">⭐ {homestay.rating} ({homestay.reviewsCount || homestay.reviews?.length || 0} reviews)</span>
              </div>

              {isOwnListing ? (
                <div style={{ background: '#fef3c7', border: '1px solid #f59e0b', color: '#92400e', padding: '16px 20px', borderRadius: '12px', textAlign: 'center', marginTop: '20px', fontWeight: 'bold' }}>
                  🏡 You are the host of this homestay listing.
                </div>
              ) : (
                <>
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
                            const exp = homestay.localExperiences?.find(e => e.id === expId);
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

                  <button className="contact-btn" type="button" onClick={() => setShowContactModal(true)}>Message Host</button>
                </>
              )}
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

      {/* BOOKING SUCCESS MODAL */}
      {showBookingSuccess && (
        <div className="booking-modal-overlay">
          <div className="booking-success-modal">
            <div className="modal-icon">⏳</div>
            <h2>Booking Pending Approval</h2>
            <p className="modal-subtitle">
              Your eco-adventure at {homestay.name} is awaiting host confirmation.
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
                      const exp = homestay.localExperiences?.find(e => e.id === expId);
                      return (
                        <li key={expId}>
                          • {exp?.title} ({exp?.duration}) - <em>Hosted by {exp?.instructor}</em>
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
              onClick={() => {
                setShowBookingSuccess(false);
                navigate('/my-bookings');
              }}
            >
              Great, Let's Explore!
            </button>
          </div>
        </div>
      )}

      {showContactModal && (
        <div className="booking-modal-overlay">
          <div className="booking-success-modal contact-modal">
            <h2>Message Host</h2>
            <p className="modal-subtitle">Send a quick message to the host about this homestay.</p>

            <form onSubmit={handleContactHost} className="contact-form">
              <div className="form-group">
                <label htmlFor="contactMessage">Message</label>
                <textarea
                  id="contactMessage"
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  rows="5"
                  placeholder="Ask about availability, facilities, or anything else..."
                />
              </div>

              {contactStatus && <p className="contact-status">{contactStatus}</p>}

              <div className="contact-modal-actions">
                <button type="button" className="contact-cancel-btn" onClick={() => setShowContactModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="book-btn" disabled={contactSending}>
                  {contactSending ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
};

export default HomestayDetails;
