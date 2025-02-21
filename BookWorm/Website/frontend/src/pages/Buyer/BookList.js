import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

function BookList({ favorites, setFavorites, cart, setCart }) {
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState("programming");
  const [priceFilter, setPriceFilter] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim()) return;

    axios
      .get(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=40`)
      .then((response) => {
        const fetchedBooks = response.data.items || [];
        const booksWithPrice = fetchedBooks.map((book) => ({
          ...book,
          id: book.id,
          price: Math.floor(Math.random() * 500) + 100, 
        }));
        setBooks(booksWithPrice);
      })
      .catch((error) => console.error("Error fetching books:", error));
  }, [query]);

  const toggleFavorite = (book) => {
    const isFavorite = favorites.some((fav) => fav.id === book.id);
    if (isFavorite) {
      setFavorites(favorites.filter((fav) => fav.id !== book.id));
    } else {
      setFavorites([...favorites, book]);
    }
  };

  const addToCart = (book) => {
    if (!cart.some((item) => item.id === book.id)) {
      setCart([...cart, book]);
    }
  };

  return (
    <div>
      <Navbar cart={cart} favorites={favorites} />

      <div className="container mt-4">
        <div className="row">
          <div className="col-md-3">
            <h5>Categories</h5>
            <ul className="list-group">
              {["All", "Biography", "Fiction", "Mystery", "Fantasy", "Romance"].map((category, index) => (
                <li key={index} className="list-group-item">{category}</li>
              ))}
            </ul>
            <h5 className="mt-4">Price Filter</h5>
            <input
              type="range"
              className="form-range"
              min="100"
              max="500"
              step="50"
              value={priceFilter}
              onChange={(e) => setPriceFilter(parseInt(e.target.value))}
            />
            <p>Filter by price: ₹{priceFilter}</p>
          </div>

          <div className="col-md-9">
            <h2>Book List</h2>
            <div className="row">
              {books.length > 0 ? (
                books.map((book, index) => (
                  <div key={index} className="col-md-3 mb-4">
                    <div className="card shadow-sm position-relative" onClick={() => navigate(`/book/${book.id}`)}>


                      <div
                        className="position-absolute top-0 end-0 p-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          
                          toggleFavorite(book);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <i
                          className={`bi ${
                            favorites.some((fav) => fav.id === book.id) ? "bi-heart-fill text-danger" : "bi-heart text-secondary"
                          }`}
                          style={{ fontSize: "20px" }}
                        ></i>
                      </div>

                      <img
                        src={book.volumeInfo.imageLinks?.thumbnail || "https://via.placeholder.com/128x192?text=No+Image"}
                        alt={book.volumeInfo.title}
                        className="card-img-top"
                      />
                      <div className="card-body">
                        <h6 className="card-title">{book.volumeInfo.title}</h6>
                        <p className="card-text text-success">₹{book.price}</p>
                        <button className="btn btn-primary btn-sm" onClick={(e) => {
                          e.stopPropagation();
                          addToCart(book);
                        }}>
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No books found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookList;