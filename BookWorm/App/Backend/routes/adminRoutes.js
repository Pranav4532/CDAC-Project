import express from 'express';
import bcrypt from 'bcrypt';
import pool from '../config/db.js';
import { authenticateToken, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/seller', authenticateToken, authorize(['admin']), async (req, res) => {
  try {
    const { name, username, email, phone, password } = req.body;

    if (!name || !username || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      'INSERT INTO users (name, username, email, phone, password, role) VALUES (?, ?, ?, ?, ?, ?)',
      [name, username, email, phone, hashedPassword, 'seller']
    );

    res.status(201).json({ message: 'Seller added successfully', sellerId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Error adding seller', error: error.message });
  }
});

router.put('/seller/:id', authenticateToken, authorize(['admin']), async (req, res) => {
  try {
    const { name, username, email, phone, password } = req.body;
    const { id } = req.params;

    let query = "UPDATE users SET name = ?, username = ?, email = ?, phone = ? ";
    let params = [name, username, email, phone];

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query += ", password = ?";
      params.push(hashedPassword);
    }

    query += " WHERE id = ? AND role = 'seller'";
    params.push(id);

    const [result] = await pool.query(query, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Seller not found or no changes made." });
    }

    res.json({ message: "Seller updated successfully" });
  } catch (error) {
    res.status(500).json({ message: 'Error updating seller', error: error.message });
  }
});

router.delete('/seller/:id', authenticateToken, authorize(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM users WHERE id = ? AND role = ?', [id, 'seller']);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Seller not found." });
    }

    res.json({ message: 'Seller deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting seller', error: error.message });
  }
});

router.get('/sellers', authenticateToken, authorize(['admin']), async (req, res) => {
  try {
    const [sellers] = await pool.query("SELECT id, name, username, email, phone FROM users WHERE role = 'seller'");
    res.json(sellers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sellers", error: error.message });
  }
});

router.get('/seller/:id', authenticateToken, authorize(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT id, name, username, email, phone FROM users WHERE id = ? AND role = ?', [id, 'seller']);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching seller', error: error.message });
  }
});

router.post('/buyer', authenticateToken, authorize(['admin']), async (req, res) => {
  try {
    const { name, username, email, phone, password } = req.body;

    if (!name || !username || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      'INSERT INTO users (name, username, email, phone, password, role) VALUES (?, ?, ?, ?, ?, ?)',
      [name, username, email, phone, hashedPassword, 'buyer']
    );

    res.status(201).json({ message: "Buyer added successfully", buyerId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: "Error adding buyer", error: error.message });
  }
});

router.put('/buyer/:id', authenticateToken, authorize(['admin']), async (req, res) => {
  try {
    const { name, username, email, phone, password } = req.body;
    const { id } = req.params;

    let query = "UPDATE users SET name = ?, username = ?, email = ?, phone = ? ";
    let params = [name, username, email, phone];

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query += ", password = ?";
      params.push(hashedPassword);
    }

    query += " WHERE id = ? AND role = 'buyer'";
    params.push(id);

    const [result] = await pool.query(query, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Buyer not found or no changes made." });
    }

    res.json({ message: "Buyer updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating buyer", error: error.message });
  }
});

router.delete('/buyer/:id', authenticateToken, authorize(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM users WHERE id = ? AND role = ?', [id, 'buyer']);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Buyer not found." });
    }

    res.json({ message: 'Buyer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: "Error deleting buyer", error: error.message });
  }
});

router.get('/buyers', authenticateToken, authorize(['admin']), async (req, res) => {
  try {
    const [buyers] = await pool.query("SELECT id, name, username, email, phone FROM users WHERE role = 'buyer'");
    res.json(buyers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching buyers", error: error.message });
  }
});

router.get('/buyer/:id', authenticateToken, authorize(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT id, name, username, email, phone FROM users WHERE id = ? AND role = ?', [id, 'buyer']);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Buyer not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching buyer', error: error.message });
  }
});

export default router;