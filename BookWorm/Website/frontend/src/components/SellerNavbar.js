import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function Navbar({ cart }) {
  const navigate = useNavigate();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <button className="btn btn-light me-2" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left"></i> Back
        </button>

        <Link className="navbar-brand" to="/books">
          Book Worm
        </Link>

        <div className="search-bar d-flex">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Search books..."
          />
          <button className="btn btn-light">Search</button>
        </div>

        <div className="d-flex align-items-center">

          <Link to="/sellerbook" className="btn btn-light me-2">
            <i className="bi bi-book"></i> Books
          </Link>

          <Link to="/profile" className="btn btn-light">
            <i className="bi bi-person-circle"></i> Profile
          </Link>
          <Link to="/" className="btn btn-warning ms-3">
            <i className="bi bi-box-arrow-in-right"></i> Logout
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
