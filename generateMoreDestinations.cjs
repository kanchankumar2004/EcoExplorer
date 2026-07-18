const fs = require('fs');

const generateDestinations = (count, startId) => {
  const dests = [];
  const names = ['Peak Retreat', 'Valley Sanctuary', 'Forest Reserve', 'Mountain Echoes', 'River Bend', 'Highland Escape', 'Sunrise Point', 'Cloud End'];
  const locations = ['Badrinath', 'Kedarnath', 'Gangotri', 'Yamunotri', 'Joshimath', 'Rudraprayag', 'Devprayag', 'Karnaprayag', 'Nandaprayag', 'Vishnuprayag', 'Gopeshwar', 'Srinagar'];
  const images = [
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80'
  ];
  
  for(let i = 0; i < count; i++) {
    const lat = 30.0 + Math.random() * 1.0;
    const lng = 78.5 + Math.random() * 1.5;
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
      tags: ['Spiritual', 'Eco-Tourism', 'Nature'],
      description: `A beautiful and serene spiritual destination in ${loc}.`,
      longDescription: `Explore the pristine beauty of ${loc} with sustainable eco-tourism practices. A perfect getaway for nature lovers seeking peace and tranquility.`,
      highlights: ['Nature walks', 'Spiritual sites', 'Local culture immersion', 'Eco-trails'],
      amenities: ['Eco-lodges', 'Local guides', 'Organic food'],
      reviewsList: []
    });
  }
  return dests;
};

const moreDestinations = generateDestinations(20, 51);

const content = 'export const moreDestinations = ' + JSON.stringify(moreDestinations, null, 2) + ';\n';
fs.writeFileSync('src/utils/moreDestinations.js', content);
console.log("moreDestinations.js created successfully with 20 additional items.");
