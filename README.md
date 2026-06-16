# EcoExplorer - AI-Assisted Eco-Tourism & Homestay Platform

A modern, fully functional frontend for an eco-tourism and homestay booking platform powered by artificial intelligence. Built with React, React Router, and pure CSS.

## 🌿 Features

### Pages
- **Home** - Welcome page with featured destinations and homestays
- **Destinations** - Browse all available eco-tourism destinations
- **Destination Details** - View detailed information, reviews, and maps
- **Homestays** - Browse all available homestays
- **Homestay Details** - View homestay details with booking form
- **AI Planner** - AI-powered travel planning assistant
- **Login/Register** - User authentication pages
- **Profile** - User profile management
- **Favorites** - Save and manage favorite destinations
- **My Bookings** - View and manage bookings
- **Owner Dashboard** - Dashboard for homestay owners
- **Admin Dashboard** - Admin panel for platform management

### Components
- **Navbar** - Responsive navigation with mobile menu
- **Footer** - Comprehensive footer with links
- **Hero** - Beautiful hero section for pages
- **SearchBar** - Advanced search with filters
- **DestinationCard** - Card component for destinations
- **HomestayCard** - Card component for homestays
- **AIChat** - Interactive AI chat assistant
- **BookingCard** - Booking information display
- **ReviewCard** - User review component
- **MapView** - Location map placeholder

### Styling
- Pure CSS 
- Responsive design (Mobile-first approach)
- Beautiful color scheme (Green theme: #2d5016, #7fd051)
- Smooth animations and transitions
- Professional UI/UX

## 📁 Project Structure

```
EcoExplorer/
├── src/
│   ├── pages/              # All page components
│   ├── components/         # Reusable components
│   ├── layouts/            # Layout components
│   ├── services/           # API services
│   ├── context/            # React context (Auth)
│   ├── App.jsx             # Main app with routing
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── vite.config.js          # Vite configuration
├── eslint.config.js        # ESLint configuration
├── package.json            # Dependencies
└── index.html              # HTML template
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd EcoExplorer
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

## 📦 Build

To create a production build:

```bash
npm run build
```

This will generate optimized files in the `dist` folder.

## 🎨 Styling Guide

### Color Scheme
- Primary Green: `#2d5016`
- Accent Green: `#7fd051`
- Neutral: `#f5f5f5`
- Text: `#333`
- Secondary Text: `#666`

### CSS Structure
- Each component has its own CSS file
- Each page has its own CSS file
- Global styles in `index.css`
- Responsive design using CSS Grid and Flexbox

## 🔐 Authentication

The app includes a mock authentication system using React Context. Replace the simulated login/register in `AuthContext.jsx` with actual API calls to your backend.

### Current Flow
1. User registers or logs in
2. Credentials stored in context
3. Protected routes check authentication status
4. User can access profile, favorites, and bookings

## 📡 API Integration

The app has pre-configured API endpoints in `services/api.js`. Update the `API_BASE_URL` to connect to your backend:

```javascript
const API_BASE_URL = 'https://your-api.com/api';
```

### Available API Methods
- **destinationAPI** - Get destinations
- **homestayAPI** - Get homestays and book
- **authAPI** - Login/register
- **userAPI** - User profile and favorites
- **bookingAPI** - User bookings
- **reviewAPI** - Reviews

## 🛣️ Routing

Routes are configured in `App.jsx`:

```javascript
/                    - Home page
/destinations        - Destinations listing
/destinations/:id    - Destination details
/homestays          - Homestays listing
/homestays/:id      - Homestay details
/ai-planner         - AI travel planner
/login              - Login page
/register           - Register page
/profile            - User profile (protected)
/favorites          - Saved favorites (protected)
/my-bookings        - User bookings (protected)
/owner-dashboard    - Host dashboard (protected)
/admin-dashboard    - Admin panel (protected)
```

## 💡 Customization

### Modifying Colors
Update the color values in CSS files:
- Primary: Change `#2d5016`
- Accent: Change `#7fd051`

### Adding New Pages
1. Create a new page file in `src/pages/`
2. Add a corresponding CSS file
3. Import in `App.jsx`
4. Add route in the Routes component

### Adding New Components
1. Create component in `src/components/`
2. Create accompanying CSS file
3. Export and use in pages

## 📱 Responsive Design

The design is fully responsive with breakpoints at:
- Desktop: > 1024px
- Tablet: 768px - 1024px
- Mobile: < 768px

## 🔧 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build locally
```

## 📚 Dependencies

- **react** - UI library
- **react-dom** - DOM rendering
- **react-router-dom** - Routing
- **axios** - HTTP client
- **vite** - Build tool

## 🎯 Next Steps

1. **Connect Backend** - Replace mock API calls with real endpoints
2. **Add Payment Integration** - Implement payment gateway for bookings
3. **Implement Real Maps** - Replace MapView placeholder with Google Maps
4. **Add Image Upload** - Allow users to upload profile pictures
5. **Enhance AI Chat** - Integrate with AI API (OpenAI, etc.)
6. **Add Notifications** - Implement real-time notifications
7. **Mobile App** - Consider React Native for mobile
8. **Analytics** - Add Google Analytics or similar
9. **SEO Optimization** - Add meta tags and structured data
10. **Testing** - Add unit and integration tests

## 🤝 Contributing

Feel free to customize and extend this project according to your needs.

**Happy Coding! 🌍🌿**

For more information about the EcoExplorer project, please refer to the documentation or contact the development team.
