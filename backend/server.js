const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const sensorRoutes = require('./routes/sensor.routes');
const reportRoutes = require('./routes/report.routes');
const parcelleRoutes = require('./routes/parcelle.routes');
// const satelliteRoutes = require('./routes/satellite-simple.routes'); // Disabled - using Mock Data
const { errorHandler } = require('./middleware/error.middleware');
const { logger } = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 3001;

// CORS middleware personnalisé (avant tout)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Répondre immédiatement aux requêtes OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Sécurité
app.use(helmet());

// Rate limiting (désactivé pour développement)
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 1000 // limit each IP to 1000 requests per windowMs
// });
// app.use('/api/', limiter);

// Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/sensors', sensorRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/parcelles', parcelleRoutes);
// app.use('/api/satellite', satelliteRoutes); // Disabled - using Mock Data

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Error handling
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
