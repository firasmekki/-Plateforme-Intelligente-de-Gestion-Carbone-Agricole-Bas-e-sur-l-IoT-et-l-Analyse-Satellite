const express = require('express');
const router = express.Router();
const axios = require('axios');
// Simple logger fallback
const logger = {
  info: (...args) => console.log('[INFO]', ...args),
  error: (...args) => console.error('[ERROR]', ...args)
};

const INSTANCE_ID = process.env.SENTINEL_HUB_INSTANCE_ID;
const CLIENT_ID = process.env.SENTINEL_HUB_CLIENT_ID;
const CLIENT_SECRET = process.env.SENTINEL_HUB_CLIENT_SECRET;

// Cache token
let cachedToken = null;
let tokenExpiry = 0;

async function getAccessToken() {
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }
  try {
    const response = await axios.post('https://services.sentinel-hub.com/oauth/token', 
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    cachedToken = response.data.access_token;
    tokenExpiry = Date.now() + (response.data.expires_in - 60) * 1000;
    return cachedToken;
  } catch (error) {
    throw new Error('Failed to authenticate with Sentinel Hub');
  }
}

// NDVI endpoint
router.post('/ndvi', async (req, res) => {
  try {
    const { coordinates, startDate, endDate } = req.body;
    
    console.log(`NDVI request - CLIENT_ID present: ${!!CLIENT_ID}`);

    // Check credentials
    if (!CLIENT_ID || CLIENT_ID === 'your_client_id_here') {
      console.log('Using mock data - no valid CLIENT_ID');
      return res.json(generateMockNDVI(coordinates));
    }

    const token = await getAccessToken();
    
    // Format coordinates
    const coords = coordinates.map(c => [c[1], c[0]]);
    coords.push(coords[0]);

    // Request NDVI from Sentinel Hub
    const statsRequest = {
      input: {
        bounds: {
          geometry: {
            type: "Polygon",
            coordinates: [coords]
          }
        },
        data: [{
          type: "sentinel-2-l2a",
          dataFilter: {
            timeRange: {
              from: startDate || new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
              to: endDate || new Date().toISOString()
            },
            maxCloudCoverage: 100
          }
        }]
      },
      aggregation: {
        timeRange: {
          from: startDate || new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
          to: endDate || new Date().toISOString()
        },
        aggregationInterval: { of: "P30D" },
        evalscript: `//VERSION=3\nfunction setup(){return{input:["B04","B08","dataMask"],output:[{id:"ndvi",bands:1,sampleType:"FLOAT32"},{id:"dataMask",bands:1}]}}\nfunction evaluatePixel(s){if(s.dataMask===0)return{ndvi:[-1],dataMask:[0]};let ndvi=(s.B08-s.B04)/(s.B08+s.B04);return{ndvi:[ndvi],dataMask:[s.dataMask]}}`,
        resampling: "BILINEAR"
      }
    };

    const statsResponse = await axios.post('https://services.sentinel-hub.com/api/v1/statistics', statsRequest, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    // Format response
    const ndviData = [];
    if (statsResponse.data && statsResponse.data.data) {
      for (const interval of statsResponse.data.data) {
        if (interval.outputs && interval.outputs.ndvi) {
          const stats = interval.outputs.ndvi.bands?.[0]?.stats;
          if (stats && stats.mean !== undefined) {
            ndviData.push({
              date: interval.interval.from.split('T')[0],
              ndvi: parseFloat(stats.mean.toFixed(3)),
              min: parseFloat(stats.min.toFixed(3)),
              max: parseFloat(stats.max.toFixed(3)),
              health: stats.mean >= 0.75 ? 'excellent' : stats.mean >= 0.6 ? 'good' : stats.mean >= 0.4 ? 'moderate' : 'poor'
            });
          }
        }
      }
    }

    console.log(`✅ NDVI: ${ndviData.length} points from Sentinel Hub`);
    console.log('API Response structure:', JSON.stringify(statsResponse.data, null, 2).substring(0, 500));
    res.json({
      source: 'sentinel-hub',
      coordinates,
      ndviData,
      currentNDVI: ndviData.length > 0 ? ndviData[ndviData.length - 1].ndvi : null
    });

  } catch (error) {
    console.error('NDVI error:', error.message);
    res.json(generateMockNDVI(req.body.coordinates));
  }
});

// Mock generator
function generateMockNDVI(coordinates) {
  const data = [];
  for (let i = 0; i < 6; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    const ndvi = 0.5 + Math.random() * 0.3;
    data.push({
      date: date.toISOString().split('T')[0],
      ndvi: parseFloat(ndvi.toFixed(3)),
      min: parseFloat((ndvi - 0.05).toFixed(3)),
      max: parseFloat((ndvi + 0.05).toFixed(3)),
      health: ndvi >= 0.6 ? 'good' : 'moderate'
    });
  }
  return {
    source: 'mock',
    coordinates,
    ndviData: data,
    currentNDVI: data[data.length - 1].ndvi
  };
}

module.exports = router;
