import express from 'express';
import pool from '../config/db.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const [cartItems] = await pool.query(
      'SELECT c.id, b.title, b.author, b.price, c.quantity FROM cart c JOIN books b ON c.book_id = b.id WHERE c.user_id = ?',
      [req.user.id]
    );
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart", error: error.message });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { bookId, quantity } = req.body;
    const [result] = await pool.query(
      'INSERT INTO cart (user_id, book_id, quantity) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)',
      [req.user.id, bookId, quantity]
    );
    res.status(201).json({ message: "Item added to cart successfully", cartItemId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: "Error adding item to cart", error: error.message });
  }
});

export default router;
