import express from 'express';
import bcrypt from 'bcrypt';
import pool from '../config/db.js';
import { generateToken } from '../config/auth.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, username, email, phone, password, role } = req.body;

    if (!name || !username || !email || !phone || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      'INSERT INTO users (name, username, email, phone, password, role) VALUES (?, ?, ?, ?, ?, ?)',
      [name, username, email, phone, hashedPassword, role]
    );

    res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const [users] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

    if (users.length === 0) return res.status(400).json({ message: 'User not found' });

    const user = users[0];
    if (await bcrypt.compare(password, user.password)) {
      const token = generateToken(user);
      res.json({ message: 'Login successful', token });
    } else {
      res.status(400).json({ message: 'Invalid password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

router.put('/profile/update', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, username, email, phone, password } = req.body;

    if (!name && !username && !email && !phone && !password) {
      return res.status(400).json({ message: 'Please provide at least one field to update.' });
    }

    let updateFields = [];
    let values = [];

    if (name) {
      updateFields.push('name = ?');
      values.push(name);
    }
    if (username) {
      updateFields.push('username = ?');
      values.push(username);
    }
    if (email) {
      updateFields.push('email = ?');
      values.push(email);
    }
    if (phone) {
      updateFields.push('phone = ?');
      values.push(phone);
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.push('password = ?');
      values.push(hashedPassword);
    }

    values.push(userId);

    const query = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
    await pool.query(query, values);

    const [updatedUser] = await pool.query(
      'SELECT id, name, username, email, phone, role FROM users WHERE id = ?',
      [userId]
    );

    res.json({ message: 'Profile updated successfully', user: updatedUser[0] });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/profile/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.id;
    const [rows] = await pool.query(
      'SELECT id, name, username, email, phone, role FROM users WHERE id = ?',
      [userId]
    );

    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
