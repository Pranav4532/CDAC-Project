import express from 'express';
import pool from '../config/db.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authenticateToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [cartItems] = await connection.query(
      'SELECT book_id, quantity FROM cart WHERE user_id = ?',
      [req.user.id]
    );

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let totalAmount = 0;
    for (const item of cartItems) {
      const [bookPrice] = await connection.query(
        'SELECT price FROM books WHERE id = ?',
        [item.book_id]
      );
      totalAmount += bookPrice[0].price * item.quantity;
    }

    const [orderResult] = await connection.query(
      'INSERT INTO orders (user_id, total_amount) VALUES (?, ?)',
      [req.user.id, totalAmount]
    );
    const orderId = orderResult.insertId;

    for (const item of cartItems) {
      const [bookPrice] = await connection.query(
        'SELECT price FROM books WHERE id = ?',
        [item.book_id]
      );
      await connection.query(
        'INSERT INTO order_items (order_id, book_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.book_id, item.quantity, bookPrice[0].price]
      );
    }

    await connection.query('DELETE FROM cart WHERE user_id = ?', [req.user.id]);

    await connection.commit();
    res.status(201).json({ message: "Order placed successfully", orderId });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: "Error placing order", error: error.message });
  } finally {
    connection.release();
  }
});

router.get('/', authenticateToken, async (req, res) => {
  try {
    const [orders] = await pool.query('SELECT * FROM orders WHERE user_id = ?', [req.user.id]);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error: error.message });
  }
});

router.get('/:orderId', authenticateToken, async (req, res) => {
  try {
    const [orderItems] = await pool.query(
      'SELECT oi.*, b.title, b.author FROM order_items oi JOIN books b ON oi.book_id = b.id WHERE oi.order_id = ?',
      [req.params.orderId]
    );
    res.json(orderItems);
  } catch (error) {
    res.status(500).json({ message: "Error fetching order details", error: error.message });
  }
});

export default router;
