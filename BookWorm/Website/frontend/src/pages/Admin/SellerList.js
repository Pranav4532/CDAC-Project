import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; 
import { API_BASE_URL } from "../../api/config";

const SellerList = () => {
  const [sellers, setSellers] = useState([]);
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
        fetchSellers(token);
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

  const fetchSellers = async (token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/sellers`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Fetched Sellers:", response.data);
      setSellers(response.data); 
    } catch (error) {
      console.error("Error fetching sellers:", error.response ? error.response.data : error.message);
    }
  };

  const deleteSeller = async (sellerId) => {
    if (!window.confirm("Are you sure you want to delete this seller?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/admin/delete-seller/${sellerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSellers(sellers.filter((seller) => seller.id !== sellerId));
    } catch (error) {
      console.error("Error deleting seller:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Seller Management</h2>

      {user && (
        <p>
          Logged in as: <strong>{user.username}</strong> ({user.role})
        </p>
      )}

      {sellers.length > 0 ? (
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
            {sellers.map((seller) => (
              <tr key={seller.id}>
                <td>{seller.id}</td>
                <td>{seller.name}</td>
                <td>{seller.username}</td>
                <td>{seller.email}</td>
                <td>{seller.phone}</td>
                <td>
                  <button
                    className="btn btn-warning me-2"
                    onClick={() => navigate(`/edit-seller/${seller.id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteSeller(seller.id)}
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
          <p>No sellers found.</p>
        </div>
      )}

      <div className="d-flex justify-content-between mt-3">
        <button className="btn btn-success" onClick={() => navigate("/add-seller")}>
          Add New Seller
        </button>
        <button className="btn btn-secondary" onClick={() => navigate("/admin")}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SellerList;
