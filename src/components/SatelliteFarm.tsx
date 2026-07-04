import { useState } from 'react';
import { MapContainer, TileLayer, Polygon, useMapEvents, LayersControl } from 'react-leaflet';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { analyzeZoneAsync, type SatelliteAnalysis } from '../services/satelliteService';

// Fix Leaflet default icon issue
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

export default function SatelliteFarm() {
  const [polygons, setPolygons] = useState<any[]>([]);
  const [analyses, setAnalyses] = useState<SatelliteAnalysis[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tempPoints, setTempPoints] = useState<[number, number][]>([]);
  const [activeTab, setActiveTab] = useState<'details' | 'analysis' | 'productivity'>('details');
  const [activeLayer, setActiveLayer] = useState<'truecolor' | 'ndvi' | 'irrigation'>('truecolor');
  const [selectedPolygon, setSelectedPolygon] = useState<any>(null);

  const tunisiaCenter: [number, number] = [33.8869, 9.5375]; // Tunisie center

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
    
    // Analyze zone via backend API (async)
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
    // Simplified area calculation (Shoelace formula)
    let area = 0;
    for (let i = 0; i < coordinates.length; i++) {
      const j = (i + 1) % coordinates.length;
      area += coordinates[i][0] * coordinates[j][1];
      area -= coordinates[j][0] * coordinates[i][1];
    }
    return Math.abs(area / 2) * 111.32 * 111.32; // Approximate conversion to hectares
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">🛰️ Satellite Farm Analysis</h1>
        <p className="text-gray-500 mt-1">Sélectionnez votre ferme sur la carte satellite pour l'analyse NDVI</p>
      </div>

      {/* Map Container */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden relative">
        <div style={{ height: '600px', width: '100%' }}>
          <MapContainer 
            center={tunisiaCenter} 
            zoom={8} 
            style={{ height: '100%', width: '100%' }}
          >
            <MapClickHandler isDrawing={isDrawing} onMapClick={handleMapClick} />
            
            {/* Satellite Imagery Layer */}
            <TileLayer
              attribution='Tiles &copy; Esri'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              maxZoom={19}
            />
            
            {/* Street Map Overlay (optional) */}
            <TileLayer
              attribution='&copy; OpenStreetMap'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              opacity={0.3}
            />

            {tempPoints.length > 0 && (
              <Polygon
                positions={tempPoints as any}
                pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.3, dashArray: '5, 5' }}
              />
            )}

            {polygons.map((polygon) => (
              <Polygon
                key={polygon.id}
                positions={polygon.coordinates as any}
                pathOptions={{ color: '#22c55e', fillColor: '#22c55e', fillOpacity: 0.4 }}
              />
            ))}
          </MapContainer>
        </div>

        {/* Drawing Controls - Overlay on Map */}
        <div className="absolute top-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-4">
          {!isDrawing ? (
            <button
              onClick={startDrawing}
              className="flex items-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors shadow-md"
            >
              <span className="text-xl">⬡</span>
              <span>Dessiner une zone</span>
            </button>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="text-sm font-medium text-gray-700">
                Points: {tempPoints.length} (min 3)
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handlePolygonComplete}
                  disabled={tempPoints.length < 3}
                  className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  ✓ Terminer
                </button>
                <button
                  onClick={cancelDrawing}
                  className="flex-1 px-3 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg font-medium transition-colors text-sm"
                >
                  ✕ Annuler
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Selected Zones */}
      {analyses.length > 0 && (
        <div className="mt-8 bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Analyse NDVI des Zones</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analyses.map((analysis) => (
              <div key={analysis.zoneId} className="p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl border border-green-100">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-sm text-gray-600">Zone {analysis.zoneId}</div>
                    <div className={`text-xs mt-1 px-2 py-0.5 rounded-full inline-block ${
                      analysis.source === 'sentinel-hub' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {analysis.source === 'sentinel-hub' ? '🛰️ Sentinel Hub' : '📊 Mock Data'}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {analysis.area.toFixed(2)} ha
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="text-xs text-gray-500">NDVI Actuel</div>
                  <div className="text-3xl font-bold text-green-700">
                    {analysis.currentNDVI.toFixed(3)}
                  </div>
                  <div className="text-sm text-gray-600">{analysis.healthStatus}</div>
                </div>

                <div className="mb-3">
                  <div className="text-xs text-gray-500">Tendance</div>
                  <div className={`text-sm font-semibold ${
                    analysis.trend === 'improving' ? 'text-green-600' :
                    analysis.trend === 'stable' ? 'text-blue-600' : 'text-red-600'
                  }`}>
                    {analysis.trend === 'improving' ? '📈 Amélioration' :
                     analysis.trend === 'stable' ? '➡️ Stable' : '📉 Déclin'}
                  </div>
                </div>

                {/* Mini Chart */}
                <div className="mt-4 h-32">
                  <ResponsiveContainer width="100%" height={128}>
                    <AreaChart data={analysis.historicalData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 10 }}
                        tickFormatter={(value) => value.slice(5)}
                      />
                      <YAxis 
                        domain={[0, 1]}
                        tick={{ fontSize: 10 }}
                      />
                      <Tooltip 
                        formatter={(value: any) => value ? value.toFixed(3) : '0'}
                        labelFormatter={(value: any) => value}
                      />
                      <Area
                        type="monotone"
                        dataKey="ndvi"
                        stroke="#22c55e"
                        fill="#22c55e"
                        fillOpacity={0.3}
                        isAnimationActive={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 bg-blue-50 rounded-2xl p-6 border border-blue-100">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">📋 Instructions</h3>
        <ul className="space-y-2 text-blue-700">
          <li>• Cliquez sur l'icône polygon (pentagone) dans le coin supérieur droit</li>
          <li>• Dessinez les contours de votre ferme sur la carte</li>
          <li>• Cliquez sur "Analyser NDVI" pour l'analyse de végétation</li>
          <li>• Les données historiques seront affichées automatiquement</li>
        </ul>
      </div>
    </div>
  );
}
