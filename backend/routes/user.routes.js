const express = require('express');
const { query } = require('../config/database');
const { authenticateToken } = require('./auth.routes');
const { logger } = require('../utils/logger');

const router = express.Router();

// Get all users (admin only)
router.get('/', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const result = await query(
      'SELECT id, name, email, role, status, created_at FROM users ORDER BY created_at DESC'
    );

    res.json({ users: result.rows });
  } catch (error) {
    logger.error('❌ Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get pending clients (admin only)
router.get('/pending', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const result = await query(
      'SELECT id, name, email, role, status, created_at FROM users WHERE status = $1 ORDER BY created_at DESC',
      ['pending']
    );

    res.json({ users: result.rows });
  } catch (error) {
    logger.error('❌ Get pending users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve client (admin only)
router.patch('/:id/approve', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const result = await query(
      'UPDATE users SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, name, email, role, status',
      ['active', req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    logger.info(`✅ User approved: ${result.rows[0].email}`);
    res.json({ message: 'User approved', user: result.rows[0] });
  } catch (error) {
    logger.error('❌ Approve user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reject client (admin only)
router.patch('/:id/reject', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const result = await query(
      'UPDATE users SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, name, email, role, status',
      ['rejected', req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    logger.info(`❌ User rejected: ${result.rows[0].email}`);
    res.json({ message: 'User rejected', user: result.rows[0] });
  } catch (error) {
    logger.error('❌ Reject user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.patch('/:id', authenticateToken, async (req, res) => {
  try {
    const { name, email } = req.body;
    const userId = req.params.id;

    // Only allow users to update their own profile or admin can update any
    if (req.user.userId !== parseInt(userId) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const result = await query(
      'UPDATE users SET name = $1, email = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING id, name, email, role, status',
      [name, email, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    logger.info(`✅ User updated: ${result.rows[0].email}`);
    res.json({ message: 'User updated', user: result.rows[0] });
  } catch (error) {
    logger.error('❌ Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
