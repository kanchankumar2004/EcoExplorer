import React, { useState, useContext, createContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load user session on startup if token exists
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('eco_token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          const res = await axios.get('/api/auth/me');
          setUser(res.data);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Failed to load user session:', error);
          localStorage.removeItem('eco_token');
          delete axios.defaults.headers.common['Authorization'];
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      const data = res.data;
      
      localStorage.setItem('eco_token', data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      
      const { token, ...userData } = data;
      setUser(userData);
      setIsAuthenticated(true);
      setLoading(false);
      return { success: true, user: userData };
    } catch (error) {
      setLoading(false);
      const message = error.response?.data?.message || 'Invalid email or password';
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      await axios.post('/api/auth/register', userData);
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      const message = error.response?.data?.message || 'Registration failed';
      return { success: false, message };
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('eco_token');
    delete axios.defaults.headers.common['Authorization'];
  };

  const updateProfile = async (profileData) => {
    setLoading(true);
    try {
      const res = await axios.put('/api/auth/profile', profileData);
      setUser(res.data);
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      const message = error.response?.data?.message || 'Failed to update profile';
      return { success: false, message };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    setLoading(true);
    try {
      const res = await axios.put('/api/auth/change-password', { currentPassword, newPassword });
      setLoading(false);
      return { success: true, message: res.data.message || 'Password changed successfully!' };
    } catch (error) {
      setLoading(false);
      const message = error.response?.data?.message || 'Failed to change password';
      return { success: false, message };
    }
  };

  const loginWithToken = async (token) => {
    setLoading(true);
    localStorage.setItem('eco_token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
      const res = await axios.get('/api/auth/me');
      setUser(res.data);
      setIsAuthenticated(true);
      setLoading(false);
      return { success: true, user: res.data };
    } catch (error) {
      console.error('Failed to load user session with token:', error);
      localStorage.removeItem('eco_token');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      return { success: false };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        login,
        loginWithToken,
        register,
        logout,
        updateProfile,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
