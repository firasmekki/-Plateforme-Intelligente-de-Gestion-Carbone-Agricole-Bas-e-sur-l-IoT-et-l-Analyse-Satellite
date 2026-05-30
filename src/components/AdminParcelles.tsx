import { useState, useEffect } from 'react'
import { MapPin, Users, Leaf, Droplets, Filter } from 'lucide-react'

interface Parcelle {
  id: string
  name: string
  clientName: string
  clientEmail: string
  culture: string
  surface: number
  carbonEmission: number
  waterConsumption: number
  coordinates: { x: number; y: number; width: number; height: number }
  color: string
}

// Données fallback si aucune parcelle dans localStorage
const fallbackParcelles: Parcelle[] = [
  {
    id: 'P1',
    name: 'Champ Blé - Nord',
    clientName: 'Jean Dupont',
    clientEmail: 'jean@gmail.com',
    culture: 'Blé',
    surface: 12.5,
    carbonEmission: 450,
    waterConsumption: 320,
    coordinates: { x: 10, y: 10, width: 35, height: 25 },
    color: '#22c55e'
  },
  {
    id: 'P2',
    name: 'Champ Maïs - Est',
    clientName: 'Jean Dupont',
    clientEmail: 'jean@gmail.com',
    culture: 'Maïs',
    surface: 18.2,
    carbonEmission: 820,
    waterConsumption: 680,
    coordinates: { x: 55, y: 10, width: 35, height: 35 },
    color: '#ef4444'
  },
  {
    id: 'P3',
    name: 'Serres Légumes',
    clientName: 'Marie Martin',
    clientEmail: 'marie@gmail.com',
    culture: 'Tomates/Courgettes',
    surface: 3.8,
    carbonEmission: 280,
    waterConsumption: 420,
    coordinates: { x: 10, y: 42, width: 20, height: 20 },
    color: '#f97316'
  },
  {
    id: 'P4',
    name: 'Vergers - Ouest',
    clientName: 'Marie Martin',
    clientEmail: 'marie@gmail.com',
    culture: 'Pommiers',
    surface: 8.5,
    carbonEmission: 180,
    waterConsumption: 180,
    coordinates: { x: 35, y: 42, width: 25, height: 25 },
    color: '#22c55e'
  },
  {
    id: 'P5',
    name: 'Parcelles Légumes',
    clientName: 'Pierre Bernard',
    clientEmail: 'pierre@gmail.com',
    culture: 'Salades/Carottes',
    surface: 6.2,
    carbonEmission: 240,
    waterConsumption: 290,
    coordinates: { x: 65, y: 52, width: 25, height: 20 },
    color: '#eab308'
  },
  {
    id: 'P6',
    name: 'Pâturages - Sud',
    clientName: 'Pierre Bernard',
    clientEmail: 'pierre@gmail.com',
    culture: 'Prairie',
    surface: 15.0,
    carbonEmission: 120,
    waterConsumption: 80,
    coordinates: { x: 10, y: 68, width: 40, height: 25 },
    color: '#22c55e'
  }
]

const clients = [
  { name: 'Jean Dupont', email: 'jean@gmail.com', parcelles: 2 },
  { name: 'Marie Martin', email: 'marie@gmail.com', parcelles: 2 },
  { name: 'Pierre Bernard', email: 'pierre@gmail.com', parcelles: 2 },
]

export default function AdminParcelles() {
  const [parcelles, setParcelles] = useState<Parcelle[]>([])
  const [selectedClient, setSelectedClient] = useState<string>('all')

  // Récupérer les parcelles du localStorage au chargement
  useEffect(() => {
    const saved = localStorage.getItem('client_parcelles')
    if (saved) {
      const clientParcelles = JSON.parse(saved)
      // Ajouter les infos client aux parcelles
      const parcellesWithClient = clientParcelles.map((p: any) => ({
        ...p,
        clientName: 'Jean Dupont', // Récupérer du localStorage user si dispo
        clientEmail: 'jean@gmail.com'
      }))
      setParcelles(parcellesWithClient)
    } else {
      setParcelles(fallbackParcelles)
    }
  }, [])

  const filteredParcelles = selectedClient === 'all' 
    ? parcelles 
    : parcelles.filter(p => p.clientEmail === selectedClient)

  const totalClients = clients.length
  const totalParcelles = parcelles.length
  const totalSurface = parcelles.reduce((sum, p) => sum + p.surface, 0)
  const totalCarbon = parcelles.reduce((sum, p) => sum + p.carbonEmission, 0)

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Toutes les Parcelles</h1>
          <p className="text-gray-500 mt-1">Vue d'ensemble de toutes les parcelles des clients.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Filter className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500"
            >
              <option value="all">Tous les clients</option>
              {clients.map(client => (
                <option key={client.email} value={client.email}>
                  {client.name} ({client.parcelles} parcelles)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stats globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Nombre de clients</p>
              <p className="text-2xl font-bold text-gray-900">{totalClients}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <MapPin className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total parcelles</p>
              <p className="text-2xl font-bold text-gray-900">{totalParcelles}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Leaf className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Surface totale</p>
              <p className="text-2xl font-bold text-gray-900">{totalSurface.toFixed(1)} ha</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <Leaf className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Émissions totales</p>
              <p className="text-2xl font-bold text-gray-900">{totalCarbon} kg</p>
            </div>
          </div>
        </div>
      </div>

      {/* Carte de toutes les parcelles */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Vue d'ensemble des parcelles 
          {selectedClient !== 'all' && (
            <span className="text-sm font-normal text-gray-500 ml-2">
              (Client: {clients.find(c => c.email === selectedClient)?.name})
            </span>
          )}
        </h3>
        
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
              <g key={parcelle.id}>
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
                  y={parcelle.coordinates.y + parcelle.coordinates.height / 2 - 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize="3"
                  fontWeight="bold"
                >
                  {parcelle.id}
                </text>
                <text
                  x={parcelle.coordinates.x + parcelle.coordinates.width / 2}
                  y={parcelle.coordinates.y + parcelle.coordinates.height / 2 + 3}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize="2.5"
                >
                  {parcelle.clientName.split(' ')[0]}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Légende */}
        <div className="flex flex-wrap gap-4 mt-4">
          {clients.map((client, index) => (
            <div key={client.email} className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded"
                style={{ backgroundColor: ['#22c55e', '#ef4444', '#f97316', '#eab308'][index % 4] }}
              />
              <span className="text-sm text-gray-600">{client.name} ({client.parcelles})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Liste des parcelles par client */}
      <div className="bg-white rounded-2xl border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Détail des parcelles</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {filteredParcelles.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Aucune parcelle trouvée.
            </div>
          ) : (
            filteredParcelles.map((parcelle) => (
              <div key={parcelle.id} className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: parcelle.color + '20' }}
                  >
                    <MapPin className="w-6 h-6" style={{ color: parcelle.color }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900">{parcelle.name}</h4>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                        {parcelle.id}
                      </span>
                    </div>
                    <p className="text-sm text-blue-600 font-medium">{parcelle.clientName}</p>
                    <p className="text-sm text-gray-500">{parcelle.culture} • {parcelle.surface} hectares</p>
                    <div className="flex items-center gap-4 mt-1 text-xs">
                      <span className="text-red-600 flex items-center gap-1">
                        <Leaf className="w-3 h-3" />
                        {parcelle.carbonEmission} kg CO₂
                      </span>
                      <span className="text-blue-600 flex items-center gap-1">
                        <Droplets className="w-3 h-3" />
                        {parcelle.waterConsumption} m³
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
