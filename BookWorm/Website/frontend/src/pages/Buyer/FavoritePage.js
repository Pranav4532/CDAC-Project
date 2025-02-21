import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../../components/Navbar";

function FavoritePage({ favorites = [], setFavorites, cart = [] }) {
  const navigate = useNavigate();

  const removeFromFavorites = (bookId) => {
    setFavorites(favorites.filter((book) => book.id !== bookId));
  };

  return (
    <div>
      <Navbar cart={cart} favorites={favorites} />
      <div className="container mt-4">
        <h2 className="text-center bg-danger text-white py-2 rounded">My Wishlist</h2>

        {favorites.length === 0 ? (
          <p className="text-center mt-4">No books in your wishlist.</p>
        ) : (
          <div className="row">
            {favorites.map((book, index) => (
              <div key={index} className="col-md-3 mb-4">
                <div className="card shadow-sm">
                  <img
                    src={book.volumeInfo?.imageLinks?.thumbnail || "https://via.placeholder.com/128x192?text=No+Image"}
                    alt={book.volumeInfo?.title || "No Title"}
                    className="card-img-top"
                  />
                  <div className="card-body">
                    <h6 className="card-title">{book.volumeInfo?.title || "No Title"}</h6>
                    <p className="card-text text-muted">{book.volumeInfo?.authors?.join(", ") || "Unknown Author"}</p>
                    <p className="card-text text-success">₹{book.price || "N/A"}</p>
                    <button className="btn btn-danger btn-sm" onClick={() => removeFromFavorites(book.id)}>
                      <i className="bi bi-trash"></i> Remove
                    </button>
                    <Link to={`/book/${book.id}`} className="btn btn-outline-primary btn-sm ms-2">
                      <i className="bi bi-eye"></i> View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FavoritePage;
