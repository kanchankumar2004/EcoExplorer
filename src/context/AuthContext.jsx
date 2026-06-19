import React, { useState, useContext, createContext } from 'react';

const AuthContext = createContext();

const DEFAULT_USERS = [
  {
    id: '123',
    name: 'Eco Traveler',
    email: 'traveler@ecoexplorer.com',
    password: 'password',
    userType: 'traveler'
  },
  {
    id: '456',
    name: 'Eco Host',
    email: 'host@ecoexplorer.com',
    password: 'password',
    userType: 'host'
  },
  {
    id: '789',
    name: 'Eco Admin',
    email: 'admin@ecoexplorer.com',
    password: 'password',
    userType: 'admin'
  }
];

export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState(() => {
    const localUsers = localStorage.getItem('eco_users');
    if (localUsers) return JSON.parse(localUsers);
    localStorage.setItem('eco_users', JSON.stringify(DEFAULT_USERS));
    return DEFAULT_USERS;
  });

  const [user, setUser] = useState(() => {
    const sessionUser = localStorage.getItem('eco_session_user');
    return sessionUser ? JSON.parse(sessionUser) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('eco_session_user') !== null;
  });

  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    // Simulate brief network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    const foundUser = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (foundUser) {
      const { password: _, ...sessionUser } = foundUser;
      setUser(sessionUser);
      setIsAuthenticated(true);
      localStorage.setItem('eco_session_user', JSON.stringify(sessionUser));
      setLoading(false);
      return true;
    }
    setLoading(false);
    return false;
  };

  const register = async (userData) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    const exists = users.some(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (exists) {
      setLoading(false);
      return false;
    }
    const newUser = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      password: userData.password,
      userType: userData.userType || 'traveler'
    };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('eco_users', JSON.stringify(updatedUsers));
    setLoading(false);
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('eco_session_user');
  };

  const updateProfile = async (profileData) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    const updatedUsers = users.map(u => {
      if (u.id === user.id) {
        return { ...u, ...profileData };
      }
      return u;
    });
    setUsers(updatedUsers);
    localStorage.setItem('eco_users', JSON.stringify(updatedUsers));

    const updatedSessionUser = { ...user, ...profileData };
    setUser(updatedSessionUser);
    localStorage.setItem('eco_session_user', JSON.stringify(updatedSessionUser));
    setLoading(false);
    return true;
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
        updateProfile,
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
