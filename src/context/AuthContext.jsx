import React, { useState, useContext, createContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('eco_token') || '');

  // Load user session on startup if token exists
  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem('eco_token');
      if (storedToken) {
        setToken(storedToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
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
      setToken(data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      
      const { token, ...userData } = data;
      setUser(userData);
      setIsAuthenticated(true);
      setLoading(false);
      return { success: true, user: userData };
    } catch (error) {
      setLoading(false);
      const data = error.response?.data || {};
      const message = data.message || 'Invalid email or password';
      return { success: false, message, email: data.email };
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/register', userData);
      setLoading(false);
      return { success: true, email: res.data.email };
    } catch (error) {
      setLoading(false);
      const message = error.response?.data?.message || 'Registration failed';
      return { success: false, message };
    }
  };

// verifyEmailCode removed

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setToken('');
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

  const deleteAccount = async () => {
    setLoading(true);
    try {
      await axios.delete('/api/auth/profile');
      logout();
      return { success: true };
    } catch (error) {
      setLoading(false);
      const message = error.response?.data?.message || 'Failed to delete account';
      return { success: false, message };
    }
  };

  const loginWithToken = async (token) => {
    setLoading(true);
    localStorage.setItem('eco_token', token);
    setToken(token);
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
        token,
        loading,
        login,
        loginWithToken,
        register,
        logout,
        updateProfile,
        changePassword,
        deleteAccount,
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
