import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../../components/Navbar"; 

function OrderPage({ cart = [], setCart, favorites = [] }) {
  const navigate = useNavigate();


  const calculateTotal = () => {
    return cart.reduce((total, book) => total + book.price * (book.quantity || 1), 0);
  };

  const handleIncreaseQuantity = (bookId) => {
    setCart(
      cart.map((book) =>
        book.id === bookId ? { ...book, quantity: (book.quantity || 1) + 1 } : book
      )
    );
  };

  const handleDecreaseQuantity = (bookId) => {
    setCart(
      cart.map((book) =>
        book.id === bookId && book.quantity > 1
          ? { ...book, quantity: book.quantity - 1 }
          : book
      )
    );
  };

  const handleRemoveFromCart = (bookId) => {
    setCart(cart.filter((book) => book.id !== bookId));
  };

  return (
    <div>
      <Navbar cart={cart} favorites={favorites} />
      <div className="container mt-4">
        <h2 className="text-center bg-danger text-white py-2 rounded">Your Order</h2>

        {cart.length === 0 ? (
          <div className="text-center">
            <p>Your cart is empty. Add some books to proceed.</p>
            <Link to="/books" className="btn btn-primary">
              Browse Books
            </Link>
          </div>
        ) : (
          <div className="row">
            <div className="col-md-8">
              <ul className="list-group mb-4">
                {cart.map((book) => (
                  <li key={book.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <img
                        src={book.volumeInfo.imageLinks?.thumbnail || "https://via.placeholder.com/64x100?text=No+Image"}
                        alt={book.volumeInfo.title}
                        style={{ width: "64px", height: "100px", marginRight: "15px" }}
                      />
                      <div>
                        <h6>{book.volumeInfo.title}</h6>
                        <p className="mb-0 text-muted">
                          {book.volumeInfo.authors?.join(", ") || "Unknown Author"}
                        </p>
                        <p className="mb-0 text-success">₹{book.price * (book.quantity || 1)}</p>
                      </div>
                    </div>

                    <div className="d-flex align-items-center">
                      <button className="btn btn-outline-secondary btn-sm me-2" onClick={() => handleDecreaseQuantity(book.id)}>
                        <i className="bi bi-dash"></i>
                      </button>
                      <span className="mx-2">{book.quantity || 1}</span>
                      <button className="btn btn-outline-secondary btn-sm me-2" onClick={() => handleIncreaseQuantity(book.id)}>
                        <i className="bi bi-plus"></i>
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleRemoveFromCart(book.id)}>
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-md-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Order Summary</h5>
                  <hr />
                  <p>Total Items: {cart.reduce((total, book) => total + (book.quantity || 1), 0)}</p>
                  <p>Total Price: ₹{calculateTotal()}</p>
                  <hr />
                  <button className="btn btn-success w-100" onClick={() => navigate("/payment")}>
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderPage;
