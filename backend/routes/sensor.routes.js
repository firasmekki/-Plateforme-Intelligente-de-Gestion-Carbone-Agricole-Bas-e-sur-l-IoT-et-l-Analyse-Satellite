const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken } = require('./auth.routes');
const { writeSensorData, querySensorData, getCarbonSummary } = require('../config/influxdb');
const { logger } = require('../utils/logger');

const router = express.Router();

// Post sensor data
router.post('/data', [
  authenticateToken,
  body('measurement').notEmpty(),
  body('tags').isObject(),
  body('fields').isObject()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { measurement, tags, fields } = req.body;
    
    // Add user context
    tags.user_id = req.user.userId.toString();
    
    await writeSensorData(measurement, tags, fields);
    
    res.json({ message: 'Data recorded successfully' });
  } catch (error) {
    logger.error('❌ Sensor data error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get carbon emissions data
router.get('/carbon/:farmId', authenticateToken, async (req, res) => {
  try {
    const { farmId } = req.params;
    const { period = '30d' } = req.query;
    
    const data = await querySensorData('carbon_emissions', farmId, `-${period}`);
    const summary = await getCarbonSummary(farmId, period);
    
    res.json({
      data,
      summary
    });
  } catch (error) {
    logger.error('❌ Carbon data error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get water consumption data
router.get('/water/:farmId', authenticateToken, async (req, res) => {
  try {
    const { farmId } = req.params;
    const { period = '7d' } = req.query;
    
    const data = await querySensorData('water_consumption', farmId, `-${period}`);
    
    res.json({ data });
  } catch (error) {
    logger.error('❌ Water data error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get energy consumption data
router.get('/energy/:farmId', authenticateToken, async (req, res) => {
  try {
    const { farmId } = req.params;
    const { period = '7d' } = req.query;
    
    const data = await querySensorData('energy_consumption', farmId, `-${period}`);
    
    res.json({ data });
  } catch (error) {
    logger.error('❌ Energy data error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all metrics summary
router.get('/summary/:farmId', authenticateToken, async (req, res) => {
  try {
    const { farmId } = req.params;
    
    const carbon = await getCarbonSummary(farmId, '30d');
    const water = await querySensorData('water_consumption', farmId, '-24h');
    const energy = await querySensorData('energy_consumption', farmId, '-24h');
    
    // Calculate totals
    const waterTotal = water.reduce((sum, item) => sum + item.value, 0);
    const energyTotal = energy.reduce((sum, item) => sum + item.value, 0);
    
    res.json({
      carbon: carbon.total,
      water: waterTotal,
      energy: energyTotal,
      period: '24h'
    });
  } catch (error) {
    logger.error('❌ Summary error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// MQTT webhook endpoint for IoT devices
router.post('/mqtt', async (req, res) => {
  try {
    const { topic, payload } = req.body;
    
    // Parse MQTT topic (format: agrocarbon/{farm_id}/{sensor_type})
    const parts = topic.split('/');
    if (parts.length < 3) {
      return res.status(400).json({ message: 'Invalid topic format' });
    }
    
    const farmId = parts[1];
    const sensorType = parts[2];
    
    // Parse payload
    const data = JSON.parse(payload);
    
    const tags = {
      farm_id: farmId,
      sensor_type: sensorType,
      device_id: data.device_id || 'unknown'
    };
    
    const fields = {
      value: data.value,
      ...data.metadata
    };
    
    await writeSensorData(sensorType, tags, fields);
    
    logger.info(`📡 MQTT data received: ${topic}`);
    res.json({ message: 'MQTT data processed' });
  } catch (error) {
    logger.error('❌ MQTT processing error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
