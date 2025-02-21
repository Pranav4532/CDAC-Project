import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { API_BOOK_URL } from "../../api/config";

const AddEditBook = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [bookData, setBookData] = useState({
    title: "",
    author: "",
    price: "",
    stock: "",
    imageUrl: "",
    userId: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [userId, setUserId] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.id);
      } catch (error) {
        console.error("Invalid token:", error);
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    if (bookId) {
      const fetchBook = async () => {
        try {
          const response = await axios.get(`${API_BOOK_URL}/${bookId}`);
          setBookData(response.data);
          setIsEditMode(true);
        } catch (error) {
          console.error("Error fetching book details:", error);
        }
      };
      fetchBook();
    }
  }, [bookId]);

  const handleChange = (e) => {
    setBookData({ ...bookData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBookData({ ...bookData, imageUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return null;

    const formData = new FormData();
    formData.append("file", imageFile);

    try {
      const response = await axios.post(`${API_BOOK_URL}/upload-image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.imageUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Image upload failed.");
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("User is not authenticated. Please log in.");
      navigate("/");
      return;
    }

    let uploadedImageUrl = bookData.imageUrl;
    if (imageFile) {
      uploadedImageUrl = await uploadImage();
      if (!uploadedImageUrl) return;
    }

    try {
      const bookPayload = { ...bookData, imageUrl: uploadedImageUrl, userId };

      if (isEditMode) {
        await axios.put(`${API_BOOK_URL}/${bookId}`, bookPayload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Book updated successfully!");
      } else {
        await axios.post(`${API_BOOK_URL}`, bookPayload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Book added successfully!");
      }
      navigate("/sellerbook");
    } catch (error) {
      console.error("Error saving book:", error);
      alert("Failed to save book. Please try again.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>{isEditMode ? "Edit Book" : "Add Book"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input type="text" className="form-control" name="title" value={bookData.title} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Author</label>
          <input type="text" className="form-control" name="author" value={bookData.author} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Price</label>
          <input type="number" className="form-control" name="price" value={bookData.price} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Stock</label>
          <input type="number" className="form-control" name="stock" value={bookData.stock} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Book Image</label>
          <input type="file" className="form-control" accept="image/*" onChange={handleImageChange} />
        </div>
        {bookData.imageUrl && (
          <div className="mb-3">
            <img src={bookData.imageUrl} alt="Book Preview" style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "5px" }} />
          </div>
        )}
        <button type="submit" className="btn btn-primary">{isEditMode ? "Update Book" : "Add Book"}</button>
        <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate("/sellerbook")}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AddEditBook;
