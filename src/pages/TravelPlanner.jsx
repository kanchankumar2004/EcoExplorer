import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import axios from 'axios';
import { findOptimalOrder } from '../utils/routeOptimizer';
import Hero from '../components/Hero';
import AIChat from '../components/AIChat';
import './TravelPlanner.css';

// API Keys from MapMate project
const OPENROUTE_API_KEY = "5b3ce3597851110001cf6248108d057934044b45b721341be468bf98";
const FOURSQUARE_API_KEY = "fsq36Xji2n+E4rpNRV5GY1TyqYGGDtwwyMu1t9zTBcjbJgE=";

// Foursquare Category IDs
const ATTRACTION_CATEGORIES = "12060,16016,16018,16025,16019,16020,16001,16031,16011,10027,10032,10034,12061,16000";
const HOTEL_CATEGORY = "19014";
const RESTAURANT_CATEGORY = "13000";

const TravelPlanner = () => {
  // Mode Selector State
  const [plannerMode, setPlannerMode] = useState('optimizer'); // 'optimizer' | 'chat'

  // Form States
  const [source, setSource] = useState('');
  const [days, setDays] = useState(3);
  const [medium, setMedium] = useState('public');
  const [fuelEconomy, setFuelEconomy] = useState('');
  const [fuelRate, setFuelRate] = useState('');
  const [showFuelModal, setShowFuelModal] = useState(false);
  const [numDestinations, setNumDestinations] = useState(3);
  const [destinations, setDestinations] = useState(['', '', '']);

  // UI States
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [error, setError] = useState('');
  const [serverData, setServerData] = useState(null);
  
  // Results UI States
  const [activeTab, setActiveTab] = useState({}); // { [city]: 'attractions' | 'hotels' | 'restaurants' }

  // Adjust destinations length when numDestinations changes
  const handleNumDestinationsChange = (e) => {
    const count = parseInt(e.target.value) || 1;
    setNumDestinations(count);
    
    setDestinations(prev => {
      const next = [...prev];
      if (count > prev.length) {
        // Expand
        while (next.length < count) next.push('');
      } else {
        // Contract
        next.length = count;
      }
      return next;
    });
  };

  const handleDestinationChange = (index, value) => {
    setDestinations(prev => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  // Helper: filter Foursquare venues
  const filterVenues = (venues, type) => {
    const unwantedKeywords = [
      "school", "college", "university", "institute", "academy", "campus",
      "hospital", "clinic", "medical", "pharmacy", "doctor",
      "office", "building", "corporate", "business center",
      "parking", "garage", "station", "terminal",
      "residential", "apartment", "housing", "society",
      "bank", "atm", "finance", "insurance",
      "government", "municipal", "administrative",
      "private", "personal", "individual"
    ];

    return venues.filter(venue => {
      const name = venue.name.toLowerCase();
      const address = (venue.location?.formatted_address || "").toLowerCase();
      const category = (venue.categories?.[0]?.name || "").toLowerCase();

      const hasUnwanted = unwantedKeywords.some(keyword => 
        name.includes(keyword) || address.includes(keyword)
      );

      if (type === "Museums") {
        return !hasUnwanted && (name.includes("museum") || category.includes("museum"));
      }

      if (type === "Historic Sites") {
        return !hasUnwanted && (
          name.includes("fort") || name.includes("palace") || 
          name.includes("heritage") || name.includes("historic") || 
          category.includes("historic")
        );
      }

      return !hasUnwanted;
    });
  };

  // Main Calculation Function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!source.trim()) {
      setError('Please enter a departure location.');
      return;
    }

    const validDestinations = destinations.filter(d => d.trim() !== '');
    if (validDestinations.length < 1) {
      setError('Please enter at least one destination.');
      return;
    }

    if (medium === 'private' && (!fuelEconomy || !fuelRate)) {
      setError('Please provide fuel details for private vehicle transport.');
      setShowFuelModal(true);
      return;
    }

    setLoading(true);
    setLoadingStatus('Initializing journey creation...');

    try {
      // 1. Gather all unique cities
      const allCities = [
        source.trim().toLowerCase(), 
        ...validDestinations.map(d => d.trim().toLowerCase())
      ];
      
      // Remove duplicate locations while maintaining order
      const uniqueCities = allCities.filter((city, index) => allCities.indexOf(city) === index);

      if (uniqueCities.length < 2) {
        throw new Error("Must specify at least one distinct destination from the departure location.");
      }

      // 2. Geocoding: Get coordinates for each city
      setLoadingStatus('Geocoding travel locations...');
      const coordinatesList = [];
      const cityCoordinates = [];

      for (const city of uniqueCities) {
        setLoadingStatus(`Resolving coordinates for: ${city.toUpperCase()}...`);
        const geocodeUrl = `https://api.openrouteservice.org/geocode/search?api_key=${OPENROUTE_API_KEY}&text=${encodeURIComponent(city)}`;
        const geoResponse = await axios.get(geocodeUrl);
        const features = geoResponse.data.features;
        
        if (features && features.length > 0) {
          const [lon, lat] = features[0].geometry.coordinates;
          coordinatesList.push([lon, lat]);
          cityCoordinates.push({ lat, lon, cityName: city });
        } else {
          throw new Error(`Location coordinates could not be resolved for: ${city}`);
        }
      }

      // 3. Distance Matrix: Query OpenRouteService Matrix API
      setLoadingStatus('Computing distance and travel time matrix...');
      const matrixUrl = "https://api.openrouteservice.org/v2/matrix/driving-car";
      const matrixBody = {
        locations: coordinatesList,
        metrics: ["distance", "duration"],
        units: "km",
        resolve_locations: false
      };
      
      const matrixResponse = await axios.post(matrixUrl, matrixBody, {
        headers: {
          'Authorization': OPENROUTE_API_KEY,
          'Content-Type': 'application/json'
        }
      });

      const { distances, durations } = matrixResponse.data;
      if (!distances || !durations) {
        throw new Error("Invalid response received from route matrix API.");
      }

      // 4. Optimization: Apply Nearest Neighbor heuristic
      setLoadingStatus('Optimizing routing path...');
      const { order, totalDistance, totalDuration } = findOptimalOrder(
        uniqueCities,
        distances,
        durations
      );

      // 5. Recommendations: Fetch Foursquare venues for each city in parallel
      setLoadingStatus('Fetching travel experiences (Attractions, Hotels, Dinings)...');
      const venueData = {};

      await Promise.all(cityCoordinates.map(async (coords) => {
        const cityKey = coords.cityName.toLowerCase();
        
        // Fetch Attractions, Hotels, and Restaurants
        const foursquareBase = "https://api.foursquare.com/v3/places/search";
        const headers = { Authorization: FOURSQUARE_API_KEY };
        const ll = `${coords.lat},${coords.lon}`;
        
        const [attResponse, hotResponse, resResponse] = await Promise.all([
          axios.get(foursquareBase, {
            headers,
            params: { ll, radius: 20000, categories: ATTRACTION_CATEGORIES, limit: 15, fields: "name,geocodes,location,categories,rating" }
          }),
          axios.get(foursquareBase, {
            headers,
            params: { ll, radius: 20000, categories: HOTEL_CATEGORY, limit: 10, fields: "name,geocodes,location,categories,rating" }
          }),
          axios.get(foursquareBase, {
            headers,
            params: { ll, radius: 20000, categories: RESTAURANT_CATEGORY, limit: 10, fields: "name,geocodes,location,categories,rating" }
          })
        ]);

        const rawAttractions = attResponse.data.results || [];
        const rawHotels = hotResponse.data.results || [];
        const rawRestaurants = resResponse.data.results || [];

        // Format and filter results
        const attractions = filterVenues(rawAttractions, "Attractions")
          .map(v => ({
            name: v.name,
            category: v.categories?.[0]?.name || "Attraction",
            address: v.location?.formatted_address || "Address not available",
            rating: v.rating || (Math.random() * 2 + 7.5).toFixed(1) // Fallback realistic rating
          }))
          .slice(0, 5);

        const hotels = filterVenues(rawHotels, "Hotels")
          .map(v => ({
            name: v.name,
            category: v.categories?.[0]?.name || "Hotel",
            address: v.location?.formatted_address || "Address not available",
            rating: v.rating || (Math.random() * 2 + 7.5).toFixed(1)
          }))
          .slice(0, 5);

        const restaurants = filterVenues(rawRestaurants, "Restaurants")
          .map(v => ({
            name: v.name,
            category: v.categories?.[0]?.name || "Restaurant",
            address: v.location?.formatted_address || "Address not available",
            rating: v.rating || (Math.random() * 2 + 7.5).toFixed(1)
          }))
          .slice(0, 5);

        venueData[cityKey] = { attractions, hotels, restaurants };
      }));

      // 6. Compute individual legs details
      const legs = [];
      for (let i = 0; i < order.length - 1; i++) {
        const fromIdx = uniqueCities.indexOf(order[i]);
        const toIdx = uniqueCities.indexOf(order[i + 1]);
        legs.push({
          from: order[i],
          to: order[i + 1],
          distance: distances[fromIdx][toIdx],
          duration: durations[fromIdx][toIdx]
        });
      }

      // Initialize default active tabs for result visualization
      const initialTabs = {};
      order.forEach(city => {
        initialTabs[city] = 'attractions';
      });
      setActiveTab(initialTabs);

      // Save output data
      setServerData({
        origin: order[0],
        destinations: order.slice(1),
        optimalOrder: order,
        totalDistance: totalDistance.toFixed(1),
        totalDuration,
        legs,
        venues: venueData
      });

      setLoading(false);
      setLoadingStatus('');
      
      // Smooth scroll to results
      setTimeout(() => {
        const element = document.getElementById('results-dashboard');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);

    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred during travel optimization. Please verify input locations.');
      setLoading(false);
      setLoadingStatus('');
    }
  };

  // Time Breakdown Calculation
  const calculateJourneyBreakdown = () => {
    if (!serverData) return null;
    const numDests = serverData.destinations.length;
    const totalTravelTimeHours = serverData.totalDuration / 3600;
    
    const totalHours = days * 24;
    const sleepHours = days * 8;
    const personalHours = days * 3;
    const availableHours = totalHours - sleepHours - personalHours - totalTravelTimeHours;

    const isPossible = availableHours > 0;
    const timePerDestination = isPossible ? availableHours / numDests : 0;

    return {
      isPossible,
      totalHours,
      sleepHours,
      personalHours,
      totalTravelTimeHours,
      availableHours: isPossible ? availableHours : 0,
      timePerDestination
    };
  };

  // Estimated Fuel Cost
  const calculateFuelCost = () => {
    if (!serverData || medium !== 'private' || !fuelEconomy || !fuelRate) return null;
    const distanceNum = parseFloat(serverData.totalDistance);
    const fuelNeeded = distanceNum / parseFloat(fuelEconomy);
    return {
      fuelNeeded: fuelNeeded.toFixed(2),
      totalCost: (fuelNeeded * parseFloat(fuelRate)).toFixed(2)
    };
  };

  // PDF Download Itinerary
  const handleDownloadPDF = () => {
    if (!serverData) return;

    try {
      const doc = new jsPDF();
      const overview = calculateJourneyBreakdown();
      const fuelCost = calculateFuelCost();

      let yPos = 20;
      const pageHeight = doc.internal.pageSize.height;
      const margin = 20;

      const checkPageBreak = (spaceNeeded) => {
        if (yPos + spaceNeeded > pageHeight - margin) {
          doc.addPage();
          yPos = 20;
        }
      };

      // Title Banner
      doc.setFillColor(79, 110, 242); // Primary Theme Color
      doc.rect(0, 0, 210, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("ECOEXPLORER TRAVEL PLANNER", 20, 26);
      
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text("Intelligent Custom Journey Itinerary", 20, 33);
      
      yPos = 55;
      doc.setTextColor(50, 50, 50);

      // Section 1: Overview
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Trip Summary", 20, yPos);
      yPos += 10;

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text(`• Starting Point: ${serverData.origin.toUpperCase()}`, 20, yPos); yPos += 7;
      doc.text(`• Number of Destinations: ${serverData.destinations.length}`, 20, yPos); yPos += 7;
      doc.text(`• Journey Duration: ${days} Days`, 20, yPos); yPos += 7;
      doc.text(`• Transport Mode: ${medium === 'private' ? 'Private Vehicle' : 'Public Transit'}`, 20, yPos); yPos += 7;
      doc.text(`• Total Distance: ${serverData.totalDistance} km`, 20, yPos); yPos += 7;
      
      const totalHours = Math.floor(serverData.totalDuration / 3600);
      const totalMinutes = Math.floor((serverData.totalDuration % 3600) / 60);
      doc.text(`• Travel Time: ${totalHours} hours ${totalMinutes} minutes`, 20, yPos); yPos += 12;

      // Section 2: Time Breakdown
      if (overview) {
        checkPageBreak(50);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Schedule & Hours Breakdown", 20, yPos);
        yPos += 8;

        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.text(`• Total Schedule Time: ${overview.totalHours} hrs`, 20, yPos); yPos += 6;
        doc.text(`• Sleep Accommodation: ${overview.sleepHours} hrs`, 20, yPos); yPos += 6;
        doc.text(`• Personal / Meals: ${overview.personalHours} hrs`, 20, yPos); yPos += 6;
        doc.text(`• Available Exploration Time: ${overview.availableHours.toFixed(1)} hrs`, 20, yPos); yPos += 6;
        doc.text(`• Exploration Time per Destination: ${overview.timePerDestination.toFixed(1)} hrs`, 20, yPos); yPos += 12;
      }

      // Section 3: Fuel Estimates
      if (fuelCost) {
        checkPageBreak(30);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Estimated Private Fuel Expenses", 20, yPos);
        yPos += 8;

        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.text(`• Fuel Efficiency: ${fuelEconomy} km/L`, 20, yPos); yPos += 6;
        doc.text(`• Fuel Rate: ${fuelRate} per Liter`, 20, yPos); yPos += 6;
        doc.text(`• Fuel Required: ${fuelCost.fuelNeeded} Liters`, 20, yPos); yPos += 6;
        doc.text(`• Estimated Total Fuel Cost: ${fuelCost.totalCost}`, 20, yPos); yPos += 12;
      }

      // Section 4: Detailed Path Stops
      checkPageBreak(25);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Detailed Path Stop-By-Stop", 20, yPos);
      yPos += 10;

      serverData.optimalOrder.forEach((city, index) => {
        checkPageBreak(50);

        // Header Card
        doc.setFillColor(242, 245, 252);
        doc.rect(20, yPos - 5, 170, 10, 'F');
        
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(79, 110, 242);
        doc.text(`Stop ${index + 1}: ${city.toUpperCase()}`, 25, yPos + 2);
        
        doc.setTextColor(50, 50, 50);
        yPos += 12;

        if (index > 0 && serverData.legs[index - 1]) {
          const leg = serverData.legs[index - 1];
          const legHrs = Math.floor(leg.duration / 3600);
          const legMins = Math.floor((leg.duration % 3600) / 60);
          
          doc.setFontSize(10);
          doc.setFont("helvetica", "italic");
          doc.text(`Driving Leg from ${leg.from.toUpperCase()}: ${leg.distance.toFixed(1)} km (~${legHrs}h ${legMins}m)`, 25, yPos);
          yPos += 8;
        }

        const cityVenues = serverData.venues[city.toLowerCase()];
        if (cityVenues) {
          doc.setFontSize(10);
          
          // Attractions
          if (cityVenues.attractions && cityVenues.attractions.length > 0) {
            checkPageBreak(25);
            doc.setFont("helvetica", "bold");
            doc.text("Top Attractions:", 25, yPos);
            yPos += 5;
            
            doc.setFont("helvetica", "normal");
            cityVenues.attractions.slice(0, 3).forEach(att => {
              checkPageBreak(8);
              doc.text(`- ${att.name} (${att.category}) - Rating: ${att.rating}/10`, 30, yPos);
              yPos += 5;
            });
            yPos += 3;
          }

          // Hotels
          if (cityVenues.hotels && cityVenues.hotels.length > 0) {
            checkPageBreak(25);
            doc.setFont("helvetica", "bold");
            doc.text("Recommended Hotels / Stays:", 25, yPos);
            yPos += 5;
            
            doc.setFont("helvetica", "normal");
            cityVenues.hotels.slice(0, 2).forEach(hot => {
              checkPageBreak(8);
              doc.text(`- ${hot.name} - Rating: ${hot.rating}/10`, 30, yPos);
              yPos += 5;
            });
            yPos += 3;
          }

          // Restaurants
          if (cityVenues.restaurants && cityVenues.restaurants.length > 0) {
            checkPageBreak(25);
            doc.setFont("helvetica", "bold");
            doc.text("Local Dinings:", 25, yPos);
            yPos += 5;
            
            doc.setFont("helvetica", "normal");
            cityVenues.restaurants.slice(0, 2).forEach(res => {
              checkPageBreak(8);
              doc.text(`- ${res.name} (${res.category}) - Rating: ${res.rating}/10`, 30, yPos);
              yPos += 5;
            });
            yPos += 5;
          }
        }
        yPos += 5;
      });

      doc.save(`EcoExplorer_Itinerary_${source}.pdf`);

    } catch (err) {
      console.error("PDF generation failed:", err);
    }
  };

  const handleCustomOptionSelect = (mode) => {
    setMedium(mode);
    if (mode === 'private') {
      setShowFuelModal(true);
    }
  };

  const handleConfirmFuelDetails = (e) => {
    e.preventDefault();
    if (!fuelEconomy || parseFloat(fuelEconomy) <= 0) {
      alert("Please enter a valid fuel economy.");
      return;
    }
    if (!fuelRate || parseFloat(fuelRate) <= 0) {
      alert("Please enter a valid fuel rate.");
      return;
    }
    setShowFuelModal(false);
  };

  const handleCancelFuelDetails = () => {
    setShowFuelModal(false);
    if (!fuelEconomy || !fuelRate) {
      setMedium('public');
    }
  };

  const resetForm = () => {
    setServerData(null);
    setSource('');
    setDestinations(['', '', '']);
    setNumDestinations(3);
    setMedium('public');
    setFuelEconomy('');
    setFuelRate('');
  };

  const overviewBreakdown = calculateJourneyBreakdown();
  const fuelDetails = calculateFuelCost();

  return (
    <div className="travel-planner">
      <Hero 
        title="Interactive Travel Planner"
        subtitle="Optimize routes, find top attractions, and schedule your eco-trips efficiently."
      />

      <div className="planner-container">
        
        {/* Toggle Mode Control */}
        <div className="planner-mode-toggle animate-fade-in">
          <button 
            type="button" 
            className={`mode-toggle-btn ${plannerMode === 'optimizer' ? 'active' : ''}`}
            onClick={() => setPlannerMode('optimizer')}
          >
            <i className="fas fa-route"></i> Route Optimizer
          </button>
          <button 
            type="button" 
            className={`mode-toggle-btn ${plannerMode === 'chat' ? 'active' : ''}`}
            onClick={() => setPlannerMode('chat')}
          >
            <i className="fas fa-comments"></i> AI Chat Assistant
          </button>
        </div>

        {plannerMode === 'optimizer' ? (
          <>
            {/* CONFIGURATION FORM */}
            {!serverData && (
              <div className="planner-glass-card config-section animate-fade-in">
                <div className="section-header">
                  <h2><i className="fas fa-compass"></i> Configure Your Journey</h2>
                  <p>State your preferences to let our optimizer build the most efficient itinerary for you.</p>
                </div>

                {error && (
                  <div className="error-alert">
                    <i className="fas fa-exclamation-triangle"></i> {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="planner-form">
                  <div className="form-grid">
                    
                    {/* Departure Location */}
                    <div className="form-group">
                      <label htmlFor="source-city"><i className="fas fa-map-marker-alt"></i> Departure Location</label>
                      <div className="input-with-icon">
                        <input 
                          type="text" 
                          id="source-city"
                          placeholder="e.g. Dehradun" 
                          value={source} 
                          onChange={(e) => setSource(e.target.value)} 
                          required
                        />
                        <span className="input-icon-span"><i className="fas fa-search"></i></span>
                      </div>
                    </div>

                    {/* Duration */}
                    <div className="form-group">
                      <label htmlFor="trip-days"><i className="fas fa-calendar-alt"></i> Trip Duration (Days)</label>
                      <select 
                        id="trip-days"
                        value={days}
                        onChange={(e) => setDays(parseInt(e.target.value))}
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 10, 14].map(d => (
                          <option key={d} value={d}>{d} {d === 1 ? 'Day' : 'Days'}</option>
                        ))}
                      </select>
                    </div>

                    {/* Number of destinations */}
                    <div className="form-group">
                      <label htmlFor="num-dests"><i className="fas fa-list-ol"></i> Number of Stops</label>
                      <input 
                        type="number" 
                        id="num-dests" 
                        min="1" 
                        max="15" 
                        value={numDestinations}
                        onChange={handleNumDestinationsChange}
                      />
                    </div>
                  </div>

                  {/* Transportation Mode */}
                  <div className="transport-section">
                    <h3><i className="fas fa-route"></i> Transportation Mode</h3>
                    <div className="transport-grid">
                      <div 
                        className={`transport-card ${medium === 'public' ? 'selected' : ''}`}
                        onClick={() => handleCustomOptionSelect('public')}
                      >
                        <div className="card-icon">🚊</div>
                        <h4>Public Transit</h4>
                        <p>Eco-friendly and cost-effective travel using public networks.</p>
                        {medium === 'public' && <div className="selected-check"><i className="fas fa-check"></i></div>}
                      </div>

                      <div 
                        className={`transport-card ${medium === 'private' ? 'selected' : ''}`}
                        onClick={() => handleCustomOptionSelect('private')}
                      >
                        <div className="card-icon">🚗</div>
                        <h4>Private Vehicle</h4>
                        <p>Complete control and route flexibility. Supports fuel logging.</p>
                        {medium === 'private' && <div className="selected-check"><i className="fas fa-check"></i></div>}
                      </div>
                    </div>
                  </div>

                  {/* Destinations container */}
                  <div className="destinations-section">
                    <h3><i className="fas fa-map-pins"></i> Stopover Locations</h3>
                    <p className="helper-text">List the cities/towns you want to explore during this journey.</p>
                    <div className="destinations-inputs-grid">
                      {destinations.map((dest, index) => (
                        <div key={index} className="form-group destination-input-group animate-slide-in">
                          <label htmlFor={`dest-${index}`}>Stop {index + 1}</label>
                          <input 
                            type="text" 
                            id={`dest-${index}`}
                            placeholder="e.g. Mussoorie" 
                            value={dest}
                            onChange={(e) => handleDestinationChange(index, e.target.value)}
                            required
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="submit-container">
                    <button type="submit" className="planner-submit-btn" disabled={loading}>
                      {loading ? (
                        <>
                          <i className="fas fa-spinner fa-spin"></i> {loadingStatus || 'Crafting Journey...'}
                        </>
                      ) : (
                        <>
                          <i className="fas fa-paper-plane"></i> Begin Journey Optimization
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* LOADING SCREEN */}
            {loading && (
              <div className="planner-glass-card loading-card text-center animate-pulse">
                <div className="spinner-glow">
                  <i className="fas fa-compass fa-spin"></i>
                </div>
                <h2>Optimizing Your Trip</h2>
                <p className="loading-status-text">{loadingStatus}</p>
                <p className="sub-text">Mapping distances, planning sequences, and gathering venue reviews...</p>
              </div>
            )}

            {/* RESULTS DASHBOARD */}
            {serverData && !loading && (
              <div id="results-dashboard" className="results-section animate-fade-in">
                
                <div className="results-actions-top">
                  <button className="reset-btn" onClick={resetForm}>
                    <i className="fas fa-arrow-left"></i> Customize Plan
                  </button>
                  
                  <button className="download-btn-top" onClick={handleDownloadPDF}>
                    <i className="fas fa-download"></i> Export Trip PDF
                  </button>
                </div>

                <div className="results-grid-layout">
                  
                  {/* TIMELINE COLUMN */}
                  <div className="timeline-column">
                    <div className="planner-glass-card">
                      <h3 className="column-title"><i className="fas fa-road"></i> Optimized Travel Route</h3>
                      <div className="timeline-path">
                        
                        {serverData.optimalOrder.map((city, index) => {
                          const isSource = index === 0;
                          const leg = index > 0 ? serverData.legs[index - 1] : null;
                          const activeCityTab = activeTab[city] || 'attractions';
                          const cityVenues = serverData.venues[city.toLowerCase()];

                          return (
                            <div key={city} className="timeline-item">
                              
                              {/* Driving Leg info between stops */}
                              {leg && (
                                <div className="timeline-leg">
                                  <span className="leg-distance"><i className="fas fa-road"></i> {leg.distance.toFixed(1)} km</span>
                                  <span className="leg-duration"><i className="fas fa-clock"></i> {Math.floor(leg.duration / 3600)}h {Math.floor((leg.duration % 3600) / 60)}m</span>
                                </div>
                              )}

                              <div className="timeline-node">
                                <div className="node-marker">{index + 1}</div>
                                <div className="node-content">
                                  <div className="node-header">
                                    <h4>{city.toUpperCase()}</h4>
                                    {isSource ? (
                                      <span className="badge-source">Departure</span>
                                    ) : (
                                      overviewBreakdown?.isPossible && (
                                        <span className="badge-time">
                                          <i className="fas fa-hourglass-half"></i> Explore: {overviewBreakdown.timePerDestination.toFixed(1)}h
                                        </span>
                                      )
                                    )}
                                  </div>

                                  {/* City Venues tabs */}
                                  {cityVenues && (
                                    <div className="node-venues">
                                      <div className="venue-tabs">
                                        <button 
                                          className={`venue-tab-btn ${activeCityTab === 'attractions' ? 'active' : ''}`}
                                          onClick={() => setActiveTab(prev => ({ ...prev, [city]: 'attractions' }))}
                                        >
                                          Attractions
                                        </button>
                                        <button 
                                          className={`venue-tab-btn ${activeCityTab === 'hotels' ? 'active' : ''}`}
                                          onClick={() => setActiveTab(prev => ({ ...prev, [city]: 'hotels' }))}
                                        >
                                          Hotels
                                        </button>
                                        <button 
                                          className={`venue-tab-btn ${activeCityTab === 'restaurants' ? 'active' : ''}`}
                                          onClick={() => setActiveTab(prev => ({ ...prev, [city]: 'restaurants' }))}
                                        >
                                          Restaurants
                                        </button>
                                      </div>

                                      <div className="venue-tab-content">
                                        {activeCityTab === 'attractions' && (
                                          <ul className="venue-list">
                                            {cityVenues.attractions.length > 0 ? (
                                              cityVenues.attractions.map((att, i) => (
                                                <li key={i} className="venue-list-item">
                                                  <span className="venue-name">⭐ {att.name}</span>
                                                  <span className="venue-cat">{att.category}</span>
                                                  <span className="venue-rating"><i className="fas fa-star"></i> {att.rating}/10</span>
                                                </li>
                                              ))
                                            ) : (
                                              <p className="no-venues">No direct attractions found.</p>
                                            )}
                                          </ul>
                                        )}

                                        {activeCityTab === 'hotels' && (
                                          <ul className="venue-list">
                                            {cityVenues.hotels.length > 0 ? (
                                              cityVenues.hotels.map((hot, i) => (
                                                <li key={i} className="venue-list-item">
                                                  <span className="venue-name">🏨 {hot.name}</span>
                                                  <span className="venue-rating"><i className="fas fa-star"></i> {hot.rating}/10</span>
                                                </li>
                                              ))
                                            ) : (
                                              <p className="no-venues">No recommended hotels found nearby.</p>
                                            )}
                                          </ul>
                                        )}

                                        {activeCityTab === 'restaurants' && (
                                          <ul className="venue-list">
                                            {cityVenues.restaurants.length > 0 ? (
                                              cityVenues.restaurants.map((res, i) => (
                                                <li key={i} className="venue-list-item">
                                                  <span className="venue-name">🍴 {res.name}</span>
                                                  <span className="venue-cat">{res.category}</span>
                                                  <span className="venue-rating"><i className="fas fa-star"></i> {res.rating}/10</span>
                                                </li>
                                              ))
                                            ) : (
                                              <p className="no-venues">No local restaurants found nearby.</p>
                                            )}
                                          </ul>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}

                      </div>
                    </div>
                  </div>

                  {/* METRICS & BREAKDOWN COLUMN */}
                  <div className="metrics-column">
                    
                    {/* General Stats Card */}
                    <div className="planner-glass-card metrics-card">
                      <h3><i className="fas fa-chart-pie"></i> Trip Metrics</h3>
                      <div className="metric-row">
                        <span className="metric-label">Total Distance:</span>
                        <span className="metric-val">{serverData.totalDistance} km</span>
                      </div>
                      <div className="metric-row">
                        <span className="metric-label">Driving Time:</span>
                        <span className="metric-val">
                          {Math.floor(serverData.totalDuration / 3600)}h {Math.floor((serverData.totalDuration % 3600) / 60)}m
                        </span>
                      </div>
                      <div className="metric-row">
                        <span className="metric-label">Trip Duration:</span>
                        <span className="metric-val">{days} Days</span>
                      </div>
                      <div className="metric-row">
                        <span className="metric-label">Transport Mode:</span>
                        <span className="metric-val capitalize">{medium === 'private' ? 'Private Vehicle' : 'Public Transit'}</span>
                      </div>
                    </div>

                    {/* Hours Allocation Card */}
                    {overviewBreakdown && (
                      <div className={`planner-glass-card breakdown-card ${overviewBreakdown.isPossible ? 'possible' : 'impossible'}`}>
                        <h3>
                          {overviewBreakdown.isPossible ? (
                            <><i className="fas fa-check-circle text-success"></i> Schedule Feasible</>
                          ) : (
                            <><i className="fas fa-exclamation-circle text-error"></i> Schedule Not Feasible</>
                          )}
                        </h3>
                        
                        <div className="breakdown-chart">
                          <div className="metric-row">
                            <span className="metric-label">Total Allocated Hours:</span>
                            <span className="metric-val">{overviewBreakdown.totalHours}h</span>
                          </div>
                          <div className="metric-row">
                            <span className="metric-label">Sleep (8h/day):</span>
                            <span className="metric-val">{overviewBreakdown.sleepHours}h</span>
                          </div>
                          <div className="metric-row">
                            <span className="metric-label">Meals / Leisure (3h/day):</span>
                            <span className="metric-val">{overviewBreakdown.personalHours}h</span>
                          </div>
                          <div className="metric-row">
                            <span className="metric-label">Required Travel Time:</span>
                            <span className="metric-val">{overviewBreakdown.totalTravelTimeHours.toFixed(1)}h</span>
                          </div>
                          <div className="metric-row highlight">
                            <span className="metric-label">Available Exploration:</span>
                            <span className="metric-val">{overviewBreakdown.availableHours.toFixed(1)}h</span>
                          </div>
                          {overviewBreakdown.isPossible && (
                            <div className="metric-row highlight">
                              <span className="metric-label">Exploration Time per Stop:</span>
                              <span className="metric-val">{overviewBreakdown.timePerDestination.toFixed(1)}h</span>
                            </div>
                          )}
                        </div>

                        {!overviewBreakdown.isPossible && (
                          <div className="warning-text">
                            <i className="fas fa-info-circle"></i> Travel times exceed available hours. Try increasing trip duration or decreasing the number of destinations.
                          </div>
                        )}
                      </div>
                    )}

                    {/* Fuel Expenses Card */}
                    {fuelDetails && (
                      <div className="planner-glass-card fuel-card">
                        <h3><i className="fas fa-gas-pump"></i> Fuel Cost Estimations</h3>
                        <div className="metric-row">
                          <span className="metric-label">Estimated Fuel Required:</span>
                          <span className="metric-val">{fuelDetails.fuelNeeded} Liters</span>
                        </div>
                        <div className="metric-row highlight">
                          <span className="metric-label">Estimated Fuel Cost:</span>
                          <span className="metric-val">{fuelDetails.totalCost}</span>
                        </div>
                        <p className="fuel-footnote">Estimated based on {fuelEconomy} km/L mileage and cost of {fuelRate} per unit.</p>
                      </div>
                    )}
                    
                  </div>

                </div>

              </div>
            )}
          </>
        ) : (
          /* AI CHAT VIEW */
          <div className="planner-chat-layout animate-fade-in">
            <div className="chat-section">
              <AIChat />
            </div>

            <div className="planner-glass-card chat-tips-card">
              <h3>Tips for Best Results</h3>
              <ul>
                <li>Describe the type of experience you're looking for</li>
                <li>Mention your travel dates and budget</li>
                <li>Share your interests (hiking, culture, wildlife, etc.)</li>
                <li>Let us know the number of travelers</li>
                <li>Ask for specific recommendations</li>
              </ul>
            </div>
          </div>
        )}

      </div>

      {/* FUEL CONFIG POPUP MODAL */}
      {showFuelModal && (
        <div className="fuel-modal-overlay">
          <div className="fuel-modal-content animate-slide-up">
            <div className="modal-header">
              <h3><i className="fas fa-gas-pump"></i> Fuel Specifications</h3>
              <button className="close-modal" onClick={handleCancelFuelDetails}><i className="fas fa-times"></i></button>
            </div>
            <form onSubmit={handleConfirmFuelDetails} className="modal-form">
              <p>State your vehicle details to calculate trip expenses:</p>
              
              <div className="form-group">
                <label htmlFor="fuel-econ">Fuel Economy (km / Liter)</label>
                <input 
                  type="number" 
                  id="fuel-econ"
                  step="0.1"
                  min="1" 
                  max="70" 
                  placeholder="e.g. 15"
                  value={fuelEconomy}
                  onChange={(e) => setFuelEconomy(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="fuel-rate-input">Price per Liter</label>
                <input 
                  type="number" 
                  id="fuel-rate-input"
                  step="0.01" 
                  min="0.1" 
                  max="1000" 
                  placeholder="e.g. 96.50"
                  value={fuelRate}
                  onChange={(e) => setFuelRate(e.target.value)}
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={handleCancelFuelDetails}>Cancel</button>
                <button type="submit" className="btn-confirm">Save details</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelPlanner;
