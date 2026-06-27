import React, { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

export const useFavorites = () => {
  return useContext(FavoritesContext);
};

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('ecoexplorer_favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  useEffect(() => {
    localStorage.setItem('ecoexplorer_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (item, type) => {
    setFavorites((prev) => {
      // Prevent duplicates
      const exists = prev.some((fav) => fav.id === item.id || fav._id === item._id);
      if (exists) return prev;
      
      const normalizedItem = {
        ...item,
        id: item._id || item.id,
        type: type // 'destination' or 'homestay'
      };
      return [...prev, normalizedItem];
    });
  };

  const removeFavorite = (id) => {
    setFavorites((prev) => prev.filter((fav) => (fav.id || fav._id) !== id));
  };

  const isFavorite = (id) => {
    return favorites.some((fav) => (fav.id || fav._id) === id);
  };

  const value = {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
