import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { API_USER_URL } from "../api/config";

function Login() {
  const [showLogin, setShowLogin] = useState(false); // Controls login form visibility
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_USER_URL}/login`, formData);
      const token = response.data.token;
      localStorage.setItem("token", token);

      const decodedToken = jwtDecode(token);
      const userRole = decodedToken.role;

      alert("🎉 Login successful!");

      if (userRole === "buyer") {
        navigate("/books");
      } else if (userRole === "seller") {
        navigate("/seller");
      } else if (userRole === "admin") {
        navigate("/admin");
      } else {
        setError("Invalid role");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-dark text-white">
      {!showLogin ? (
        // Show Gift Animation First
        <div className="text-center">
          <h2 className="mb-4">Welcome To BookWorm!</h2>
          <img
            src="/loader.gif"
            alt="Gift"
            className="gift-animation"
            style={{ width: "500px", cursor: "pointer" }}
            onClick={() => setShowLogin(true)}
          />
        </div>
      ) : (
        // Show Login Form After Click
        <div
          className="card shadow-lg p-4 animated-card"
          style={{
            width: "400px",
            borderRadius: "15px",
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <h2 className="text-center mb-4 text-light">🔐 Login</h2>

          {error && <p className="text-danger text-center">{error}</p>}

          <form onSubmit={handleSubmit}>
            {/* Username */}
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

            {/* Password */}
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

            {/* Login Button */}
            <button
              type="submit"
              className="btn btn-warning w-100 fw-bold rounded-pill"
            >
              🚀 Login Now
            </button>

            {/* Register Link */}
            <div className="text-center mt-3">
              <p className="text-light">
                Don't have an account?{" "}
                <Link to="/register" className="text-warning fw-bold">
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Login;
