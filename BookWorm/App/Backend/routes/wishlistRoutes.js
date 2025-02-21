import express from 'express';
import pool from '../config/db.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const [wishlistItems] = await pool.query(
      'SELECT w.id, b.title, b.author, b.price FROM wishlist w JOIN books b ON w.book_id = b.id WHERE w.user_id = ?',
      [req.user.id]
    );
    res.json(wishlistItems);
  } catch (error) {
    res.status(500).json({ message: "Error fetching wishlist", error: error.message });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { bookId } = req.body;
    const [result] = await pool.query(
      'INSERT INTO wishlist (user_id, book_id) VALUES (?, ?)',
      [req.user.id, bookId]
    );
    res.status(201).json({ message: "Item added to wishlist successfully", wishlistItemId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: "Error adding item to wishlist", error: error.message });
  }
});

export default router;
