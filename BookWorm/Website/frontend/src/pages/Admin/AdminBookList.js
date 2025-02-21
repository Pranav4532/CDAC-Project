import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/AdminNavbar";

function AdminBooks({ cart, setCart }) {
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState("programming");
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

  const editBook = (book) => {
    console.log("Editing book:", book);
  };

  const removeBook = (bookId) => {
    setBooks(books.filter((book) => book.id !== bookId));
  };

  return (
    <div>
      <Navbar cart={cart} />

      <div className="container mt-4">
        <h2>Book List</h2>
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
                    <button className="btn btn-warning btn-sm" onClick={(e) => {
                      e.stopPropagation();
                      editBook(book);
                    }}>
                      Edit
                    </button>
                    <button className="btn btn-danger btn-sm ms-2" onClick={(e) => {
                      e.stopPropagation();
                      removeBook(book.id);
                    }}>
                      Remove
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
  );
}

export default AdminBooks;
