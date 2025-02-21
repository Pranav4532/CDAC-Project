import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { fetchAIDescription } from "../../api/gemini";
import Navbar from "../../components/Navbar";

function BookDetail({ favorites, setFavorites, cart, setCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [aiDescription, setAIDescription] = useState("");
  const [similarBooks, setSimilarBooks] = useState([]);

  useEffect(() => {
    axios
      .get(`https://www.googleapis.com/books/v1/volumes/${id}`)
      .then(async (response) => {
        setBook(response.data);

        const description = await fetchAIDescription(
          response.data.volumeInfo.title,
          response.data.volumeInfo.authors?.[0] || "Unknown Author"
        );
        setAIDescription(description);

        fetchSimilarBooks(response.data.volumeInfo.title);
      })
      .catch((error) => console.error("Error fetching book details:", error));
  }, [id]);

  const fetchSimilarBooks = async (query) => {
    axios
      .get(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=5`)
      .then((response) => {
        const books = response.data.items || [];
        setSimilarBooks(books);
      })
      .catch((error) => console.error("Error fetching similar books:", error));
  };

  const handleAddToCart = (book) => {
    if (!cart.some((item) => item.id === book.id)) {
      setCart([...cart, book]);
    }
    navigate("/order");
  };

  const handleAddToWishlist = (book) => {
    if (!favorites.some((fav) => fav.id === book.id)) {
      setFavorites([...favorites, book]);
    }
    navigate("/favorites");
  };

  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar cart={cart} favorites={favorites} />
      <div className="container mt-4">
        <h2 className="text-center bg-danger text-white py-2 rounded">{book.volumeInfo.title}</h2>
        <div className="row mt-4">
          <div className="col-md-4">
            <img
              src={book.volumeInfo.imageLinks?.thumbnail || "https://via.placeholder.com/150x200?text=No+Image"}
              alt={book.volumeInfo.title}
              className="img-fluid rounded shadow"
            />
          </div>
          <div className="col-md-8">
            <table className="table">
              <tbody>
                <tr>
                  <th>Title</th>
                  <td>{book.volumeInfo.title}</td>
                </tr>
                <tr>
                  <th>Author</th>
                  <td>{book.volumeInfo.authors?.join(", ") || "Unknown"}</td>
                </tr>
                <tr>
                  <th>Category</th>
                  <td>{book.volumeInfo.categories?.join(", ") || "Unknown"}</td>
                </tr>
                <tr>
                  <th>Price</th>
                  <td>₹{Math.floor(Math.random() * 500) + 100}</td>
                </tr>
              </tbody>
            </table>
            <div className="d-flex gap-2">
              <button className="btn btn-primary" onClick={() => handleAddToCart(book)}>
                <i className="bi bi-cart-plus"></i> Add to Cart
              </button>
              <button className="btn btn-success" onClick={() => handleAddToWishlist(book)}>
                <i className="bi bi-heart"></i> Add to Wishlist
              </button>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="bg-secondary text-white py-2 rounded text-center">Book Description</h3>
          <p>{aiDescription}</p>
        </div>
        <h4 className="mt-4 bg-danger text-white py-2 rounded text-center">Similar Books</h4>
        <div className="row">
          {similarBooks.map((similarBook, index) => (
            <div key={index} className="col-md-2">
              <div className="card shadow-sm">
                <img
                  src={
                    similarBook.volumeInfo.imageLinks?.thumbnail ||
                    "https://via.placeholder.com/128x192?text=No+Image"
                  }
                  alt={similarBook.volumeInfo.title}
                  className="card-img-top"
                />
                <div className="card-body">
                  <h6 className="card-title">{similarBook.volumeInfo.title}</h6>
                  <p className="card-text text-muted">
                    {similarBook.volumeInfo.authors?.join(", ") || "Unknown Author"}
                  </p>
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => navigate(`/book/${similarBook.id}`)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BookDetail;