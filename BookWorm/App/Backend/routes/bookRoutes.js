import express from "express";
import pool from "../config/db.js";
import { authenticateToken, authorize } from "../middleware/authMiddleware.js";
import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Make sure you have an "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [books] = await pool.query("SELECT * FROM books");
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error: error.message });
    
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [book] = await pool.query("SELECT * FROM books WHERE id = ?", [id]);

    if (book.length === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(book[0]);
  } catch (error) {
    res.status(500).json({ message: "Error fetching book", error: error.message });
  }
});


router.get("/seller/books", authenticateToken, authorize(["seller"]), async (req, res) => {
  try {
    const sellerId = req.user.id; 
    const [books] = await pool.query("SELECT * FROM books WHERE seller_id = ?", [sellerId]);
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Error fetching seller's books", error: error.message });
  }
});

router.get("/seller/books/:sellerId", authenticateToken, async (req, res) => {
  try {
    const { sellerId } = req.params;
    const [books] = await pool.query("SELECT * FROM books WHERE seller_id = ?", [sellerId]);

    if (books.length === 0) {
      return res.status(404).json({ message: "No books found for this seller." });
    }

    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Error fetching seller books", error: error.message });
  }
});


router.post("/", authenticateToken, authorize(["seller"]), upload.single("image"), async (req, res) => {
  try {
    const { title, author, price, stock } = req.body;
    const sellerId = req.user.id; 

    const [result] = await pool.query(
      "INSERT INTO books (title, author, price, stock, seller_id) VALUES (?, ?, ?, ?, ?)",
      [title, author, price, stock || 10, sellerId]
    );

    res.status(201).json({ message: "Book added successfully", bookId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: "Error adding book", error: error.message });
  }
});


router.put("/:id", authenticateToken, authorize(["admin", "seller"]), upload.single("image"),async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, price, stock } = req.body;
    const role = req.user.role;
    const sellerId = req.user.id;
    if (role === "seller") {
      const [book] = await pool.query("SELECT seller_id FROM books WHERE id = ?", [id]);
      if (book.length === 0 || book[0].seller_id !== sellerId) {
        return res.status(403).json({ message: "Unauthorized: You can only edit your own books" });
      }
    }

    let query = "UPDATE books SET title = ?, author = ?, price = ?, stock = ? WHERE id = ?";
    let params = [title, author, price, stock, id];
     
    if (req.file) {
      query = "UPDATE books SET title = ?, author = ?, price = ?, stock = ?, image_path = ? WHERE id = ?";
      params = [title, author, price, stock, req.file.filename, id];
    }

    const [result] = await pool.query(query, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json({ message: "Book updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating book", error: error.message });
  }
});


router.delete("/:id", authenticateToken, authorize(["admin", "seller"]), async (req, res) => {
  try {
    const { id } = req.params;
    const role = req.user.role;
    const sellerId = req.user.id;

    if (role === "seller") {
      const [book] = await pool.query("SELECT seller_id FROM books WHERE id = ?", [id]);
      if (book.length === 0 || book[0].seller_id !== sellerId) {
        return res.status(403).json({ message: "Unauthorized: You can only delete your own books" });
      }
    }

    const [result] = await pool.query("DELETE FROM books WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting book", error: error.message });
  }
});

router.get("/books", authenticateToken, authorize(["admin"]), async (req, res) => {
  try {
    const [books] = await pool.query("SELECT * FROM books");
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});

router.get("/:id", authenticateToken, authorize(["admin"]), async (req, res) => {
  try {
    const { id } = req.params;
    const [book] = await pool.query("SELECT * FROM books WHERE id = ?", [id]);

    if (book.length === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(book[0]);
  } catch (error) {
    res.status(500).json({ message: "Error fetching book", error: error.message });
  }
});
router.post("/", authenticateToken, authorize(["admin"]), async (req, res) => {
  try {
    const { title, author, price, stock } = req.body;

    const [result] = await pool.query(
      "INSERT INTO books (title, author, price, stock) VALUES (?, ?, ?, ?)",
      [title, author, price, stock || 10]
    );

    res.status(201).json({ message: "Book added successfully", bookId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: "Error adding book", error: error.message });
  }
});

router.put("/:id", authenticateToken, authorize(["admin"]), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, price, stock } = req.body;

    const [result] = await pool.query(
      "UPDATE books SET title = ?, author = ?, price = ?, stock = ? WHERE id = ?",
      [title, author, price, stock, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json({ message: "Book updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating book", error: error.message });
  }
});

router.delete("/:id", authenticateToken, authorize(["admin"]), async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query("DELETE FROM books WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting book", error: error.message });
  }
});


router.put("/uploads/:id", authenticateToken, authorize(["admin", "seller"]), upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const sellerId = req.user.id;
    const role = req.user.role;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const imagePath = req.file.filename;

    // Check if the book exists and belongs to the seller (for sellers only)
    const [book] = await pool.query("SELECT seller_id FROM books WHERE id = ?", [id]);

    if (!book || book.length === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (role === "seller" && book[0].seller_id !== sellerId) {
      return res.status(403).json({ message: "Unauthorized: You can only update your own books" });
    }

    // Update the image path in the database
    const [result] = await pool.query("UPDATE books SET image_path = ? WHERE id = ?", [imagePath, id]);

    if (result.affectedRows === 0) {
      return res.status(500).json({ message: "Failed to update book image" });
    }

    // Send response with image URL
    res.json({
      message: "Book image updated successfully",
      imagePath: `/uploads/${imagePath}`,
    });

  } catch (error) {
    console.error("Image Upload Error:", error);
    res.status(500).json({ message: "Error updating book image", error: error.message });
  }
});


export default router;
