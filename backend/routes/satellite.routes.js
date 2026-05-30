const express = require('express');
const router = express.Router();
const axios = require('axios');
const logger = require('../utils/logger');

const INSTANCE_ID = process.env.SENTINEL_HUB_INSTANCE_ID;
const CLIENT_ID = process.env.SENTINEL_HUB_CLIENT_ID;
const CLIENT_SECRET = process.env.SENTINEL_HUB_CLIENT_SECRET;

let cachedToken = null;
let tokenExpiry = 0;

async function getAccessToken() {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;
  const response = await axios.post('https://services.sentinel-hub.com/oauth/token',
    new URLSearchParams({ grant_type: 'client_credentials', client_id: CLIENT_ID, client_secret: CLIENT_SECRET }),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );
  cachedToken = response.data.access_token;
  tokenExpiry = Date.now() + (response.data.expires_in - 60) * 1000;
  return cachedToken;
}

router.post('/ndvi', async (req, res) => {
  try {
    const { coordinates, startDate, endDate } = req.body;
    logger.info(`NDVI request - CLIENT_ID present: ${!!CLIENT_ID}`);

    if (!CLIENT_ID || CLIENT_ID === 'your_client_id_here') {
      logger.info('Using mock data');
      return res.json(generateMockNDVI(coordinates));
    }

    const token = await getAccessToken();
    const coords = coordinates.map(c => [c[1], c[0]]);
    coords.push(coords[0]);

    const statsRequest = {
      input: {
        bounds: { geometry: { type: "Polygon", coordinates: [coords] } },
        data: [{
          type: "sentinel-2-l2a",
          dataFilter: {
            timeRange: {
              from: startDate || new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
              to: endDate || new Date().toISOString()
            },
            maxCloudCoverage: 20
          }
        }]
      },
      aggregation: {
        timeRange: {
          from: startDate || new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
          to: endDate || new Date().toISOString()
        },
        aggregationInterval: { of: "P30D" },
        evalscript: `//VERSION=3\nfunction setup(){return{input:["B04","B08","dataMask"],output:[{id:"ndvi",bands:1,sampleType:"FLOAT32"},{id:"dataMask",bands:1}]}}\nfunction evaluatePixel(s){if(s.dataMask===0)return{ndvi:[-1],dataMask:[0]};let n=(s.B08-s.B04)/(s.B08+s.B04);return{ndvi:[n],dataMask:[s.dataMask]}}`,
        resampling: "BILINEAR"
      }
    };

    const statsResponse = await axios.post('https://services.sentinel-hub.com/api/v1/statistics', statsRequest, {
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
    });

    const ndviData = [];
    if (statsResponse.data?.data) {
      for (const interval of statsResponse.data.data) {
        const stats = interval.outputs?.ndvi?.bands?.[0]?.stats;
        if (stats?.mean !== undefined) {
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

    logger.info(`✅ NDVI: ${ndviData.length} points from Sentinel Hub`);
    res.json({ source: 'sentinel-hub', coordinates, ndviData, currentNDVI: ndviData[ndviData.length - 1]?.ndvi || null });

  } catch (error) {
    logger.error('NDVI error:', error.message);
    res.json(generateMockNDVI(req.body.coordinates));
  }
});

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
  return { source: 'mock', coordinates, ndviData: data, currentNDVI: data[data.length - 1].ndvi };
}

module.exports = router;
const router = express.Router();
const axios = require('axios');
const logger = require('../utils/logger');

const INSTANCE_ID = process.env.SENTINEL_HUB_INSTANCE_ID;
const CLIENT_ID = process.env.SENTINEL_HUB_CLIENT_ID;
const CLIENT_SECRET = process.env.SENTINEL_HUB_CLIENT_SECRET;

// Cache token
let cachedToken = null;
let tokenExpiry = 0;

// Get Sentinel Hub Access Token
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
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }
    );

    cachedToken = response.data.access_token;
    tokenExpiry = Date.now() + (response.data.expires_in - 60) * 1000; // Refresh 60s before expiry
    
    logger.info('✅ Sentinel Hub token obtained');
    return cachedToken;
  } catch (error) {
    logger.error('❌ Failed to get Sentinel Hub token:', error.response?.data || error.message);
    throw new Error('Failed to authenticate with Sentinel Hub');
  }
}

// Get NDVI data for a polygon
router.post('/ndvi', async (req, res) => {
  try {
    logger.info(`🔧 Sentinel Hub Config - CLIENT_ID present: ${!!CLIENT_ID}`);
    const { coordinates, startDate, endDate } = req.body;

    if (!coordinates || coordinates.length < 3) {
      return res.status(400).json({ message: 'Valid polygon coordinates required (min 3 points)' });
    }

    // If no Sentinel Hub credentials, return mock data
    if (!CLIENT_ID || CLIENT_ID === 'your_client_id_here') {
      logger.info(`📊 Using mock NDVI data - CLIENT_ID check: ${!CLIENT_ID ? 'MISSING' : (CLIENT_ID === 'your_client_id_here' ? 'DEFAULT_VALUE' : 'OK')}`);
      return res.json(generateMockNDVI(coordinates, startDate, endDate));
    }

    const token = await getAccessToken();

    // Format coordinates for Sentinel Hub
    const coords = coordinates.map(c => [c[1], c[0]]); // [lng, lat] format
    coords.push(coords[0]); // Close the polygon

    // Build Sentinel Hub Process API request
    const evalscript = `
      //VERSION=3
      function setup() {
        return {
          input: ["B04", "B08", "dataMask"],
          output: { bands: 1, sampleType: "FLOAT32" }
        };
      }
      function evaluatePixel(samples) {
        if (samples.dataMask === 0) return [-1];
        let ndvi = (samples.B08 - samples.B04) / (samples.B08 + samples.B04);
        return [ndvi];
      }
    `;

    const requestBody = {
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
              from: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
              to: endDate || new Date().toISOString()
            },
            maxCloudCoverage: 20
          }
        }]
      },
      output: {
        width: 512,
        height: 512,
        responses: [{
          identifier: "default",
          format: { type: "image/tiff" }
        }]
      },
      evalscript: evalscript
    };

    // Get NDVI statistics
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
              from: startDate || new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
              to: endDate || new Date().toISOString()
            },
            maxCloudCoverage: 20
          }
        }]
      },
      aggregation: {
        timeRange: {
          from: startDate || new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
          to: endDate || new Date().toISOString()
        },
        aggregationInterval: { of: "P10D" },
        evalscript: `
          //VERSION=3
          function setup() {
            return {
              input: ["B04", "B08", "dataMask"],
              output: [
                { id: "ndvi", bands: 1, sampleType: "FLOAT32" },
                { id: "dataMask", bands: 1 }
              ]
            };
          }
          function evaluatePixel(samples) {
            if (samples.dataMask === 0) return { ndvi: [-1], dataMask: [0] };
            let ndvi = (samples.B08 - samples.B04) / (samples.B08 + samples.B04);
            return { ndvi: [ndvi], dataMask: [samples.dataMask] };
          }
        `,
        resampling: "BILINEAR"
      }
    };

    // Get historical NDVI time series
    const processUrl = `https://services.sentinel-hub.com/api/v1/statistics`;
    const statsResponse = await axios.post(processUrl, statsRequest, {
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
          if (stats) {
            ndviData.push({
              date: interval.interval.from.split('T')[0],
              ndvi: parseFloat(stats.mean.toFixed(3)),
              min: parseFloat(stats.min.toFixed(3)),
              max: parseFloat(stats.max.toFixed(3)),
              health: stats.mean >= 0.75 ? 'excellent' : 
                     stats.mean >= 0.6 ? 'good' : 
                     stats.mean >= 0.4 ? 'moderate' : 'poor'
            });
          }
        }
      }
    }

    logger.info(`✅ NDVI data retrieved: ${ndviData.length} intervals`);
    res.json({
      source: 'sentinel-hub',
      coordinates,
      ndviData,
      currentNDVI: ndviData.length > 0 ? ndviData[ndviData.length - 1].ndvi : null
    });

  } catch (error) {
    logger.error('❌ NDVI analysis error:', error.response?.data || error.message);
    
    // Fallback to mock data
    logger.info('📊 Falling back to mock NDVI data');
    res.json(generateMockNDVI(req.body.coordinates, req.body.startDate, req.body.endDate));
  }
});

// Get satellite image for a polygon
router.post('/imagery', async (req, res) => {
  try {
    const { coordinates, date } = req.body;

    if (!CLIENT_ID || CLIENT_ID === 'your_client_id_here') {
      return res.json({ 
        source: 'mock',
        imageUrl: `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}`,
        message: 'Using Esri imagery (no Sentinel Hub credentials)'
      });
    }

    const token = await getAccessToken();
    const coords = coordinates.map(c => [c[1], c[0]]);
    coords.push(coords[0]);

    const evalscript = `
      //VERSION=3
      function setup() {
        return {
          input: ["B04", "B03", "B02", "dataMask"],
          output: { bands: 4 }
        };
      }
      function evaluatePixel(samples) {
        return [samples.B04, samples.B03, samples.B02, samples.dataMask];
      }
    `;

    const requestBody = {
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
              from: date || new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
              to: date || new Date().toISOString()
            },
            maxCloudCoverage: 20
          }
        }]
      },
      output: {
        width: 512,
        height: 512,
        responses: [{
          identifier: "default",
          format: { type: "image/png" }
        }]
      },
      evalscript: evalscript
    };

    const processUrl = `https://services.sentinel-hub.com/api/v1/process`;
    const imageResponse = await axios.post(processUrl, requestBody, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      responseType: 'arraybuffer'
    });

    // Convert to base64
    const base64Image = Buffer.from(imageResponse.data, 'binary').toString('base64');
    
    res.json({
      source: 'sentinel-hub',
      image: `data:image/png;base64,${base64Image}`,
      date: date || new Date().toISOString().split('T')[0]
    });

  } catch (error) {
    logger.error('❌ Imagery error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to get satellite imagery' });
  }
});

// Mock NDVI generator (fallback)
function generateMockNDVI(coordinates, startDate, endDate) {
  const data = [];
  const months = 6;
  const start = new Date();
  start.setMonth(start.getMonth() - months);

  let baseNDVI = 0.55 + Math.random() * 0.2;

  for (let i = 0; i < months * 3; i++) {
    const date = new Date(start);
    date.setDate(date.getDate() + i * 10);

    const seasonal = Math.sin((i / (months * 3)) * Math.PI * 2) * 0.1;
    const random = (Math.random() - 0.5) * 0.05;
    const ndvi = Math.max(0, Math.min(1, baseNDVI + seasonal + random));

    data.push({
      date: date.toISOString().split('T')[0],
      ndvi: parseFloat(ndvi.toFixed(3)),
      min: parseFloat((ndvi - 0.05).toFixed(3)),
      max: parseFloat((ndvi + 0.05).toFixed(3)),
      health: ndvi >= 0.75 ? 'excellent' : ndvi >= 0.6 ? 'good' : ndvi >= 0.4 ? 'moderate' : 'poor'
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
