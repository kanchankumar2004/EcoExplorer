import React, { useState, useContext, createContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      // Simulated login - replace with actual API call
      setTimeout(() => {
        setIsAuthenticated(true);
        setUser({ email, id: '123', name: 'User' });
        setLoading(false);
      }, 1000);
    } catch (error) {
      setLoading(false);
      console.error('Login failed:', error);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      // Simulated registration - replace with actual API call
      setTimeout(() => {
        setIsAuthenticated(true);
        setUser(userData);
        setLoading(false);
      }, 1000);
    } catch (error) {
      setLoading(false);
      console.error('Registration failed:', error);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        login,
        register,
        logout,
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
