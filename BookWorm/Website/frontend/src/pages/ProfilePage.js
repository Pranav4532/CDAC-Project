import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/AdminNavbar";
import "bootstrap/dist/css/bootstrap.min.css";
import { API_USER_URL } from "../api/config";
import { jwtDecode } from "jwt-decode";

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
  });
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      alert("You need to login first.");
      navigate("/");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const userId = decoded.id;

      axios
        .get(`${API_USER_URL}/profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUser(response.data);
          setUpdatedUser({
            name: response.data.name,
            username: response.data.username,
            email: response.data.email,
            phone: response.data.phone,
          });
        })
        .catch((error) => {
          console.error("Error fetching user profile:", error);
        });
    } catch (error) {
      console.error("Invalid token:", error);
      alert("Invalid session, please log in again.");
      navigate("/");
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    const payload = { ...updatedUser };
    if (!payload.password?.trim()) {
      delete payload.password;
    }

    axios
      .put(`${API_USER_URL}/profile/update`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        alert("Profile updated successfully!");
        setUser(response.data.user);
        setEditMode(false);
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        alert("Profile update failed. Please try again.");
      });
  };

  if (!user) {
    return (
      <div className="container text-center mt-5">
        <h3>Loading Profile...</h3>
        <p>If this takes too long, try refreshing.</p>
      </div>
    );
  }

  return (
    <div>
      <Navbar user={user} />
      <div className="container mt-4">
        <h2 className="text-center">Profile</h2>
        <div className="card p-4">
          {Object.keys(updatedUser).map((key) => (
            <div className="mb-3" key={key}>
              <label className="form-label">{key.charAt(0).toUpperCase() + key.slice(1)}</label>
              <input
                type={key === "password" ? "password" : "text"}
                name={key}
                className="form-control"
                value={updatedUser[key] || ""}
                onChange={handleChange}
                disabled={!editMode && key !== "password"}
                placeholder={key === "password" ? "Enter new password" : ""}
              />
            </div>
          ))}

          <div className="d-flex gap-2">
            {editMode ? (
              <>
                <button className="btn btn-success" onClick={handleUpdate}>
                  Save Changes
                </button>
                <button className="btn btn-secondary" onClick={() => setEditMode(false)}>
                  Cancel
                </button>
              </>
            ) : (
              <button className="btn btn-primary" onClick={() => setEditMode(true)}>
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
