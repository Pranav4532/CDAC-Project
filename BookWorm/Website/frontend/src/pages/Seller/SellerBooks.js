import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { API_BOOK_URL } from "../../api/config";

const SellerBooks = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [sellerId, setSellerId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      setSellerId(decodedToken.id);
      console.log("Logged-in Seller ID:", decodedToken.id);
    } catch (error) {
      console.error("Error decoding token:", error);
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    if (sellerId) {
      fetchSellerBooks(sellerId);
    }
  }, [sellerId]);

  const fetchSellerBooks = async (sellerId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found. User not authenticated.");
        return;
      }

      console.log("Fetching books for seller ID:", sellerId);

      // Updated API request to pass sellerId as a query param
      const response = await axios.get(
        `${API_BOOK_URL}/seller/books?sellerId=${sellerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Books fetched:", response.data);
      setBooks(response.data);
    } catch (error) {
      console.error(
        "Error fetching seller books:",
        error.response?.data || error.message
      );
    }
  };

  const handleDelete = async (bookId) => {
    try {
      await axios.delete(`${API_BOOK_URL}/${bookId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setBooks(books.filter((book) => book.id !== bookId));
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>My Books</h2>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Title</th>
              <th>Author</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Seller ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.length > 0 ? (
              books.map((book) => (
                <tr key={book.id}>
                  <td>{book.id}</td>
                  <td>
                    <img
                      src={`/images/${book.image_path}`}
                      alt={book.title}
                      style={{
                        width: "40px",
                        height: "40px",
                        objectFit: "cover",
                        borderRadius: "5px",
                      }}
                    />
                  </td>

                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>${book.price}</td>
                  <td>{book.stock}</td>
                  <td>{book.seller_id}</td>
                  <td>
                    <div className="d-flex">
                      <button
                        className="btn btn-warning me-2"
                        onClick={() => navigate(`/edit-book/${book.id}`)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(book.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  No books found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-between mt-3">
        <button
          className="btn btn-success"
          onClick={() => navigate("/add-book")}
        >
          Add New Book
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/seller")}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SellerBooks;
