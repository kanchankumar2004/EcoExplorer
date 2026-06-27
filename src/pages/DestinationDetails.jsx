import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import ReviewCard from '../components/ReviewCard';
import MapView from '../components/MapView';
import './DestinationDetails.css';

const DestinationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const { addFavorite, removeFavorite, isFavorite: checkIsFavorite } = useFavorites();
  
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [selectedDates, setSelectedDates] = useState({ checkIn: '', checkOut: '' });
  const [guests, setGuests] = useState(1);
  const [showBookingSuccess, setShowBookingSuccess] = useState(false);

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/destinations/${id}`);
        // Mock reviews since backend doesn't store them yet
        setDestination({
          ...response.data,
          reviews: [] 
        });
      } catch (error) {
        console.error('Error fetching destination:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDestination();
  }, [id]);

  const isFavorite = destination ? checkIsFavorite(destination._id) : false;

  const handleFavorite = () => {
    if (!destination) return;
    if (isFavorite) {
      removeFavorite(destination._id);
    } else {
      addFavorite(destination, 'destination');
    }
  };

  const parsePrice = (priceStr) => {
    if (!priceStr) return 0;
    const match = priceStr.match(/\d+/);
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

  const nights = calculateNights();
  const pricePerNight = destination ? parsePrice(destination.price) : 0;
  const stayTotal = pricePerNight * nights;
  const grandTotal = stayTotal;

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert("Please login to book this destination!");
      navigate('/login');
      return;
    }
    if (nights <= 0) {
      alert("Please check your Check-in and Check-out dates. Ensure checkout is after check-in.");
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
        image: destination.image
      };

      await axios.post('/api/bookings', bookingPayload);
      setShowBookingSuccess(true);
    } catch (err) {
      console.error('Error creating booking:', err);
      alert(err.response?.data?.message || 'Failed to submit booking. Please try again.');
    }
  };

  if (loading) return <div className="loading">Loading destination details...</div>;
  if (!destination) return <div className="error">Destination not found</div>;

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

          <div className="details-section">
            <h2>Highlights</h2>
            <ul className="highlights-list">
              {destination.highlights.map((highlight, idx) => (
                <li key={idx}>✓ {highlight}</li>
              ))}
            </ul>
          </div>

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
            <h2>Reviews ({destination.reviews.length})</h2>
            {destination.reviews.map(review => (
              <ReviewCard key={review.id} {...review} />
            ))}
          </div>
        </div>

        <div className="details-sidebar">
          <div className="sticky-sidebar">
            <div className="detail-booking-card">
              <div className="price-section">
                <span className="price">{destination.price}</span>
                <span className="rating">⭐ {destination.rating} ({destination.reviewsCount} reviews)</span>
              </div>

              <div className="amenities-section">
                <h3>Included</h3>
                {destination.amenities.map((amenity, idx) => (
                  <p key={idx}>• {amenity}</p>
                ))}
              </div>

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

              <button className="contact-btn">Contact Host</button>
            </div>

            <div className="share-section">
              <h3>Share</h3>
              <div className="share-buttons">
                <button className="share-btn">Facebook</button>
                <button className="share-btn">Twitter</button>
                <button className="share-btn">Email</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOOKING SUCCESS MODAL */}
      {showBookingSuccess && (
        <div className="booking-modal-overlay">
          <div className="booking-success-modal">
            <div className="modal-icon">✅</div>
            <h2>Booking Confirmed!</h2>
            <p className="modal-subtitle">
              Your eco-adventure at {destination.location.split(',')[0]} is locked in.
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
    </div>
  );
};

export default DestinationDetails;
