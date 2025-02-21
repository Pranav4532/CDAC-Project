import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { API_BASE_URL } from "../../api/config";

const BuyerList = () => {
  const [buyers, setBuyers] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Unauthorized! Please log in.");
      navigate("/");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUser(decoded);
      if (decoded.role === "admin") {
        fetchBuyers(token);
      } else {
        alert("Access Denied! Only admins can view this page.");
        navigate("/");
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      localStorage.removeItem("token");
      navigate("/");
    }
  }, []);

  const fetchBuyers = async (token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/buyers`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Fetched Buyers:", response.data);
      setBuyers(response.data);
    } catch (error) {
      console.error("Error fetching buyers:", error.response ? error.response.data : error.message);
    }
  };

  const deleteBuyer = async (buyerId) => {
    if (!window.confirm("Are you sure you want to delete this buyer?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/admin/delete-buyer/${buyerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBuyers(buyers.filter((buyer) => buyer.id !== buyerId));
    } catch (error) {
      console.error("Error deleting buyer:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Buyer Management</h2>

      {user && (
        <p>
          Logged in as: <strong>{user.username}</strong> ({user.role})
        </p>
      )}

      {buyers.length > 0 ? (
        <table className="table table-bordered">
          <thead className="thead-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {buyers.map((buyer) => (
              <tr key={buyer.id}>
                <td>{buyer.id}</td>
                <td>{buyer.name}</td>
                <td>{buyer.username}</td>
                <td>{buyer.email}</td>
                <td>{buyer.phone}</td>
                <td>
                  <button
                    className="btn btn-warning me-2"
                    onClick={() => navigate(`/edit-buyer/${buyer.id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteBuyer(buyer.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center">
          <p>No buyers found.</p>
        </div>
      )}

      <div className="d-flex justify-content-between mt-3">
        <button className="btn btn-success" onClick={() => navigate("/add-buyer")}>
          Add New Buyer
        </button>
        <button className="btn btn-secondary" onClick={() => navigate("/admin")}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default BuyerList;
