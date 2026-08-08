import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import ReviewCard from '../components/ReviewCard';
import MapView from '../components/MapView';
import { Loader, Toast } from '../components/ui';
import './DestinationDetails.css';

const DestinationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  const { addFavorite, removeFavorite, isFavorite: checkIsFavorite } = useFavorites();
  
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  
  const [selectedDates, setSelectedDates] = useState({ checkIn: '', checkOut: '' });
  const [guests, setGuests] = useState(1);
  const [showBookingSuccess, setShowBookingSuccess] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [contactSending, setContactSending] = useState(false);
  const [contactStatus, setContactStatus] = useState('');

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/destinations/${id}`);
        setDestination({
          ...response.data,
          reviews: response.data.reviewsList || []
        });
      } catch (error) {
        console.error('Error fetching destination:', error);
        setToast({
          message: error.response?.data?.message || 'Failed to load destination details from server.',
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDestination();
  }, [id]);

  const isFavorite = destination ? checkIsFavorite(destination._id || destination.id) : false;

  const handleFavorite = () => {
    if (!destination) return;
    const destId = destination._id || destination.id;
    if (isFavorite) {
      removeFavorite(destId);
      setToast({ message: 'Removed from favorites', type: 'info' });
    } else {
      addFavorite(destination, 'destination');
      setToast({ message: 'Saved to favorites!', type: 'success' });
    }
  };

  const parsePrice = (priceStr) => {
    if (!priceStr) return 0;
    const match = String(priceStr).match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  };

  const calculateNights = () => {
    if (!selectedDates.checkIn || !selectedDates.checkOut) return 0;
    const start = new Date(selectedDates.checkIn);
    const end = new Date(selectedDates.checkOut);
    const differenceInTime = end.getTime() - start.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    return differenceInDays > 0 ? differenceInDays : 0;
  };

  const destinationHostId = destination?.host?._id || destination?.host;
  const currentUserId = user?.id || user?._id;
  const isOwnListing = Boolean(
    isAuthenticated &&
    destinationHostId &&
    currentUserId &&
    destinationHostId.toString() === currentUserId.toString()
  );

  const canBook = isAuthenticated && !isOwnListing;

  const nights = calculateNights();
  const pricePerNight = parsePrice(destination?.price);
  const grandTotal = nights * pricePerNight * guests;

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setToast({ message: 'Please login to book this destination!', type: 'info' });
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
        name: destination.name,
        type: 'Destination',
        checkIn: selectedDates.checkIn,
        checkOut: selectedDates.checkOut,
        guests: Number(guests),
        totalPrice: grandTotal,
        image: destination.image,
        host: destination.host,
        itemId: destination._id || destination.id,
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
        type: 'Destination',
        itemId: destination._id || destination.id,
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
        <Loader size="lg" text="Loading destination details..." />
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="error" style={{ textAlign: 'center', padding: '100px 0', fontSize: '1.2rem', color: '#666' }}>
        Destination not found
      </div>
    );
  }

  return (
    <div className="destination-details">
      <div className="details-hero">
        <img src={destination.image} alt={destination.name} />
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>{destination.name}</h1>
            <p>{destination.location}</p>
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
            <h2>About</h2>
            <p>{destination.longDescription}</p>
          </div>

          {destination.highlights && destination.highlights.length > 0 && (
            <div className="details-section">
              <h2>Highlights</h2>
              <ul className="highlights-list">
                {destination.highlights.map((highlight, idx) => (
                  <li key={idx}>✓ {highlight}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="details-section">
            <h2>Location</h2>
            <MapView 
              latitude={destination.latitude}
              longitude={destination.longitude}
              title={destination.name}
              height="300px"
            />
          </div>

          <div className="details-section">
            <h2>Reviews ({destination.reviews?.length || 0})</h2>
            {destination.reviews && destination.reviews.length > 0 ? (
              destination.reviews.map(review => (
                <ReviewCard key={review.id || review._id} {...review} />
              ))
            ) : (
              <p style={{ color: '#888' }}>No reviews yet for this destination.</p>
            )}
          </div>
        </div>

        <div className="details-sidebar">
          <div className="sticky-sidebar">
            <div className="detail-booking-card">
              <div className="price-section">
                <span className="price">{destination.price}</span>
                <span className="rating">⭐ {destination.rating} ({destination.reviewsCount || destination.reviews?.length || 0} reviews)</span>
              </div>

              {destination.amenities && destination.amenities.length > 0 && (
                <div className="amenities-section">
                  <h3>Included</h3>
                  {destination.amenities.map((amenity, idx) => (
                    <p key={idx}>• {amenity}</p>
                  ))}
                </div>
              )}

              {isOwnListing ? (
                <div style={{ background: '#fef3c7', border: '1px solid #f59e0b', color: '#92400e', padding: '16px 20px', borderRadius: '12px', textAlign: 'center', marginTop: '20px', fontWeight: 'bold' }}>
                  🏡 You are the host of this destination listing.
                </div>
              ) : (
                <>
                  <form onSubmit={handleBooking} className="booking-form" style={{ marginTop: '20px' }}>
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
                        {[1, 2, 3, 4, 5, 6].map(num => (
                          <option key={num} value={num}>{num} guest{num > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>

                    {nights > 0 && (
                      <div className="price-breakdown">
                        <div className="breakdown-item">
                          <span>Price per night:</span>
                          <span>${pricePerNight}</span>
                        </div>
                        <div className="breakdown-item">
                          <span>Number of nights:</span>
                          <span>{nights} {nights === 1 ? 'night' : 'nights'}</span>
                        </div>
                        <div className="breakdown-item total">
                          <span>Total:</span>
                          <span>${grandTotal}</span>
                        </div>
                      </div>
                    )}

                    <button type="submit" className="book-btn" style={{ marginTop: '15px' }}>Book Now</button>
                  </form>

                  <button className="contact-btn" type="button" onClick={() => setShowContactModal(true)}>Contact Host</button>
                </>
              )}
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
              Your eco-adventure at {destination.location?.split(',')[0]} is awaiting host confirmation.
            </p>
            
            <div className="modal-summary-card">
              <h3>{destination.name}</h3>
              <p className="modal-location">📍 {destination.location}</p>
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
              View My Bookings
            </button>
          </div>
        </div>
      )}

      {showContactModal && (
        <div className="booking-modal-overlay">
          <div className="booking-success-modal contact-modal">
            <h2>Contact Host</h2>
            <p className="modal-subtitle">Send a quick message to the host about this destination.</p>

            <form onSubmit={handleContactHost} className="contact-form">
              <div className="form-group">
                <label htmlFor="contactMessage">Message</label>
                <textarea
                  id="contactMessage"
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  rows="5"
                  placeholder="Ask about availability, rules, or anything else..."
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

export default DestinationDetails;
