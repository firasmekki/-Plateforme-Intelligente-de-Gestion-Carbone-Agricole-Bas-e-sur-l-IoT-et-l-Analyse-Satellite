// Satellite Service - Backend API + Mock fallback

export interface NDVIData {
  date: string;
  ndvi: number;
  min?: number;
  max?: number;
  health: 'excellent' | 'good' | 'moderate' | 'poor';
}

export interface SatelliteAnalysis {
  zoneId: number;
  area: number;
  coordinates: number[][];
  historicalData: NDVIData[];
  currentNDVI: number;
  healthStatus: string;
  trend: 'improving' | 'stable' | 'declining';
  source: 'sentinel-hub' | 'mock';
}

const API_URL = '/api/satellite';

// Call backend API for real NDVI data
export async function fetchNDVI(
  coordinates: number[][],
  startDate?: string,
  endDate?: string
): Promise<{ source: string; ndviData: NDVIData[]; currentNDVI: number | null }> {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/ndvi`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        coordinates,
        startDate: startDate || new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: endDate || new Date().toISOString()
      })
    });

    if (!response.ok) throw new Error('Failed to fetch NDVI data');
    return await response.json();
  } catch (error) {
    console.log('📊 Using mock NDVI data (backend unavailable)');
    return generateMockNDVIResponse(coordinates);
  }
}

// Mock NDVI response generator
function generateMockNDVIResponse(coordinates: number[][]): { source: string; ndviData: NDVIData[]; currentNDVI: number } {
  const data: NDVIData[] = [];
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
    ndviData: data,
    currentNDVI: data[data.length - 1].ndvi
  };
}

// Analyze zone - uses backend API or mock
export async function analyzeZoneAsync(zoneId: number, area: number, coordinates: number[][]): Promise<SatelliteAnalysis> {
  // Force mock data since backend routes are disabled
  const result = generateMockNDVIResponse(coordinates);
  const historicalData = result.ndviData || [];
  const currentNDVI = result.currentNDVI || (historicalData.length > 0 ? historicalData[historicalData.length - 1].ndvi : 0.5);
  
  // Calculate trend
  const recent = historicalData.slice(-3);
  const older = historicalData.slice(-6, -3);
  const recentAvg = recent.reduce((sum, d) => sum + d.ndvi, 0) / recent.length;
  const olderAvg = older.length > 0 ? older.reduce((sum, d) => sum + d.ndvi, 0) / older.length : recentAvg;
  
  let trend: 'improving' | 'stable' | 'declining';
  const diff = recentAvg - olderAvg;
  if (diff > 0.05) trend = 'improving';
  else if (diff < -0.05) trend = 'declining';
  else trend = 'stable';
  
  let healthStatus: string;
  if (currentNDVI >= 0.75) healthStatus = '🟢 Excellente santé';
  else if (currentNDVI >= 0.6) healthStatus = '🟢 Bonne santé';
  else if (currentNDVI >= 0.4) healthStatus = '🟡 Santé modérée';
  else healthStatus = '🔴 Santé pauvre';
  
  return {
    zoneId,
    area,
    coordinates,
    historicalData,
    currentNDVI,
    healthStatus,
    trend,
    source: result.source as 'sentinel-hub' | 'mock'
  };
}

// Legacy sync function (for backwards compat)
export function analyzeZone(zoneId: number, area: number, coordinates: number[][]): SatelliteAnalysis {
  const result = generateMockNDVIResponse(coordinates);
  const historicalData = result.ndviData;
  const currentNDVI = result.currentNDVI;
  
  const recent = historicalData.slice(-3);
  const older = historicalData.slice(-6, -3);
  const recentAvg = recent.reduce((sum, d) => sum + d.ndvi, 0) / recent.length;
  const olderAvg = older.length > 0 ? older.reduce((sum, d) => sum + d.ndvi, 0) / older.length : recentAvg;
  
  let trend: 'improving' | 'stable' | 'declining';
  const diff = recentAvg - olderAvg;
  if (diff > 0.05) trend = 'improving';
  else if (diff < -0.05) trend = 'declining';
  else trend = 'stable';
  
  let healthStatus: string;
  if (currentNDVI >= 0.75) healthStatus = '🟢 Excellente santé';
  else if (currentNDVI >= 0.6) healthStatus = '🟢 Bonne santé';
  else if (currentNDVI >= 0.4) healthStatus = '🟡 Santé modérée';
  else healthStatus = '🔴 Santé pauvre';
  
  return {
    zoneId,
    area,
    coordinates,
    historicalData,
    currentNDVI,
    healthStatus,
    trend,
    source: 'mock'
  };
}
