import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import MainLayout from './layouts/MainLayout';

// Pages
import Home from './pages/Home';
import Destinations from './pages/Destinations';
import DestinationDetails from './pages/DestinationDetails';
import Homestays from './pages/Homestays';
import HomestayDetails from './pages/HomestayDetails';
import TravelPlanner from './pages/TravelPlanner';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Favorites from './pages/Favorites';
import MyBookings from './pages/MyBookings';
import OwnerDashboard from './pages/OwnerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Showcase from './pages/Showcase';

// Private Route Component
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function AppContent() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/"
        element={
          <MainLayout>
            <Home />
          </MainLayout>
        }
      />

      <Route
        path="/destinations"
        element={
          <MainLayout>
            <Destinations />
          </MainLayout>
        }
      />

      <Route
        path="/destinations/:id"
        element={
          <MainLayout>
            <DestinationDetails />
          </MainLayout>
        }
      />

      <Route
        path="/homestays"
        element={
          <MainLayout>
            <Homestays />
          </MainLayout>
        }
      />

      <Route
        path="/homestays/:id"
        element={
          <MainLayout>
            <HomestayDetails />
          </MainLayout>
        }
      />

      <Route
        path="/travel-planner"
        element={
          <MainLayout>
            <TravelPlanner />
          </MainLayout>
        }
      />

      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <MainLayout>
              <Profile />
            </MainLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/favorites"
        element={
          <PrivateRoute>
            <MainLayout>
              <Favorites />
            </MainLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/my-bookings"
        element={
          <PrivateRoute>
            <MainLayout>
              <MyBookings />
            </MainLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/owner-dashboard"
        element={
          <PrivateRoute>
            <MainLayout>
              <OwnerDashboard />
            </MainLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/admin-dashboard"
        element={
          <PrivateRoute>
            <MainLayout>
              <AdminDashboard />
            </MainLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/showcase"
        element={
          <MainLayout>
            <Showcase />
          </MainLayout>
        }
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
