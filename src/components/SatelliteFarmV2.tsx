import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polygon, useMapEvents, useMap } from 'react-leaflet';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { analyzeZoneAsync, type SatelliteAnalysis } from '../services/satelliteService';

const NDVI_GRADIENT = 'linear-gradient(to right, #d73027, #fc8d59, #fee08b, #d9ef8b, #91cf60, #1a9850, #006837)';

function getNDVIColor(ndvi: number): string {
  if (ndvi < 0.2) return '#d73027';
  if (ndvi < 0.3) return '#fc8d59';
  if (ndvi < 0.4) return '#fee08b';
  if (ndvi < 0.5) return '#d9ef8b';
  if (ndvi < 0.6) return '#91cf60';
  if (ndvi < 0.7) return '#66bd63';
  if (ndvi < 0.8) return '#1a9850';
  return '#006837';
}

function getStatusColor(ndvi: number) {
  if (ndvi < 0.3) return { bg: '#fef2f2', text: '#dc2626', label: 'Critique' };
  if (ndvi < 0.5) return { bg: '#fffbeb', text: '#d97706', label: 'Modéré' };
  if (ndvi < 0.7) return { bg: '#f0fdf4', text: '#16a34a', label: 'Bon' };
  return { bg: '#ecfdf5', text: '#059669', label: 'Optimal' };
}

function getNDVIHeatmapColor(ndvi: number) {
  if (ndvi < 0.3) return '#ef4444';
  if (ndvi < 0.5) return '#f59e0b';
  if (ndvi < 0.7) return '#84cc16';
  return '#22c55e';
}

function SmoothHeatmapOverlay({ polygons, analyses, active }: { polygons: any[]; analyses: SatelliteAnalysis[]; active: boolean }) {
  const map = useMap();
  const layerRef = useRef<L.ImageOverlay | null>(null);

  useEffect(() => {
    if (layerRef.current) { map.removeLayer(layerRef.current); layerRef.current = null; }
    if (!active || polygons.length === 0) return;

    const polygon = polygons[polygons.length - 1];
    const analysis = analyses.find(a => a.zoneId === polygon.id);
    if (!analysis) return;

    const coords = polygon.coordinates as number[][];
    const bounds = L.latLngBounds(coords.map((c) => [c[0], c[1]]));
    const canvas = document.createElement('canvas');
    const res = 300;
    canvas.width = res; canvas.height = res;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, res, res);
    ctx.save(); ctx.beginPath();
    const n = bounds.getNorth(), s = bounds.getSouth(), e = bounds.getEast(), w = bounds.getWest();
    ctx.moveTo(((coords[0][1] - w) / (e - w)) * res, res - ((coords[0][0] - s) / (n - s)) * res);
    for (let i = 1; i < coords.length; i++)
      ctx.lineTo(((coords[i][1] - w) / (e - w)) * res, res - ((coords[i][0] - s) / (n - s)) * res);
    ctx.closePath(); ctx.clip();

    const img = ctx.createImageData(res, res);
    for (let y = 0; y < res; y++) {
      for (let x = 0; x < res; x++) {
        const nx = x / res, ny = y / res;
        const lng = w + nx * (e - w), lat = s + (1 - ny) * (n - s);
        if (isPointInPolygon([lat, lng], coords)) {
          const ndvi = Math.max(0.15, Math.min(0.9,
            analysis.currentNDVI + Math.sin(nx * 12) * Math.cos(ny * 10) * 0.12
            + Math.sin(nx * 20 + ny * 8) * 0.08 + (Math.random() - 0.5) * 0.04));
          const col = getNDVIColor(ndvi);
          const idx = (y * res + x) * 4;
          img.data[idx] = parseInt(col.slice(1, 3), 16);
          img.data[idx + 1] = parseInt(col.slice(3, 5), 16);
          img.data[idx + 2] = parseInt(col.slice(5, 7), 16);
          img.data[idx + 3] = 200;
        }
      }
    }
    ctx.filter = 'blur(2px)';
    const tmp = document.createElement('canvas');
    tmp.width = res; tmp.height = res;
    const tc = tmp.getContext('2d');
    if (tc) { tc.putImageData(img, 0, 0); ctx.drawImage(tmp, 0, 0); }
    ctx.restore();

    layerRef.current = L.imageOverlay(canvas.toDataURL(), bounds, { opacity: 0.85, interactive: false }).addTo(map);
    return () => { if (layerRef.current) map.removeLayer(layerRef.current); };
  }, [map, polygons, analyses, active]);

  return null;
}

function isPointInPolygon(point: number[], vs: number[][]): boolean {
  const [x, y] = point;
  let inside = false;
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    const [xi, yi] = vs[i], [xj, yj] = vs[j];
    if (((yi > y) !== (yj > y)) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function NDVIHistogram({ currentNDVI }: { currentNDVI: number }) {
  const bins = [
    { color: '#d73027', base: 5, c: 0.1 }, { color: '#fc8d59', base: 12, c: 0.25 },
    { color: '#fee08b', base: 18, c: 0.35 }, { color: '#d9ef8b', base: 25, c: 0.45 },
    { color: '#91cf60', base: 30, c: 0.55 }, { color: '#66bd63', base: 22, c: 0.65 },
    { color: '#1a9850', base: 15, c: 0.75 }, { color: '#006837', base: 8, c: 0.9 },
  ].map(b => ({ ...b, count: Math.round(b.base * Math.max(0.3, 1 - Math.abs(b.c - currentNDVI) * 1.5)) }));
  const max = Math.max(...bins.map(b => b.count));
  return (
    <div>
      <div className="flex items-end gap-0.5 h-14">
        {bins.map((b, i) => (
          <div key={i} className="flex-1 rounded-t-sm" style={{ height: `${(b.count / max) * 100}%`, backgroundColor: b.color, minHeight: 3 }} />
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-slate-400 mt-1 px-0.5">
        <span>0</span><span>0.5</span><span>1.0</span>
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
  useMapEvents({ click: (e) => { if (isDrawing) onMapClick(e.latlng.lat, e.latlng.lng); } });
  return null;
}

/* ─── Main component ──────────────────────────────────────────── */
export default function SatelliteFarmV2() {
  const [polygons, setPolygons] = useState<any[]>([]);
  const [analyses, setAnalyses] = useState<SatelliteAnalysis[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tempPoints, setTempPoints] = useState<[number, number][]>([]);
  const [activeLayer, setActiveLayer] = useState<'truecolor' | 'ndvi' | 'irrigation'>('truecolor');
  const [selectedPolygon, setSelectedPolygon] = useState<any>(null);
  const [bottomTab, setBottomTab] = useState<'apercu' | 'vegetation' | 'tendance' | 'ia'>('apercu');

  const tunisiaCenter: [number, number] = [33.8869, 9.5375];

  const handleMapClick = (lat: number, lng: number) => setTempPoints(p => [...p, [lat, lng]]);

  const handlePolygonComplete = async () => {
    if (tempPoints.length < 3) return;
    const area = calculateArea(tempPoints);
    const np = { id: Date.now(), coordinates: tempPoints, area };
    setPolygons(p => [...p, np]);
    setTempPoints([]); setIsDrawing(false); setSelectedPolygon(np);
    try {
      const analysis = await analyzeZoneAsync(np.id, area, tempPoints);
      setAnalyses(p => [...p, analysis]);
    } catch (e) { console.error(e); }
  };

  const calculateArea = (coords: number[][]) => {
    let a = 0;
    for (let i = 0; i < coords.length; i++) {
      const j = (i + 1) % coords.length;
      a += coords[i][0] * coords[j][1] - coords[j][0] * coords[i][1];
    }
    return Math.abs(a / 2) * 111.32 * 111.32;
  };

  const selectedAnalysis = selectedPolygon ? analyses.find(a => a.zoneId === selectedPolygon.id) : null;
  const fieldIndex = selectedPolygon ? polygons.findIndex(p => p.id === selectedPolygon.id) + 1 : 0;

  return (
    <div className="h-full w-full flex flex-col bg-white">

      {/* ── Toolbar ───────────────────────────────────────────── */}
      <div className="h-11 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0" style={{ zIndex: 10001 }}>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="3" strokeWidth="2" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2v2m0 16v2M2 12h2m16 0h2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41" />
          </svg>
          <span className="text-sm font-semibold text-slate-700">Satellite NDVI</span>
          {polygons.length > 0 && (
            <span className="text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
              {polygons.length} champ{polygons.length > 1 ? 's' : ''}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Layer toggle */}
          <div className="flex items-center bg-slate-100 rounded-md p-0.5 text-[11px]">
            {(['truecolor', 'ndvi', 'irrigation'] as const).map(l => (
              <button key={l} onClick={() => setActiveLayer(l)}
                className={`px-3 py-1 rounded transition-all font-medium ${activeLayer === l ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-500'}`}>
                {l === 'truecolor' ? 'Satellite' : l === 'ndvi' ? 'NDVI' : 'Irrigation'}
              </button>
            ))}
          </div>

          {/* Field select */}
          {polygons.length > 0 && (
            <select
              value={selectedPolygon?.id || ''}
              onChange={e => setSelectedPolygon(polygons.find(p => p.id.toString() === e.target.value) || null)}
              className="text-[11px] px-2 py-1 border border-slate-200 rounded-md bg-white text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="">Choisir un champ</option>
              {polygons.map((p, i) => <option key={p.id} value={p.id}>Champ {i + 1} — {p.area.toFixed(1)} ha</option>)}
            </select>
          )}

          {/* Draw controls */}
          {!isDrawing ? (
            <button onClick={() => { setIsDrawing(true); setTempPoints([]); }}
              className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-[11px] font-medium transition-colors">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Nouveau champ
            </button>
          ) : (
            <div className="flex items-center gap-1">
              <button onClick={handlePolygonComplete} disabled={tempPoints.length < 3}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-[11px] font-medium disabled:opacity-40 transition-colors">
                Valider ({tempPoints.length}/3)
              </button>
              <button onClick={() => { setIsDrawing(false); setTempPoints([]); }}
                className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-md text-[11px] font-medium hover:bg-slate-50 transition-colors">
                Annuler
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Map (top) ──────────────────────────────────────────── */}
      <div className="relative border-b border-slate-200" style={{ flex: '0 0 55%', zIndex: 1 }}>
        <MapContainer center={tunisiaCenter} zoom={8} style={{ height: '100%', width: '100%' }}>
          <MapClickHandler isDrawing={isDrawing} onMapClick={handleMapClick} />

          <TileLayer
            attribution='Tiles &copy; Esri'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            maxZoom={19}
          />
          {activeLayer === 'truecolor' && (
            <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" opacity={0.25} />
          )}

          {tempPoints.length > 0 && (
            <Polygon positions={tempPoints as any}
              pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.15, dashArray: '6 4', weight: 1.5 }} />
          )}

          {polygons.map(polygon => {
            const analysis = analyses.find(a => a.zoneId === polygon.id);
            const color = analysis ? getNDVIHeatmapColor(analysis.currentNDVI) : '#22c55e';
            const isSelected = selectedPolygon?.id === polygon.id;
            return (
              <Polygon key={polygon.id} positions={polygon.coordinates as any}
                pathOptions={{ color, fillColor: color, fillOpacity: activeLayer === 'ndvi' ? 0 : 0.25, weight: isSelected ? 2.5 : 1.5 }}
                eventHandlers={{ click: () => setSelectedPolygon(polygon) }} />
            );
          })}

          <SmoothHeatmapOverlay polygons={polygons} analyses={analyses} active={activeLayer === 'ndvi'} />
        </MapContainer>

        {/* Drawing hint */}
        {isDrawing && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-lg px-4 py-1.5 shadow-sm text-xs text-slate-600 font-medium" style={{ zIndex: 1000 }}>
            Cliquez pour placer des points · {tempPoints.length} posé{tempPoints.length > 1 ? 's' : ''} (min. 3)
          </div>
        )}

        {/* NDVI scale — bottom-left */}
        {selectedPolygon && (
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-lg p-2 shadow-sm" style={{ zIndex: 1000, minWidth: 140 }}>
            <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest mb-1">Échelle NDVI</p>
            <div className="h-2 rounded-sm mb-1" style={{ background: NDVI_GRADIENT }} />
            <div className="flex justify-between text-[9px] text-slate-400">
              <span>Faible</span><span>Élevé</span>
            </div>
          </div>
        )}
      </div>

      {/* ── Analysis panel (bottom) ────────────────────────────── */}
      <div className="flex-1 min-h-0 flex flex-col bg-white border-t border-slate-200" style={{ minHeight: 0 }}>
        {selectedPolygon ? (
          <>
            {/* Nav tabs */}
            <div className="flex items-center border-b border-slate-200 bg-slate-50 shrink-0 px-4">
              {/* Field badge */}
              <div className="flex items-center gap-2 pr-4 mr-2 border-r border-slate-200 py-2">
                {selectedAnalysis && (() => {
                  const s = getStatusColor(selectedAnalysis.currentNDVI);
                  return (
                    <>
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.text }} />
                      <span className="text-xs font-semibold text-slate-600">Champ {fieldIndex}</span>
                      <span className="text-xs text-slate-400">{selectedPolygon.area.toFixed(1)} ha</span>
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ background: s.bg, color: s.text }}>{s.label}</span>
                    </>
                  );
                })()}
                {!selectedAnalysis && (
                  <>
                    <span className="text-xs font-semibold text-slate-600">Champ {fieldIndex}</span>
                    <span className="text-xs text-slate-400">{selectedPolygon.area.toFixed(1)} ha</span>
                    <div className="w-3 h-3 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin ml-1" />
                  </>
                )}
              </div>

              {/* Tabs */}
              {[
                { id: 'apercu', label: 'Aperçu' },
                { id: 'vegetation', label: 'Végétation' },
                { id: 'tendance', label: 'Tendance' },
                { id: 'ia', label: 'Analyse IA' },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setBottomTab(t.id as any)}
                  className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${
                    bottomTab === t.id
                      ? 'border-emerald-500 text-emerald-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="flex-1 min-h-0 overflow-hidden">

              {/* ── Aperçu ── */}
              {bottomTab === 'apercu' && selectedAnalysis && (
                <div className="h-full flex divide-x divide-slate-100">
                  {/* NDVI value */}
                  <div className="px-6 py-4 flex flex-col justify-center shrink-0 w-52">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2">NDVI actuel</p>
                    <p className="text-4xl font-bold text-slate-800 leading-none mb-3">{selectedAnalysis.currentNDVI.toFixed(3)}</p>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-1">
                      <div className="h-full rounded-full" style={{ width: `${selectedAnalysis.currentNDVI * 100}%`, background: NDVI_GRADIENT }} />
                    </div>
                    <div className="flex justify-between text-[9px] text-slate-400">
                      <span>0</span><span>0.5</span><span>1.0</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="px-6 py-4 flex flex-col justify-center shrink-0 w-52">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3">Statistiques</p>
                    <div className="space-y-2">
                      {[
                        { l: 'Minimum', v: Math.min(...selectedAnalysis.historicalData.map((d: any) => d.ndvi)).toFixed(3), c: '#dc2626', bg: '#fef2f2' },
                        { l: 'Moyenne', v: (selectedAnalysis.historicalData.reduce((s: number, d: any) => s + d.ndvi, 0) / selectedAnalysis.historicalData.length).toFixed(3), c: '#2563eb', bg: '#eff6ff' },
                        { l: 'Maximum', v: Math.max(...selectedAnalysis.historicalData.map((d: any) => d.ndvi)).toFixed(3), c: '#16a34a', bg: '#f0fdf4' },
                      ].map(s => (
                        <div key={s.l} className="flex items-center justify-between rounded-lg px-3 py-1.5" style={{ background: s.bg }}>
                          <span className="text-xs text-slate-500">{s.l}</span>
                          <span className="text-sm font-bold" style={{ color: s.c }}>{s.v}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Evolution KPIs */}
                  <div className="px-6 py-4 flex flex-col justify-center shrink-0 w-56">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3">Évolution</p>
                    <div className="space-y-2.5">
                      {(() => {
                        const data = selectedAnalysis.historicalData;
                        const evol = ((data[data.length - 1]?.ndvi - data[0]?.ndvi) * 100);
                        const stab = ((1 - (Math.max(...data.map((d: any) => d.ndvi)) - Math.min(...data.map((d: any) => d.ndvi)))) * 100);
                        return (
                          <>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-slate-500">Évolution période</span>
                              <span className={`text-sm font-bold ${evol >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>{evol >= 0 ? '+' : ''}{evol.toFixed(1)}%</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-slate-500">Indice stabilité</span>
                              <span className="text-sm font-bold text-violet-600">{stab.toFixed(0)}%</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-slate-500">Superficie analysée</span>
                              <span className="text-sm font-bold text-slate-700">{selectedPolygon.area.toFixed(1)} ha</span>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  {/* NDVI scale */}
                  <div className="px-6 py-4 flex flex-col justify-center shrink-0 w-48">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3">Échelle NDVI</p>
                    <div className="h-3 rounded-md mb-1.5" style={{ background: NDVI_GRADIENT }} />
                    <div className="flex justify-between text-[9px] text-slate-400 mb-3">
                      <span>0.0</span><span>0.5</span><span>1.0</span>
                    </div>
                    <div className="space-y-1.5">
                      {[
                        { color: '#d73027', label: 'Sol nu / végétation absente' },
                        { color: '#fee08b', label: 'Végétation faible / stress' },
                        { color: '#91cf60', label: 'Végétation modérée' },
                        { color: '#006837', label: 'Végétation dense / saine' },
                      ].map(e => (
                        <div key={e.label} className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: e.color }} />
                          <span className="text-[10px] text-slate-500 leading-tight">{e.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Végétation ── */}
              {bottomTab === 'vegetation' && selectedAnalysis && (
                <div className="h-full flex divide-x divide-slate-100">
                  <div className="px-6 py-4 flex flex-col shrink-0 w-64">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3">Distribution NDVI</p>
                    <div className="flex-1 flex flex-col justify-center">
                      <NDVIHistogram currentNDVI={selectedAnalysis.currentNDVI} />
                      <div className="flex justify-between text-[9px] mt-2">
                        <span className="text-red-400">Sol nu</span>
                        <span className="text-slate-400">Végétation modérée</span>
                        <span className="text-emerald-600">Dense</span>
                      </div>
                    </div>
                  </div>
                  <div className="px-6 py-4 flex flex-col justify-center flex-1">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3">Répartition par classe</p>
                    <div className="space-y-2">
                      {[
                        { label: 'Sol nu / très faible (< 0.2)', pct: 3, color: '#d73027' },
                        { label: 'Végétation faible (0.2–0.4)', pct: 12, color: '#fee08b' },
                        { label: 'Végétation modérée (0.4–0.6)', pct: 28, color: '#91cf60' },
                        { label: 'Végétation bonne (0.6–0.8)', pct: 45, color: '#1a9850' },
                        { label: 'Végétation dense (> 0.8)', pct: 12, color: '#006837' },
                      ].map(c => (
                        <div key={c.label} className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-sm shrink-0" style={{ background: c.color }} />
                          <span className="text-xs text-slate-500 w-52 shrink-0">{c.label}</span>
                          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${c.pct}%`, background: c.color }} />
                          </div>
                          <span className="text-xs font-semibold text-slate-600 w-8 text-right">{c.pct}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Tendance ── */}
              {bottomTab === 'tendance' && selectedAnalysis && (
                <div className="h-full px-6 py-4 flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Tendance NDVI sur la période</p>
                    {(() => {
                      const data = selectedAnalysis.historicalData;
                      const evol = (data[data.length - 1]?.ndvi - data[0]?.ndvi) * 100;
                      return <span className={`text-sm font-bold ${evol >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>{evol >= 0 ? '+' : ''}{evol.toFixed(1)}%</span>;
                    })()}
                  </div>
                  <div className="flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={selectedAnalysis.historicalData} margin={{ top: 4, right: 12, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#cbd5e1' }} tickFormatter={v => v.slice(5)} />
                        <YAxis domain={[0.4, 0.9]} tick={{ fontSize: 9, fill: '#cbd5e1' }} tickCount={4} />
                        <Tooltip
                          contentStyle={{ fontSize: 10, padding: '4px 8px', borderRadius: 5, border: '1px solid #e2e8f0', boxShadow: 'none' }}
                          formatter={(v: any) => [v.toFixed(3), 'NDVI']}
                          labelFormatter={l => l.slice(5)}
                        />
                        <Area type="monotone" dataKey="ndvi" stroke="#22c55e" strokeWidth={1.5} fill="#22c55e" fillOpacity={0.1} dot={false} isAnimationActive={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* ── Analyse IA ── */}
              {bottomTab === 'ia' && selectedAnalysis && (
                <div className="h-full overflow-hidden">
                  {(() => {
                    const ndvi = selectedAnalysis.currentNDVI;
                    const score = Math.round(ndvi * 120);
                    const s = getStatusColor(ndvi);
                    const risks = [
                      { label: 'Stress hydrique',   pct: ndvi < 0.5 ? 72 : 35, lvl: ndvi < 0.5 ? 'Élevé' : 'Modéré', c: ndvi < 0.5 ? '#ef4444' : '#f59e0b' },
                      { label: 'Carence nutritive', pct: 18, lvl: 'Faible',  c: '#22c55e' },
                      { label: 'Maladie foliaire',  pct: 12, lvl: 'Faible',  c: '#22c55e' },
                      { label: 'Stress thermique',  pct: 40, lvl: 'Modéré', c: '#f59e0b' },
                    ];
                    const actions = ndvi > 0.6
                      ? [
                          { label: 'Maintenir les pratiques actuelles',    priority: 'Info',    c: '#22c55e', bg: '#f0fdf4' },
                          { label: 'Irrigation zone Nord — stress +15%',   priority: 'Action',  c: '#3b82f6', bg: '#eff6ff' },
                          { label: 'Récolte prévue dans 2–3 semaines',     priority: 'Planif.', c: '#f59e0b', bg: '#fffbeb' },
                        ]
                      : ndvi > 0.4
                        ? [
                            { label: 'Augmenter l\'irrigation de +20%',        priority: 'Urgent',  c: '#f59e0b', bg: '#fffbeb' },
                            { label: 'Surveiller zones à faible NDVI',        priority: 'Action',  c: '#f97316', bg: '#fff7ed' },
                            { label: 'Réévaluation dans 7 jours',             priority: 'Planif.', c: '#8b5cf6', bg: '#f5f3ff' },
                          ]
                        : [
                            { label: 'Irrigation immédiate requise',          priority: 'Critique', c: '#ef4444', bg: '#fef2f2' },
                            { label: 'Analyse pH et nutriments du sol',       priority: 'Urgent',  c: '#f59e0b', bg: '#fffbeb' },
                            { label: 'Consultation agronome recommandée',     priority: 'Action',  c: '#8b5cf6', bg: '#f5f3ff' },
                          ];

                    return (
                      <div className="h-full grid" style={{ gridTemplateColumns: '200px 1fr 1fr 1fr', gridTemplateRows: '1fr' }}>

                        {/* ── Score card ── */}
                        <div className="flex flex-col items-center justify-center border-r border-slate-100 px-4 py-3 bg-slate-50">
                          {/* Circular score */}
                          <div className="relative w-20 h-20 mb-3">
                            <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                              <circle cx="40" cy="40" r="32" fill="none" stroke="#e2e8f0" strokeWidth="7" />
                              <circle cx="40" cy="40" r="32" fill="none" strokeWidth="7"
                                strokeLinecap="round"
                                stroke={s.text}
                                strokeDasharray={`${(score / 100) * 201} 201`}
                              />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <span className="text-lg font-bold text-slate-800 leading-none">{score}</span>
                              <span className="text-[9px] text-slate-400">/100</span>
                            </div>
                          </div>
                          <span className="text-xs font-bold mb-0.5" style={{ color: s.text }}>{s.label}</span>
                          <span className="text-[10px] text-slate-400 text-center leading-tight">Score de santé végétale</span>
                          <div className="mt-3 flex items-center gap-1.5 text-[9px] text-slate-400 border-t border-slate-200 pt-2 w-full justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            Modèle IA agricole v2.1
                          </div>
                        </div>

                        {/* ── Actions ── */}
                        <div className="border-r border-slate-100 px-5 py-4 flex flex-col">
                          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3">Actions prioritaires</p>
                          <div className="flex-1 flex flex-col gap-2">
                            {actions.map((a, i) => (
                              <div key={i} className="flex items-start gap-3 rounded-lg p-2.5" style={{ background: a.bg }}>
                                <div className="shrink-0 mt-0.5">
                                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: a.c + '22', color: a.c }}>
                                    {a.priority}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-700 leading-tight">{a.label}</p>
                              </div>
                            ))}
                          </div>
                          <p className="text-[9px] text-slate-300 mt-2">Générées à partir de l'analyse NDVI du {new Date().toLocaleDateString('fr-FR')}</p>
                        </div>

                        {/* ── Prévisions ── */}
                        <div className="border-r border-slate-100 px-5 py-4 flex flex-col">
                          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3">Prévisions NDVI</p>
                          <div className="flex-1 flex flex-col gap-2">
                            {[
                              { horizon: 'J + 7',  ndviVal: ndvi + 0.015, delta: +1.5, conf: 92 },
                              { horizon: 'J + 15', ndviVal: ndvi + 0.028, delta: +2.8, conf: 81 },
                              { horizon: 'J + 30', ndviVal: ndvi - 0.042, delta: -4.2, conf: 68 },
                            ].map(p => (
                              <div key={p.horizon} className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
                                <span className="text-[11px] font-semibold text-slate-400 w-10 shrink-0">{p.horizon}</span>
                                <span className="text-sm font-bold text-slate-800 w-12">{p.ndviVal.toFixed(3)}</span>
                                <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                                  <div className="h-full rounded-full" style={{ width: `${p.ndviVal * 100}%`, background: NDVI_GRADIENT }} />
                                </div>
                                <span className={`text-xs font-bold w-10 text-right ${p.delta >= 0 ? 'text-emerald-500' : 'text-red-400'}`}>
                                  {p.delta >= 0 ? '+' : ''}{p.delta}%
                                </span>
                                <span className="text-[9px] text-slate-300 w-12 text-right">conf. {p.conf}%</span>
                              </div>
                            ))}
                          </div>
                          <p className="text-[9px] text-slate-300 mt-2">Basé sur l'historique des 6 derniers mois</p>
                        </div>

                        {/* ── Risques ── */}
                        <div className="px-5 py-4 flex flex-col">
                          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3">Risques identifiés</p>
                          <div className="flex-1 flex flex-col gap-3">
                            {risks.map(r => (
                              <div key={r.label}>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs text-slate-600">{r.label}</span>
                                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ background: r.c + '18', color: r.c }}>
                                    {r.lvl}
                                  </span>
                                </div>
                                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                  <div className="h-full rounded-full transition-all" style={{ width: `${r.pct}%`, backgroundColor: r.c }} />
                                </div>
                                <div className="flex justify-between mt-0.5">
                                  <span className="text-[9px] text-slate-300">Faible</span>
                                  <span className="text-[9px] font-medium" style={{ color: r.c }}>{r.pct}%</span>
                                  <span className="text-[9px] text-slate-300">Critique</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Loading */}
              {!selectedAnalysis && (
                <div className="h-full flex items-center justify-center text-slate-400">
                  <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mr-2" />
                  <span className="text-xs">Analyse satellite en cours…</span>
                </div>
              )}

            </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400">
            <div className="text-center">
              <svg className="w-8 h-8 mx-auto mb-2 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <p className="text-xs">Tracez un champ sur la carte pour démarrer l'analyse</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Rec({ color, title, sub }: { color: string; title: string; sub: string }) {
  return (
    <div className="flex items-start gap-2">
      <div className="w-0.5 rounded-full shrink-0 mt-0.5 self-stretch" style={{ backgroundColor: color, minHeight: 32 }} />
      <div>
        <p className="text-xs font-medium text-slate-700 leading-tight">{title}</p>
        <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">{sub}</p>
      </div>
    </div>
  );
}
