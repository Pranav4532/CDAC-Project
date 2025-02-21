import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { API_USER_URL } from "../api/config";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    role: "buyer",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await axios.post(`${API_USER_URL}/register`, formData);
      setSuccess("🎉 Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-dark text-white">
      <div
        className="card shadow-lg p-4 animated-card"
        style={{
          width: "90%",
          maxWidth: "350px", // Prevents it from getting too large
          borderRadius: "15px",
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          overflowY: "auto", // Allows scrolling if needed
        }}
      >
        <h2 className="text-center mb-3 text-light">📝 Register</h2>

        {error && <p className="text-danger text-center">{error}</p>}
        {success && <p className="text-success text-center">{success}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-light">Full Name</label>
            <input
              type="text"
              name="name"
              className="form-control rounded-pill"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-light">Username</label>
            <input
              type="text"
              name="username"
              className="form-control rounded-pill"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-light">Email</label>
            <input
              type="email"
              name="email"
              className="form-control rounded-pill"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-light">Phone</label>
            <input
              type="text"
              name="phone"
              className="form-control rounded-pill"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-light">Password</label>
            <input
              type="password"
              name="password"
              className="form-control rounded-pill"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-light">Role</label>
            <select
              name="role"
              className="form-select rounded-pill"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-warning w-100 fw-bold rounded-pill"
          >
            🚀 Register Now
          </button>

          <div className="text-center mt-3">
            <p className="text-light">
              Already have an account?{" "}
              <Link to="/" className="text-warning fw-bold">
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
