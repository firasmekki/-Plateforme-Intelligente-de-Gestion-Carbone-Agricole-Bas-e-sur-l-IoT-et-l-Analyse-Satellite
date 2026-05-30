import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polygon, useMapEvents, useMap } from 'react-leaflet';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, BarChart, Bar } from 'recharts';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { analyzeZoneAsync, type SatelliteAnalysis } from '../services/satelliteService';

// Get color for NDVI value with smooth gradient
function getNDVIColor(ndvi: number): string {
  // Smooth gradient from red (0) to green (1)
  if (ndvi < 0.2) return '#d73027';      // Dark red
  if (ndvi < 0.3) return '#fc8d59';    // Light red
  if (ndvi < 0.4) return '#fee08b';    // Yellow-orange
  if (ndvi < 0.5) return '#d9ef8b';    // Light yellow-green
  if (ndvi < 0.6) return '#91cf60';    // Light green
  if (ndvi < 0.7) return '#66bd63';    // Green
  if (ndvi < 0.8) return '#1a9850';    // Dark green
  return '#006837';                     // Very dark green
}

// Smooth heatmap using Canvas - clips exactly to polygon shape
function SmoothHeatmapOverlay({ polygons, analyses, active }: { polygons: any[], analyses: SatelliteAnalysis[], active: boolean }) {
  const map = useMap();
  const layerRef = useRef<L.ImageOverlay | null>(null);

  useEffect(() => {
    // Clean up previous layer
    if (layerRef.current) {
      map.removeLayer(layerRef.current);
      layerRef.current = null;
    }

    if (!active || polygons.length === 0) {
      return;
    }

    const polygon = polygons[polygons.length - 1];
    const analysis = analyses.find(a => a.zoneId === polygon.id);
    if (!analysis) return;

    // Get polygon bounds
    const coords = polygon.coordinates as number[][];
    const bounds = L.latLngBounds(coords.map((c) => [c[0], c[1]]));
    
    // Create canvas
    const canvas = document.createElement('canvas');
    const resolution = 300; // Higher resolution
    canvas.width = resolution;
    canvas.height = resolution;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill with transparent background
    ctx.clearRect(0, 0, resolution, resolution);

    // Create clipping path for polygon
    ctx.save();
    ctx.beginPath();
    
    // Convert polygon coordinates to canvas coordinates
    const north = bounds.getNorth();
    const south = bounds.getSouth();
    const east = bounds.getEast();
    const west = bounds.getWest();
    
    // Map first point
    const firstX = ((coords[0][1] - west) / (east - west)) * resolution;
    const firstY = resolution - ((coords[0][0] - south) / (north - south)) * resolution;
    ctx.moveTo(firstX, firstY);
    
    // Map remaining points
    for (let i = 1; i < coords.length; i++) {
      const x = ((coords[i][1] - west) / (east - west)) * resolution;
      const y = resolution - ((coords[i][0] - south) / (north - south)) * resolution;
      ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.clip(); // Clip to polygon shape

    // Generate pixel data for smooth heatmap
    const imageData = ctx.createImageData(resolution, resolution);
    const data = imageData.data;

    for (let y = 0; y < resolution; y++) {
      for (let x = 0; x < resolution; x++) {
        const nx = x / resolution;
        const ny = y / resolution;
        
        // Convert to lat/lng to check if inside polygon
        const lng = west + nx * (east - west);
        const lat = south + (1 - ny) * (north - south);

        if (isPointInPolygon([lat, lng], coords)) {
          // Generate smooth NDVI with variation
          const baseNDVI = analysis.currentNDVI;
          const wave1 = Math.sin(nx * 12) * Math.cos(ny * 10) * 0.12;
          const wave2 = Math.sin(nx * 20 + ny * 8) * 0.08;
          const noise = (Math.random() - 0.5) * 0.04;
          const ndvi = Math.max(0.15, Math.min(0.9, baseNDVI + wave1 + wave2 + noise));

          // Get color
          const color = getNDVIColor(ndvi);
          const r = parseInt(color.slice(1, 3), 16);
          const g = parseInt(color.slice(3, 5), 16);
          const b = parseInt(color.slice(5, 7), 16);

          const idx = (y * resolution + x) * 4;
          data[idx] = r;
          data[idx + 1] = g;
          data[idx + 2] = b;
          data[idx + 3] = 200; // 78% opacity
        }
      }
    }

    // Apply Gaussian blur for smoothness
    ctx.filter = 'blur(2px)';
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = resolution;
    tempCanvas.height = resolution;
    const tempCtx = tempCanvas.getContext('2d');
    if (tempCtx) {
      tempCtx.putImageData(imageData, 0, 0);
      ctx.drawImage(tempCanvas, 0, 0);
    }
    
    ctx.restore();

    // Create overlay
    const imageUrl = canvas.toDataURL();
    layerRef.current = L.imageOverlay(imageUrl, bounds, {
      opacity: 0.85,
      interactive: false
    }).addTo(map);

    return () => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
      }
    };
  }, [map, polygons, analyses, active]);

  return null;
}

// Point in polygon check
function isPointInPolygon(point: number[], vs: number[][]): boolean {
  const x = point[0], y = point[1];
  let inside = false;
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    const xi = vs[i][0], yi = vs[i][1];
    const xj = vs[j][0], yj = vs[j][1];
    
    const intersect = ((yi > y) !== (yj > y)) &&
        (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

// NDVI Histogram Component
function NDVIHistogram({ currentNDVI }: { currentNDVI: number }) {
  // Generate histogram data based on current NDVI
  const bins = [
    { range: '0.0-0.2', count: 5, color: '#d73027' },
    { range: '0.2-0.3', count: 12, color: '#fc8d59' },
    { range: '0.3-0.4', count: 18, color: '#fee08b' },
    { range: '0.4-0.5', count: 25, color: '#d9ef8b' },
    { range: '0.5-0.6', count: 30, color: '#91cf60' },
    { range: '0.6-0.7', count: 22, color: '#66bd63' },
    { range: '0.7-0.8', count: 15, color: '#1a9850' },
    { range: '0.8-1.0', count: 8, color: '#006837' },
  ];

  // Adjust distribution based on current NDVI
  const adjustedBins = bins.map((bin, idx) => {
    const binCenter = (parseFloat(bin.range.split('-')[0]) + parseFloat(bin.range.split('-')[1])) / 2;
    const distance = Math.abs(binCenter - currentNDVI);
    const factor = Math.max(0.3, 1 - distance * 1.5);
    return { ...bin, count: Math.round(bin.count * factor) + Math.floor(Math.random() * 5) };
  });

  const maxCount = Math.max(...adjustedBins.map(b => b.count));

  return (
    <div className="space-y-2">
      {/* Bars */}
      <div className="flex items-end gap-1 h-24">
        {adjustedBins.map((bin, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center gap-1">
            <div 
              className="w-full rounded-t-sm"
              style={{ 
                height: `${(bin.count / maxCount) * 100}%`,
                backgroundColor: bin.color,
                minHeight: '4px'
              }}
            />
          </div>
        ))}
      </div>
      
      {/* X-axis labels */}
      <div className="flex justify-between text-xs text-slate-500 px-1">
        <span>0.0</span>
        <span>0.2</span>
        <span>0.4</span>
        <span>0.6</span>
        <span>0.8</span>
        <span>1.0</span>
      </div>
      
      {/* Legend */}
      <div className="flex justify-between text-xs pt-2 border-t border-slate-100">
        <span className="text-red-600">Low veg</span>
        <span className="text-green-600">Dense veg</span>
      </div>
    </div>
  );
}

// NDVI Scale Bar Component - ROBOCARE style
function NDVIScaleBar() {
  return (
    <div className="absolute bottom-4 left-4 bg-white rounded-lg p-3 shadow-2xl border border-slate-200 min-w-[200px]">
      <div className="text-sm font-bold text-slate-800 mb-2">NDVI Scale</div>
      {/* Continuous gradient bar */}
      <div className="h-4 rounded-md mb-2" style={{ 
        background: 'linear-gradient(to right, #d73027, #fc8d59, #fee08b, #d9ef8b, #91cf60, #1a9850, #006837)'
      }} />
      {/* Scale labels */}
      <div className="flex justify-between text-xs text-slate-600 mb-3">
        <span>0.0</span>
        <span>0.25</span>
        <span>0.5</span>
        <span>0.75</span>
        <span>1.0</span>
      </div>
      {/* Legend */}
      <div className="space-y-1 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm" style={{ background: '#d73027' }} />
          <span className="text-slate-700">The area with the lowest vegetation</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm" style={{ background: '#006837' }} />
          <span className="text-slate-700">The area with the densest vegetation</span>
        </div>
      </div>
    </div>
  );
}

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapClickHandler({ isDrawing, onMapClick }: { isDrawing: boolean; onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      if (isDrawing) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    }
  });
  return null;
}

export default function SatelliteFarmV2() {
  const [polygons, setPolygons] = useState<any[]>([]);
  const [analyses, setAnalyses] = useState<SatelliteAnalysis[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tempPoints, setTempPoints] = useState<[number, number][]>([]);
  const [activeTab, setActiveTab] = useState<'details' | 'analysis' | 'productivity'>('details');
  const [activeLayer, setActiveLayer] = useState<'truecolor' | 'ndvi' | 'irrigation'>('truecolor');
  const [selectedPolygon, setSelectedPolygon] = useState<any>(null);

  const tunisiaCenter: [number, number] = [33.8869, 9.5375];

  const handleMapClick = (lat: number, lng: number) => {
    setTempPoints([...tempPoints, [lat, lng]]);
  };

  const handlePolygonComplete = async () => {
    if (tempPoints.length < 3) return;
    
    const area = calculateArea(tempPoints);
    const newPolygon = {
      id: Date.now(),
      coordinates: tempPoints,
      area
    };
    
    setPolygons([...polygons, newPolygon]);
    setTempPoints([]);
    setIsDrawing(false);
    setSelectedPolygon(newPolygon);
    
    try {
      const analysis = await analyzeZoneAsync(newPolygon.id, area, tempPoints);
      setAnalyses(prev => [...prev, analysis]);
    } catch (error) {
      console.error('NDVI analysis failed:', error);
    }
  };

  const startDrawing = () => {
    setIsDrawing(true);
    setTempPoints([]);
  };

  const cancelDrawing = () => {
    setIsDrawing(false);
    setTempPoints([]);
  };

  const calculateArea = (coordinates: number[][]) => {
    let area = 0;
    for (let i = 0; i < coordinates.length; i++) {
      const j = (i + 1) % coordinates.length;
      area += coordinates[i][0] * coordinates[j][1];
      area -= coordinates[j][0] * coordinates[i][1];
    }
    return Math.abs(area / 2) * 111.32 * 111.32;
  };

  const selectedAnalysis = selectedPolygon ? analyses.find(a => a.zoneId === selectedPolygon.id) : null;

  const getNDVIHeatmapColor = (ndvi: number) => {
    if (ndvi < 0.3) return '#ef4444';
    if (ndvi < 0.5) return '#f59e0b';
    if (ndvi < 0.7) return '#84cc16';
    return '#22c55e';
  };

  const handleExportGeoTIFF = () => {
    if (!selectedAnalysis) return;
    const data = JSON.stringify(selectedAnalysis, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ndvi-analysis-${selectedAnalysis.zoneId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full w-full flex flex-col bg-slate-100">
      {/* Header */}
      <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0" style={{ zIndex: 10001 }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
            <span className="text-lg">🛰️</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800">AgroCarbon</h1>
            <p className="text-xs text-slate-500">Analyse Satellite</p>
          </div>
        </div>

        <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
          {[
            { id: 'details', label: 'Vue Générale', icon: '📋' },
            { id: 'analysis', label: 'Analyse NDVI', icon: '📊' },
            { id: 'productivity', label: 'Productivité', icon: '🌾' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === tab.id
                  ? 'bg-white text-emerald-600 shadow-sm'
                  : 'text-slate-600'
              }`}
            >
              <span className="mr-1">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={activeLayer}
            onChange={(e) => setActiveLayer(e.target.value as any)}
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm bg-white"
          >
            <option value="truecolor">🌍 Satellite</option>
            <option value="ndvi">🌿 NDVI</option>
            <option value="irrigation">💧 Irrigation</option>
          </select>
          
          {!isDrawing ? (
            <button
              onClick={startDrawing}
              className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-sm font-medium"
            >
              ⬡ Nouveau Champ
            </button>
          ) : (
            <div className="flex items-center gap-1">
              <button
                onClick={handlePolygonComplete}
                disabled={tempPoints.length < 3}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium disabled:opacity-50"
              >
                ✓ Valider
              </button>
              <button
                onClick={cancelDrawing}
                className="px-3 py-1.5 bg-slate-400 text-white rounded-lg text-sm font-medium"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex min-h-0 relative" style={{ width: '100%' }}>
        {/* Left Panel - Sidebar */}
        <div className="bg-white border-r border-slate-200 flex flex-col shadow-lg overflow-hidden relative" style={{ zIndex: 10000, width: '320px', minWidth: '320px', maxWidth: '320px' }}>
          {/* Sidebar Header */}
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <h2 className="font-bold text-slate-800">Détails du champ</h2>
            <p className="text-xs text-slate-500 mt-1">Analyse NDVI et statistiques</p>
          </div>
          
          {activeTab === 'details' && (
            <div className="flex-1 flex flex-col gap-3 p-4 overflow-hidden">
              {selectedPolygon ? (
                <>
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <div className="flex items-center gap-2 mb-3">
                      <span>🗺️</span>
                      <h3 className="font-bold text-blue-900">Champ</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white rounded-lg p-3">
                        <div className="text-xs text-blue-600 mb-1">Surface</div>
                        <div className="text-xl font-bold text-blue-900">{selectedPolygon.area.toFixed(2)} ha</div>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <div className="text-xs text-blue-600 mb-1">Points</div>
                        <div className="text-xl font-bold text-blue-900">{selectedPolygon.coordinates.length}</div>
                      </div>
                    </div>
                  </div>

                  {selectedAnalysis && (
                    <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
                      <div className="flex items-center gap-2 mb-3">
                        <span>🌿</span>
                        <h3 className="font-bold text-emerald-900">NDVI Actuel</h3>
                      </div>
                      <div className="flex items-end gap-3 mb-2">
                        <div className="text-4xl font-extrabold text-emerald-600">
                          {selectedAnalysis.currentNDVI.toFixed(3)}
                        </div>
                        <div className="flex items-center gap-2 pb-1">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: getNDVIHeatmapColor(selectedAnalysis.currentNDVI) }} />
                          <span className="text-sm text-emerald-700">{selectedAnalysis.healthStatus}</span>
                        </div>
                      </div>
                      <div className="w-full bg-white rounded-full h-2">
                        <div 
                          className="h-full rounded-full"
                          style={{ 
                            width: `${selectedAnalysis.currentNDVI * 100}%`,
                            backgroundColor: getNDVIHeatmapColor(selectedAnalysis.currentNDVI)
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="bg-amber-50 rounded-lg p-4 border border-amber-100 flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span>🤖</span>
                      <h3 className="font-bold text-amber-900">Recommandations IA</h3>
                    </div>
                    <ul className="space-y-2 text-sm text-amber-800">
                      <li className="flex items-start gap-2">
                        <span>💧</span>
                        <span>Zone irrigation prioritaire: Nord</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span>⚠️</span>
                        <span>Stress hydrique: +15%</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span>🌾</span>
                        <span>Récolte: 2-3 semaines</span>
                      </li>
                    </ul>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                  <span className="text-4xl mb-2">🗺️</span>
                  <p className="text-sm">Sélectionnez ou dessinez un champ</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'analysis' && (
            <div className="flex-1 flex flex-col gap-3 p-4 overflow-hidden">
              {selectedAnalysis ? (
                <>
                  {/* NDVI Distribution Histogram */}
                  <div className="bg-white rounded-lg p-4 border border-slate-200">
                    <h3 className="font-bold text-slate-900 mb-3">NDVI Distribution</h3>
                    <NDVIHistogram currentNDVI={selectedAnalysis.currentNDVI} />
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-slate-200">
                    <h3 className="font-bold text-slate-900 mb-3">Statistiques</h3>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-red-50 rounded-lg p-2 text-center">
                        <div className="text-xs text-red-600 mb-1">Min</div>
                        <div className="font-bold text-red-600">{Math.min(...selectedAnalysis.historicalData.map(d => d.ndvi)).toFixed(3)}</div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-2 text-center">
                        <div className="text-xs text-green-600 mb-1">Max</div>
                        <div className="font-bold text-green-600">{Math.max(...selectedAnalysis.historicalData.map(d => d.ndvi)).toFixed(3)}</div>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-2 text-center">
                        <div className="text-xs text-blue-600 mb-1">Moy</div>
                        <div className="font-bold text-blue-600">{(selectedAnalysis.historicalData.reduce((sum, d) => sum + d.ndvi, 0) / selectedAnalysis.historicalData.length).toFixed(3)}</div>
                      </div>
                    </div>
                  </div>

                  {/* NDVI Gradient Scale */}
                  <div className="bg-white rounded-lg p-4 border border-slate-200">
                    <h3 className="font-bold text-slate-900 mb-3">NDVI Scale</h3>
                    <div className="space-y-3">
                      <div className="h-4 rounded-lg" style={{ 
                        background: 'linear-gradient(to right, #d73027, #fc8d59, #fee08b, #d9ef8b, #91cf60, #1a9850, #006837)' 
                      }} />
                      <div className="flex justify-between text-xs text-slate-600">
                        <span>0.0</span>
                        <span>0.25</span>
                        <span>0.50</span>
                        <span>0.75</span>
                        <span>1.0</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-red-600 font-medium">Low</span>
                        <span className="text-yellow-600 font-medium">Moderate</span>
                        <span className="text-green-600 font-medium">High</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                  <span className="text-4xl mb-2">📊</span>
                  <p className="text-sm">Sélectionnez un champ pour voir l'analyse NDVI</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'productivity' && (
            <div className="flex-1 flex flex-col gap-3 p-4 overflow-hidden">
              {selectedAnalysis ? (
                <>
                  {/* KPI Cards */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100 text-center">
                      <div className="text-2xl mb-1">📈</div>
                      <div className="text-xs text-emerald-600 font-medium">Évolution</div>
                      <div className="text-lg font-bold text-emerald-700">+{((selectedAnalysis.historicalData[selectedAnalysis.historicalData.length-1]?.ndvi - selectedAnalysis.historicalData[0]?.ndvi) * 100).toFixed(1)}%</div>
                      <div className="text-xs text-emerald-500">vs début</div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-100 text-center">
                      <div className="text-2xl mb-1">🎯</div>
                      <div className="text-xs text-blue-600 font-medium">Moyenne</div>
                      <div className="text-lg font-bold text-blue-700">{(selectedAnalysis.historicalData.reduce((sum, d) => sum + d.ndvi, 0) / selectedAnalysis.historicalData.length).toFixed(3)}</div>
                      <div className="text-xs text-blue-500">NDVI moyen</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3 border border-purple-100 text-center">
                      <div className="text-2xl mb-1">📊</div>
                      <div className="text-xs text-purple-600 font-medium">Stabilité</div>
                      <div className="text-lg font-bold text-purple-700">{((1 - (Math.max(...selectedAnalysis.historicalData.map(d => d.ndvi)) - Math.min(...selectedAnalysis.historicalData.map(d => d.ndvi)))) * 100).toFixed(0)}%</div>
                      <div className="text-xs text-purple-500">indice stabilité</div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-slate-200 flex-1">
                    <h3 className="font-bold text-slate-900 mb-3">Tendance NDVI</h3>
                    <div className="h-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={selectedAnalysis.historicalData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="date" tick={{ fontSize: 9 }} tickFormatter={(v) => v.slice(5)} />
                          <YAxis domain={[0, 1]} tick={{ fontSize: 9 }} />
                          <Tooltip formatter={(v: any) => v.toFixed(3)} />
                          <Area type="monotone" dataKey="ndvi" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                    <h3 className="font-bold text-amber-900 mb-3">💡 Recommandations IA</h3>
                    <div className="space-y-2 text-sm">
                      {selectedAnalysis.currentNDVI > 0.6 ? (
                        <div className="flex items-center gap-3 p-2 bg-white rounded-lg">
                          <span className="text-green-600">✅</span>
                          <div>
                            <div className="font-medium text-slate-700">Culture optimale</div>
                            <div className="text-xs text-slate-500">Maintenir les pratiques actuelles</div>
                          </div>
                        </div>
                      ) : selectedAnalysis.currentNDVI > 0.4 ? (
                        <>
                          <div className="flex items-center gap-3 p-2 bg-white rounded-lg">
                            <span className="text-blue-600">💧</span>
                            <div>
                              <div className="font-medium text-slate-700">Irrigation recommandée</div>
                              <div className="text-xs text-slate-500">+20% d'apport en eau cette semaine</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-2 bg-white rounded-lg">
                            <span className="text-orange-600">🌡️</span>
                            <div>
                              <div className="font-medium text-slate-700">Surveillance stress</div>
                              <div className="text-xs text-slate-500">Vérifier les zones jaunes sur la carte</div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-3 p-2 bg-red-50 rounded-lg border border-red-100">
                            <span className="text-red-600">🚨</span>
                            <div>
                              <div className="font-medium text-red-700">Intervention urgente!</div>
                              <div className="text-xs text-red-500">Irrigation immédiate requise</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-2 bg-white rounded-lg">
                            <span className="text-amber-600">🧪</span>
                            <div>
                              <div className="font-medium text-slate-700">Analyse de sol</div>
                              <div className="text-xs text-slate-500">Recommandé: tester pH et nutriments</div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                  <span className="text-4xl mb-2">🌾</span>
                  <p className="text-sm">Sélectionnez un champ pour voir la productivité</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right - Map */}
        <div className="relative overflow-hidden" style={{ zIndex: 1, flex: 1, minWidth: 0 }}>
          <MapContainer
            center={tunisiaCenter}
            zoom={8}
            style={{ height: '100%', width: '100%' }}
          >
            <MapClickHandler isDrawing={isDrawing} onMapClick={handleMapClick} />

            {activeLayer === 'truecolor' && (
              <>
                <TileLayer
                  attribution='Tiles &copy; Esri'
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  maxZoom={19}
                />
                <TileLayer
                  attribution='&copy; OpenStreetMap'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  opacity={0.3}
                />
              </>
            )}

            {activeLayer === 'ndvi' && (
              <TileLayer
                attribution='Tiles &copy; Esri'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                maxZoom={19}
              />
            )}

            {activeLayer === 'irrigation' && (
              <TileLayer
                attribution='Tiles &copy; Esri'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                maxZoom={19}
              />
            )}

            {tempPoints.length > 0 && (
              <Polygon
                positions={tempPoints as any}
                pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.3, dashArray: '5, 5' }}
              />
            )}

            {polygons.map((polygon) => {
              const analysis = analyses.find(a => a.zoneId === polygon.id);
              const fillColor = analysis ? getNDVIHeatmapColor(analysis.currentNDVI) : '#22c55e';
              return (
                <Polygon
                  key={polygon.id}
                  positions={polygon.coordinates as any}
                  pathOptions={{
                    color: fillColor,
                    fillColor: fillColor,
                    fillOpacity: activeLayer === 'ndvi' ? 0 : 0.3,
                    weight: 2
                  }}
                  eventHandlers={{
                    click: () => setSelectedPolygon(polygon)
                  }}
                />
              );
            })}
            
            {/* Smooth heatmap overlay */}
            <SmoothHeatmapOverlay 
              polygons={polygons} 
              analyses={analyses} 
              active={activeLayer === 'ndvi'} 
            />
          </MapContainer>

          {isDrawing && (
            <div className="absolute top-4 left-4 bg-white border border-slate-200 rounded-lg px-4 py-2 shadow-md">
              <span className="text-sm font-medium text-slate-700">
                Points: {tempPoints.length} / 3 min
              </span>
            </div>
          )}

          {/* NDVI Scale Bar - show when field is selected */}
          {selectedPolygon && <NDVIScaleBar />}
          
          {/* Field Selector Dropdown on Map */}
          {polygons.length > 0 && (
            <div className="absolute top-4 right-4 bg-white rounded-lg shadow-xl border border-slate-200 p-2 z-[1000]">
              <select 
                value={selectedPolygon?.id || ''} 
                onChange={(e) => {
                  const selected = polygons.find(p => p.id.toString() === e.target.value);
                  setSelectedPolygon(selected || null);
                }}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 min-w-[180px]"
              >
                <option value="">Sélectionner un champ</option>
                {polygons.map((p, idx) => (
                  <option key={p.id} value={p.id}>
                    Champ {idx + 1} - {p.area.toFixed(2)} ha
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

