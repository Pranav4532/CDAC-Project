import React, { createContext, useState, useContext } from "react";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  const toggleWishlist = (book) => {
    setWishlist((prevWishlist) => {
      const exists = prevWishlist.some((fav) => fav.id === book.id);
      return exists
        ? prevWishlist.filter((fav) => fav.id !== book.id)
        : [...prevWishlist, book];
    });
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
