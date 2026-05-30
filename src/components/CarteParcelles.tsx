import { useState } from 'react'
import { MapPin, Leaf, Droplets, Zap, Info, Filter, Layers } from 'lucide-react'

interface Parcelle {
  id: string
  name: string
  culture: string
  surface: number
  carbonEmission: number
  carbonLevel: 'low' | 'medium' | 'high'
  waterConsumption: number
  coordinates: { x: number; y: number; width: number; height: number }
  color: string
}

const parcelles: Parcelle[] = [
  {
    id: 'P1',
    name: 'Champ Blé - Nord',
    culture: 'Blé',
    surface: 12.5,
    carbonEmission: 450,
    carbonLevel: 'low',
    waterConsumption: 320,
    coordinates: { x: 10, y: 10, width: 35, height: 25 },
    color: '#22c55e'
  },
  {
    id: 'P2',
    name: 'Champ Maïs - Est',
    culture: 'Maïs',
    surface: 18.2,
    carbonEmission: 820,
    carbonLevel: 'high',
    waterConsumption: 680,
    coordinates: { x: 55, y: 10, width: 35, height: 35 },
    color: '#ef4444'
  },
  {
    id: 'P3',
    name: 'Serres Légumes',
    culture: 'Tomates/Courgettes',
    surface: 3.8,
    carbonEmission: 280,
    carbonLevel: 'medium',
    waterConsumption: 420,
    coordinates: { x: 10, y: 42, width: 20, height: 20 },
    color: '#f97316'
  },
  {
    id: 'P4',
    name: 'Vergers - Ouest',
    culture: 'Pommiers',
    surface: 8.5,
    carbonEmission: 180,
    carbonLevel: 'low',
    waterConsumption: 180,
    coordinates: { x: 35, y: 42, width: 25, height: 25 },
    color: '#22c55e'
  },
  {
    id: 'P5',
    name: 'Parcelles Légumes',
    culture: 'Salades/Carottes',
    surface: 6.2,
    carbonEmission: 240,
    carbonLevel: 'medium',
    waterConsumption: 290,
    coordinates: { x: 65, y: 52, width: 25, height: 20 },
    color: '#eab308'
  },
  {
    id: 'P6',
    name: 'Pâturages - Sud',
    culture: 'Prairie',
    surface: 15.0,
    carbonEmission: 120,
    carbonLevel: 'low',
    waterConsumption: 80,
    coordinates: { x: 10, y: 68, width: 40, height: 25 },
    color: '#22c55e'
  }
]

const legendItems = [
  { color: '#22c55e', label: 'Faible émission (< 300 kg CO₂e)', level: 'low' },
  { color: '#eab308', label: 'Moyenne (300-500 kg CO₂e)', level: 'medium' },
  { color: '#ef4444', label: 'Élevée (> 500 kg CO₂e)', level: 'high' }
]

export default function CarteParcelles() {
  const [selectedParcelle, setSelectedParcelle] = useState<Parcelle | null>(null)
  const [filter, setFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all')

  const filteredParcelles = filter === 'all' 
    ? parcelles 
    : parcelles.filter(p => p.carbonLevel === filter)

  const totalSurface = parcelles.reduce((sum, p) => sum + p.surface, 0)
  const totalCarbon = parcelles.reduce((sum, p) => sum + p.carbonEmission, 0)
  const totalWater = parcelles.reduce((sum, p) => sum + p.waterConsumption, 0)

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Carte des Parcelles</h1>
        <p className="text-gray-500 mt-1">Vue satellite des champs avec empreinte carbone par zone.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <MapPin className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Parcelles</p>
              <p className="text-2xl font-bold text-gray-900">{parcelles.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Layers className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Surface Totale</p>
              <p className="text-2xl font-bold text-gray-900">{totalSurface} ha</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <Leaf className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Émissions Totales</p>
              <p className="text-2xl font-bold text-gray-900">{totalCarbon} kg</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Droplets className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Eau Totale</p>
              <p className="text-2xl font-bold text-gray-900">{totalWater} m³</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Map */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Vue d'ensemble des parcelles</h3>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select 
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-1.5"
                >
                  <option value="all">Toutes les parcelles</option>
                  <option value="low">Faible émission</option>
                  <option value="medium">Moyenne émission</option>
                  <option value="high">Haute émission</option>
                </select>
              </div>
            </div>

            {/* SVG Map */}
            <div className="relative bg-green-50 rounded-xl overflow-hidden" style={{ paddingBottom: '60%' }}>
              <svg 
                viewBox="0 0 100 100" 
                className="absolute inset-0 w-full h-full"
                style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)' }}
              >
                {/* Grid lines */}
                {[...Array(10)].map((_, i) => (
                  <g key={i}>
                    <line x1={i * 10} y1="0" x2={i * 10} y2="100" stroke="#86efac" strokeWidth="0.2" />
                    <line x1="0" y1={i * 10} x2="100" y2={i * 10} stroke="#86efac" strokeWidth="0.2" />
                  </g>
                ))}

                {/* Parcelles */}
                {filteredParcelles.map((parcelle) => (
                  <g 
                    key={parcelle.id}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setSelectedParcelle(parcelle)}
                  >
                    <rect
                      x={parcelle.coordinates.x}
                      y={parcelle.coordinates.y}
                      width={parcelle.coordinates.width}
                      height={parcelle.coordinates.height}
                      fill={parcelle.color}
                      stroke="white"
                      strokeWidth="0.5"
                      rx="1"
                    />
                    <text
                      x={parcelle.coordinates.x + parcelle.coordinates.width / 2}
                      y={parcelle.coordinates.y + parcelle.coordinates.height / 2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      fontSize="3"
                      fontWeight="bold"
                    >
                      {parcelle.id}
                    </text>
                  </g>
                ))}

                {/* Legend */}
                <g transform="translate(2, 92)">
                  {legendItems.map((item, index) => (
                    <g key={item.level} transform={`translate(${index * 32}, 0)`}>
                      <rect width="3" height="3" fill={item.color} rx="0.5" />
                      <text x="4" y="2.5" fontSize="2" fill="#374151">{item.label}</text>
                    </g>
                  ))}
                </g>
              </svg>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {selectedParcelle ? (
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${selectedParcelle.color}20` }}
                >
                  <MapPin className="w-6 h-6" style={{ color: selectedParcelle.color }} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedParcelle.name}</h3>
                  <p className="text-sm text-gray-500">ID: {selectedParcelle.id}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Type de culture</span>
                  <span className="font-medium text-gray-900">{selectedParcelle.culture}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Surface</span>
                  <span className="font-medium text-gray-900">{selectedParcelle.surface} ha</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Leaf className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-gray-600">Émissions CO₂</span>
                  </div>
                  <span className="font-medium text-red-600">{selectedParcelle.carbonEmission} kg</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-600">Consommation eau</span>
                  </div>
                  <span className="font-medium text-blue-600">{selectedParcelle.waterConsumption} m³</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Intensité carbone</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedParcelle.carbonLevel === 'low' ? 'bg-green-100 text-green-700' :
                    selectedParcelle.carbonLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {selectedParcelle.carbonLevel === 'low' ? 'Faible' :
                     selectedParcelle.carbonLevel === 'medium' ? 'Moyenne' : 'Élevée'}
                  </span>
                </div>
              </div>

              <button 
                onClick={() => setSelectedParcelle(null)}
                className="w-full mt-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
              >
                Fermer
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Info className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Informations</h3>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Cliquez sur une parcelle pour voir les détails de son empreinte carbone, 
                sa consommation d'eau et ses informations agronomiques.
              </p>
            </div>
          )}

          {/* Quick Stats */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">Répartition des émissions</h3>
            <div className="space-y-3">
              {parcelles.map((p) => (
                <div key={p.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: p.color }}
                    />
                    <span className="text-sm text-gray-600">{p.id}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full"
                        style={{ 
                          backgroundColor: p.color,
                          width: `${(p.carbonEmission / totalCarbon) * 100}%`
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700 w-16 text-right">
                      {Math.round((p.carbonEmission / totalCarbon) * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
