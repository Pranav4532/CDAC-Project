import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { API_ADMIN_URL } from "../../api/config";

const AddEditBuyer = () => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const fetchBuyer = useCallback(async () => {
    if (!isEdit) return;
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_ADMIN_URL}/buyer/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data) {
        setUsername(response.data.username || "");
        setName(response.data.name || "");
        setEmail(response.data.email || "");
        setPhone(response.data.phone || "");
      }
    } catch (error) {
      console.error("Error fetching buyer:", error);
      alert("Failed to fetch buyer details.");
    } finally {
      setLoading(false);
    }
  }, [id, isEdit]);

  useEffect(() => {
    fetchBuyer();
  }, [fetchBuyer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Unauthorized! Please log in.");
        navigate("/");
        return;
      }

      const data = { username, name, email, phone };
      if (password.trim()) {
        data.password = password;
      }

      const headers = { Authorization: `Bearer ${token}` };

      if (isEdit) {
        await axios.put(`${API_ADMIN_URL}/buyer/${id}`, data, { headers });
        alert("Buyer updated successfully!");
      } else {
        await axios.post(`${API_ADMIN_URL}/buyer`, data, { headers });
        alert("Buyer added successfully!");
      }

      navigate("/buyer-list");
    } catch (error) {
      console.error("Error saving buyer:", error);
      alert(error.response?.data?.message || "An error occurred while saving the buyer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>{isEdit ? "Edit Buyer" : "Add New Buyer"}</h2>
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
          <label>Password (Leave empty to keep the current password)</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Processing..." : isEdit ? "Update" : "Add"} Buyer
        </button>
      </form>
    </div>
  );
};

export default AddEditBuyer;
