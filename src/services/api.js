import axios from 'axios';

const API_BASE_URL = 'https://api.ecoexplorer.com/api'; // Replace with your API URL

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Destinations API
export const destinationAPI = {
  getAll: () => api.get('/destinations'),
  getById: (id) => api.get(`/destinations/${id}`),
  search: (query) => api.get('/destinations/search', { params: { q: query } }),
};

// Homestays API
export const homestayAPI = {
  getAll: () => api.get('/homestays'),
  getById: (id) => api.get(`/homestays/${id}`),
  search: (query) => api.get('/homestays/search', { params: { q: query } }),
  book: (id, bookingData) => api.post(`/homestays/${id}/book`, bookingData),
};

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
};

// User API
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
  getFavorites: () => api.get('/users/favorites'),
  addFavorite: (id) => api.post(`/users/favorites/${id}`),
  removeFavorite: (id) => api.delete(`/users/favorites/${id}`),
};

// Bookings API
export const bookingAPI = {
  getMyBookings: () => api.get('/bookings/my-bookings'),
  getBookingDetails: (id) => api.get(`/bookings/${id}`),
  cancelBooking: (id) => api.post(`/bookings/${id}/cancel`),
};

// Reviews API
export const reviewAPI = {
  getDestinationReviews: (id) => api.get(`/destinations/${id}/reviews`),
  addReview: (id, reviewData) => api.post(`/destinations/${id}/reviews`, reviewData),
};

export default api;
