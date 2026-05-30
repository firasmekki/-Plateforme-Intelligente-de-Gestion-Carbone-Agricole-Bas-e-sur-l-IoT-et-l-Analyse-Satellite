const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticateToken } = require('./auth.routes');
const { query } = require('../config/database');
const { getCarbonSummary, querySensorData } = require('../config/influxdb');
const { logger } = require('../utils/logger');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'report-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|xlsx|csv/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
      return cb(null, true);
    }
    cb(new Error('Only PDF, XLSX, and CSV files are allowed'));
  }
});

// Get all reports for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await query(
      'SELECT id, title, type, file_path, created_at FROM reports WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.userId]
    );
    
    res.json({ reports: result.rows });
  } catch (error) {
    logger.error('❌ Get reports error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate carbon report
router.post('/generate/carbon', authenticateToken, async (req, res) => {
  try {
    const { farmId, period = '30d', title } = req.body;
    
    // Get data from InfluxDB
    const carbon = await getCarbonSummary(farmId, period);
    const emissions = await querySensorData('carbon_emissions', farmId, `-${period}`);
    
    // Create report data
    const reportData = {
      title: title || `Rapport Carbone - ${period}`,
      generatedAt: new Date().toISOString(),
      period,
      summary: carbon,
      emissions,
      userId: req.user.userId
    };
    
    // Save report metadata to database
    const result = await query(
      'INSERT INTO reports (user_id, title, type) VALUES ($1, $2, $3) RETURNING *',
      [req.user.userId, reportData.title, 'carbon']
    );
    
    res.json({
      message: 'Report generated',
      report: result.rows[0],
      data: reportData
    });
  } catch (error) {
    logger.error('❌ Generate carbon report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate water report
router.post('/generate/water', authenticateToken, async (req, res) => {
  try {
    const { farmId, period = '30d', title } = req.body;
    
    const water = await querySensorData('water_consumption', farmId, `-${period}`);
    
    const reportData = {
      title: title || `Rapport Eau - ${period}`,
      generatedAt: new Date().toISOString(),
      period,
      water,
      userId: req.user.userId
    };
    
    const result = await query(
      'INSERT INTO reports (user_id, title, type) VALUES ($1, $2, $3) RETURNING *',
      [req.user.userId, reportData.title, 'water']
    );
    
    res.json({
      message: 'Report generated',
      report: result.rows[0],
      data: reportData
    });
  } catch (error) {
    logger.error('❌ Generate water report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload report file
router.post('/upload', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const { title, type } = req.body;
    
    const result = await query(
      'INSERT INTO reports (user_id, title, type, file_path) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.userId, title, type, req.file.path]
    );
    
    logger.info(`✅ Report uploaded: ${title}`);
    res.json({ message: 'File uploaded', report: result.rows[0] });
  } catch (error) {
    logger.error('❌ Upload error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Download report
router.get('/download/:id', authenticateToken, async (req, res) => {
  try {
    const result = await query(
      'SELECT file_path, title FROM reports WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    const filePath = result.rows[0].file_path;
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }
    
    res.download(filePath, `${result.rows[0].title}${path.extname(filePath)}`);
  } catch (error) {
    logger.error('❌ Download error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete report
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    // Get file path first
    const reportResult = await query(
      'SELECT file_path FROM reports WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.userId]
    );
    
    if (reportResult.rows.length === 0) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    const filePath = reportResult.rows[0].file_path;
    
    // Delete from database
    await query('DELETE FROM reports WHERE id = $1', [req.params.id]);
    
    // Delete file if exists
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    res.json({ message: 'Report deleted' });
  } catch (error) {
    logger.error('❌ Delete report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
