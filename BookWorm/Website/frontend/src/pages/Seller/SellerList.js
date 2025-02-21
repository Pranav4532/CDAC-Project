import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/SellerNavbar";

const SellerBooks = ({ cart, setCart }) => {
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState("programming");
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, [query]);

  const fetchBooks = async () => {
    if (!query.trim()) return;
  
    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=40`
      );
  
      const fetchedBooks = response.data.items || [];
      const booksWithPrice = fetchedBooks.map((book) => ({
        ...book,
        id: book.id,
        price: Math.floor(Math.random() * 500) + 100,
      }));
  
      setBooks(booksWithPrice);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };
  

  return (
    <div>
      <Navbar cart={cart} />
      <div className="container mt-4">
        <h2>Book List</h2>
        
        {/* Search Bar */}
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search books..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Books Grid */}
        <div className="row">
          {books.length > 0 ? (
            books.map((book, index) => (
              <div key={index} className="col-md-3 mb-4">
                <div className="card shadow-sm position-relative" onClick={() => navigate(`/book/${book.id}`)}>
                  <img
                    src={book.volumeInfo.imageLinks?.thumbnail || "https://via.placeholder.com/128x192?text=No+Image"}
                    alt={book.volumeInfo.title}
                    className="card-img-top"
                  />
                  <div className="card-body">
                    <h6 className="card-title">{book.volumeInfo.title}</h6>
                    <p className="card-text text-success">₹{book.price}</p>
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
  );
};

export default SellerBooks;
