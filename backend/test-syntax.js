try {
  const satellite = require('./routes/satellite.routes');
  console.log('✅ Satellite routes loaded successfully');
} catch (e) {
  console.error('❌ Error loading satellite routes:', e.message);
  console.error(e.stack);
}
