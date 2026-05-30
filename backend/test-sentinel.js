require('dotenv').config();
const axios = require('axios');

async function testSentinelHub() {
  try {
    // Step 1: Get token
    const tokenRes = await axios.post('https://services.sentinel-hub.com/oauth/token',
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.SENTINEL_HUB_CLIENT_ID,
        client_secret: process.env.SENTINEL_HUB_CLIENT_SECRET
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    const token = tokenRes.data.access_token;
    console.log('✅ Token obtained');

    // Step 2: Get NDVI statistics for Tunisia test area
    const statsRes = await axios.post('https://services.sentinel-hub.com/api/v1/statistics', {
      input: {
        bounds: {
          geometry: {
            type: 'Polygon',
            coordinates: [[[9.5, 33.8], [9.6, 33.8], [9.6, 33.9], [9.5, 33.9], [9.5, 33.8]]]
          }
        },
        data: [{
          type: 'sentinel-2-l2a',
          dataFilter: {
            timeRange: {
              from: '2025-01-01T00:00:00Z',
              to: '2025-04-28T00:00:00Z'
            },
            maxCloudCoverage: 20
          }
        }]
      },
      aggregation: {
        timeRange: {
          from: '2025-01-01T00:00:00Z',
          to: '2025-04-28T00:00:00Z'
        },
        aggregationInterval: { of: 'P30D' },
        evalscript: `//VERSION=3
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
  if (samples.dataMask === 0) {
    return { ndvi: [-1], dataMask: [0] };
  }
  let ndvi = (samples.B08 - samples.B04) / (samples.B08 + samples.B04);
  return { ndvi: [ndvi], dataMask: [samples.dataMask] };
}`,
        resampling: 'BILINEAR'
      }
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ NDVI Statistics:');
    console.log(JSON.stringify(statsRes.data, null, 2));

  } catch (error) {
    console.log('❌ Error:', error.response?.data || error.message);
  }
}

testSentinelHub();
