import React, { useState, useContext, createContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [user, setUser] = useState({ name: 'Eco Traveler', email: 'traveler@ecoexplorer.com', id: '123', userType: 'traveler' });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    // Backend login disabled
  };

  const register = async (userData) => {
    // Backend registration disabled
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
