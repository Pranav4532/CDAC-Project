import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { API_ADMIN_URL } from "../../api/config";

const AddEditSeller = () => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(""); 
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const validateToken = useCallback(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return null;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.role !== "admin") {
        alert("Access Denied! Only admins can modify sellers.");
        navigate("/");
        return null;
      }
      return token;
    } catch (error) {
      console.error("Error decoding token:", error);
      localStorage.removeItem("token");
      navigate("/login");
      return null;
    }
  }, [navigate]);

  const fetchSeller = useCallback(
    async (token) => {
      if (!isEdit) return;
      setLoading(true);
      try {
        const response = await axios.get(`${API_ADMIN_URL}/seller/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data) {
          setUsername(response.data.username || "");
          setName(response.data.name || "");
          setEmail(response.data.email || "");
          setPhone(response.data.phone || "");
        }
      } catch (error) {
        console.error("Error fetching seller:", error);
        alert("Failed to fetch seller details.");
      } finally {
        setLoading(false);
      }
    },
    [id, isEdit]
  );

  useEffect(() => {
    const token = validateToken();
    if (token) fetchSeller(token);
  }, [validateToken, fetchSeller]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = validateToken();
      if (!token) return;

      const data = { username, name, email, phone };
      if (password.trim()) {
        data.password = password;
      }

      const headers = { Authorization: `Bearer ${token}` };

      if (isEdit) {
        await axios.put(`${API_ADMIN_URL}/seller/${id}`, data, { headers });
        alert("Seller updated successfully!");
      } else {
        await axios.post(`${API_ADMIN_URL}/seller`, data, { headers });
        alert("Seller added successfully!");
      }

      setPassword("");
      navigate("/seller-list");
    } catch (error) {
      console.error("Error saving seller:", error);
      alert(error.response?.data?.message || "An error occurred while saving the seller.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>{isEdit ? "Edit Seller" : "Add New Seller"}</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Full Name</label>
          <input
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="mb-3">
          <label>Username</label>
          <input
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="mb-3">
          <label>Phone</label>
          <input
            type="text"
            className="form-control"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="mb-3">
          <label>
            {isEdit ? "New Password (Leave blank to keep current password)" : "Password"}
          </label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Processing..." : isEdit ? "Update" : "Add"} Seller
        </button>
      </form>
    </div>
  );
};

export default AddEditSeller;
