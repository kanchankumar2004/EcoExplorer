const fs = require('fs');

const generateDestinations = (count, startId) => {
  const dests = [];
  const names = ['Peak Retreat', 'Valley Sanctuary', 'Forest Reserve', 'Mountain Echoes', 'River Bend', 'Highland Escape', 'Sunrise Point', 'Cloud End'];
  const locations = ['Dehradun', 'Mussoorie', 'Pithoragarh', 'Uttarkashi', 'Chakrata', 'Pauri', 'Tehri', 'Champawat', 'Bageshwar', 'Kausani', 'Mukteshwar', 'Auli'];
  const images = [
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80'
  ];
  
  for(let i = 0; i < count; i++) {
    // Uttarakhand approx bounds: Lat 28.7 to 31.4, Lng 77.5 to 81.0
    const lat = 29.0 + Math.random() * 2.0;
    const lng = 78.0 + Math.random() * 2.0;
    const loc = locations[i % locations.length];
    const name = `${loc} ${names[i % names.length]}`;
    const img = images[i % images.length];
    
    dests.push({
      id: startId + i,
      name: name,
      image: img,
      images: [img],
      rating: parseFloat((4.0 + Math.random()).toFixed(1)),
      reviews: Math.floor(Math.random() * 300) + 50,
      reviewsCount: Math.floor(Math.random() * 300) + 50,
      price: `From $${Math.floor(Math.random() * 50) + 40}/day`,
      location: `${loc}, Uttarakhand, India`,
      latitude: parseFloat(lat.toFixed(4)),
      longitude: parseFloat(lng.toFixed(4)),
      tags: ['Eco-Tourism', 'Nature', 'Offbeat'],
      description: `A beautiful and serene eco-tourism destination in ${loc}.`,
      longDescription: `Explore the pristine beauty of ${loc} with sustainable eco-tourism practices. A perfect getaway for nature lovers seeking peace and tranquility.`,
      highlights: ['Nature walks', 'Bird watching', 'Local culture immersion', 'Eco-trails'],
      amenities: ['Eco-lodges', 'Local guides', 'Organic food'],
      reviewsList: []
    });
  }
  return dests;
};

const generateHomestays = (count, startId) => {
  const stays = [];
  const names = ['Heritage Home', 'Eco Cottage', 'Village Stay', 'Mountain Lodge', 'Forest Cabin', 'Riverside Camp', 'Farm Retreat', 'Valley View Home'];
  const locations = ['Dehradun', 'Mussoorie', 'Pithoragarh', 'Uttarkashi', 'Chakrata', 'Pauri', 'Tehri', 'Champawat', 'Bageshwar', 'Kausani', 'Mukteshwar', 'Auli'];
  const images = [
    'https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?auto=format&fit=crop&w=600&q=80'
  ];
  
  for(let i = 0; i < count; i++) {
    const lat = 29.0 + Math.random() * 2.0;
    const lng = 78.0 + Math.random() * 2.0;
    const loc = locations[Math.floor(Math.random() * locations.length)];
    const name = `${loc} ${names[i % names.length]}`;
    const img = images[i % images.length];
    
    stays.push({
      id: startId + i,
      name: name,
      image: img,
      location: `${loc}, Uttarakhand, India`,
      latitude: parseFloat(lat.toFixed(4)),
      longitude: parseFloat(lng.toFixed(4)),
      rating: parseFloat((4.0 + Math.random()).toFixed(1)),
      reviews: Math.floor(Math.random() * 200) + 20,
      reviewsCount: Math.floor(Math.random() * 200) + 20,
      pricePerNight: Math.floor(Math.random() * 60) + 30,
      maxGuests: Math.floor(Math.random() * 4) + 2,
      amenities: ['WiFi', 'Mountain View', 'Local Food', 'Garden'],
      description: 'A comfortable eco-friendly stay with authentic local experiences.',
      longDescription: `Stay with a local family in ${loc} and experience the rich culture and natural beauty of Uttarakhand.`,
      facilities: ['Clean rooms', 'Home cooked meals', 'Hot water', 'Farm access'],
      localExperiences: [
        {
          id: startId + i + '-exp',
          title: 'Village Farm Tour',
          price: 10,
          duration: '2 Hours',
          instructor: 'Local Host',
          category: 'Agriculture',
          image: img,
          description: 'Learn about organic farming practices in the Himalayas.'
        }
      ],
      reviewsList: []
    });
  }
  return stays;
};

// Generate 40 of each to reach 50 total
const extraDestinations = generateDestinations(40, 11);
const extraHomestays = generateHomestays(40, 11);

const content = 'export const extraDestinations = ' + JSON.stringify(extraDestinations, null, 2) + ';\n\nexport const extraHomestays = ' + JSON.stringify(extraHomestays, null, 2) + ';\n';

fs.writeFileSync('src/utils/extraMockData.js', content);
console.log("extraMockData.js created successfully with 40 additional items each.");
