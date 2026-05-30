const { InfluxDB } = require('@influxdata/influxdb-client');
const { logger } = require('../utils/logger');

const url = process.env.INFLUX_URL || 'http://localhost:8086';
const token = process.env.INFLUX_TOKEN;
const org = process.env.INFLUX_ORG || 'agrocarbon';
const bucket = process.env.INFLUX_BUCKET || 'sensors';

const client = new InfluxDB({ url, token });

const writeApi = client.getWriteApi(org, bucket);
const queryApi = client.getQueryApi(org);

// Write sensor data
const writeSensorData = async (measurement, tags, fields) => {
  try {
    const { Point } = require('@influxdata/influxdb-client');
    const point = new Point(measurement);
    
    // Add tags
    Object.entries(tags).forEach(([key, value]) => {
      point.tag(key, value);
    });
    
    // Add fields
    Object.entries(fields).forEach(([key, value]) => {
      if (typeof value === 'number') {
        point.floatField(key, value);
      } else {
        point.stringField(key, String(value));
      }
    });
    
    writeApi.writePoint(point);
    await writeApi.flush();
    
    logger.info(`📊 Data written to InfluxDB: ${measurement}`);
  } catch (error) {
    logger.error('❌ InfluxDB write error:', error);
    throw error;
  }
};

// Query sensor data
const querySensorData = async (measurement, farmId, start = '-24h') => {
  try {
    const fluxQuery = `
      from(bucket: "${bucket}")
        |> range(start: ${start})
        |> filter(fn: (r) => r._measurement == "${measurement}")
        |> filter(fn: (r) => r.farm_id == "${farmId}")
        |> aggregateWindow(every: 1h, fn: mean, createEmpty: false)
        |> yield(name: "mean")
    `;
    
    const data = [];
    
    return new Promise((resolve, reject) => {
      queryApi.queryRows(fluxQuery, {
        next(row, tableMeta) {
          const o = tableMeta.toObject(row);
          data.push({
            time: o._time,
            field: o._field,
            value: o._value,
            tags: Object.fromEntries(
              Object.entries(o).filter(([k]) => !k.startsWith('_'))
            )
          });
        },
        error(error) {
          logger.error('❌ InfluxDB query error:', error);
          reject(error);
        },
        complete() {
          resolve(data);
        }
      });
    });
  } catch (error) {
    logger.error('❌ InfluxDB query error:', error);
    throw error;
  }
};

// Get carbon emissions summary
const getCarbonSummary = async (farmId, period = '30d') => {
  try {
    const fluxQuery = `
      from(bucket: "${bucket}")
        |> range(start: -${period})
        |> filter(fn: (r) => r._measurement == "carbon_emissions")
        |> filter(fn: (r) => r.farm_id == "${farmId}")
        |> filter(fn: (r) => r._field == "value")
        |> sum()
    `;
    
    let total = 0;
    
    return new Promise((resolve, reject) => {
      queryApi.queryRows(fluxQuery, {
        next(row, tableMeta) {
          const o = tableMeta.toObject(row);
          total = o._value;
        },
        error(error) {
          reject(error);
        },
        complete() {
          resolve({ total, period });
        }
      });
    });
  } catch (error) {
    logger.error('❌ Carbon summary error:', error);
    throw error;
  }
};

module.exports = {
  client,
  writeApi,
  queryApi,
  writeSensorData,
  querySensorData,
  getCarbonSummary
};
