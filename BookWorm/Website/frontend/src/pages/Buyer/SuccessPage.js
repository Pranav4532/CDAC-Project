import React from "react";
import { Link, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function SuccessPage() {
  const location = useLocation();
  const { cart, paymentMethod } = location.state || { cart: [], paymentMethod: "Unknown" };

  return (
    <div className="container text-center mt-5">
      <h2 className="text-success">🎉 Order Placed Successfully! 🎉</h2>
      <p className="lead">Thank you for your purchase.</p>

      <div className="card p-4 mt-4">
        <h4>Order Summary</h4>
        <ul className="list-group mb-3">
          {cart.map((book, index) => (
            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{book.volumeInfo.title}</strong>
                <p className="mb-0 text-muted">{book.volumeInfo.authors?.join(", ") || "Unknown Author"}</p>
              </div>
              <span className="badge bg-success">₹{book.price * (book.quantity || 1)}</span>
            </li>
          ))}
        </ul>
        <h5>Payment Method: <span className="text-primary">{paymentMethod}</span></h5>
      </div>

      <Link to="/books" className="btn btn-primary mt-4">Back to Book List</Link>
    </div>
  );
}

export default SuccessPage;
