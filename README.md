# EcoExplorer - AI-Assisted Eco-Tourism & Homestay Platform

A modern, fully functional frontend for an eco-tourism and homestay booking platform powered by artificial intelligence. Built with React, React Router, and Tailwind CSS v4.

## 🌿 Features

### Pages
- **Home** - Welcome page with featured destinations and homestays
- **Destinations** - Browse all available eco-tourism destinations
- **Destination Details** - View detailed information, reviews, and maps
- **Homestays** - Browse all available homestays
- **Homestay Details** - View homestay details with booking form
- **AI Planner** - AI-powered travel planning assistant
- **Login/Register** - User authentication pages (frontend forms only)
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
- **Tailwind CSS v4** (Utility-first styling compiled externally using `@apply` and `@reference` in CSS files)
- Responsive design (Mobile-first approach)
- Beautiful color scheme (Green theme: `#2d5016`, `#7fd051`)
- Smooth animations and transitions
- Professional UI/UX

## 📁 Project Structure

```
EcoExplorer/
├── .vscode/
│   └── settings.json       # Editor linting overrides
├── src/
│   ├── pages/              # Page components & Tailwind CSS files
│   ├── components/         # Reusable components & Tailwind CSS files
│   ├── layouts/            # Layout components & Tailwind CSS files
│   ├── services/           # API services
│   ├── context/            # React context (Auth)
│   ├── App.jsx             # Main app with routing
│   ├── main.jsx            # Entry point
│   └── index.css           # Tailwind base & global styles
├── public/                 # Static assets
├── postcss.config.js       # PostCSS plugins config
├── tailwind.config.js      # Tailwind configuration
├── vite.config.js          # Vite configuration
├── eslint.config.js        # ESLint configuration
├── package.json            # Dependencies
└── index.html              # HTML template
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
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

### Tailwind CSS v4 Setup
The platform is styled using Tailwind CSS v4 with a CSS-first configuration model. Styles are separated into external CSS files for clean component structure, utilizing `@apply` to apply Tailwind classes.

- **Main Entry CSS (`src/index.css`)**: Imports Tailwind CSS via `@import "tailwindcss";`
- **Component & Page CSS**: Refer to the theme and utilities using `@reference "../index.css"` and use `@apply` for Tailwind declarations:
  ```css
  @reference "../index.css";

  .my-component {
    @apply flex items-center justify-between p-4 bg-white rounded-lg shadow;
  }
  ```

### Color Palette
- Primary Green: `#2d5016`
- Accent Green: `#7fd051`
- Neutral Light: `#f5f5f5`
- Text: `#333`
- Secondary Text: `#666`

## 🔐 Authentication & Client Routing

Authentication check gates (`PrivateRoute`) have been temporarily bypassed so that all pages (Profile, Favorites, Bookings, Dashboards) can be navigated and browsed freely without log-in/registration constraints.

- **Login/Register Frontend**: Forms are fully rendered but submission functionality is disabled on the frontend. Form submissions display a warning indicating registration/login is currently disabled.
- **Default State**: A default mock traveler session is pre-loaded in the global `AuthContext` to support context-based data displays.

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
/profile            - User profile (publicly bypassed)
/favorites          - Saved favorites (publicly bypassed)
/my-bookings        - User bookings (publicly bypassed)
/owner-dashboard    - Host dashboard (publicly bypassed)
/admin-dashboard    - Admin panel (publicly bypassed)
```

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
- **tailwindcss** - CSS styling framework
- **postcss** - CSS compiler toolchain
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
