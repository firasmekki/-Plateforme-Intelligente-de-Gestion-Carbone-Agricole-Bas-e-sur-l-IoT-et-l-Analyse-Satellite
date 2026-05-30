import { useState, useEffect } from 'react'
import { 
  Wifi, 
  Signal, 
  Thermometer, 
  Droplets, 
  Sun, 
  Wind, 
  Battery, 
  AlertTriangle,
  CheckCircle2,
  Activity,
  Settings,
  Plus,
  Trash2
} from 'lucide-react'

interface Sensor {
  id: string
  name: string
  type: 'temperature' | 'humidity' | 'soil' | 'light' | 'wind' | 'rain'
  location: string
  status: 'online' | 'offline' | 'warning'
  battery: number
  lastReading: number
  unit: string
  updatedAt: string
}

const mockSensors: Sensor[] = [
  {
    id: 'TEMP-001',
    name: 'Capteur Temp - Parcelle 1',
    type: 'temperature',
    location: 'Champ Blé Nord',
    status: 'online',
    battery: 85,
    lastReading: 22.5,
    unit: '°C',
    updatedAt: 'Il y a 2 min'
  },
  {
    id: 'HUM-002',
    name: 'Capteur Humidité - Serres',
    type: 'humidity',
    location: 'Serres Légumes',
    status: 'online',
    battery: 72,
    lastReading: 68,
    unit: '%',
    updatedAt: 'Il y a 1 min'
  },
  {
    id: 'SOIL-003',
    name: 'Capteur Sol - Maïs',
    type: 'soil',
    location: 'Champ Maïs Est',
    status: 'warning',
    battery: 15,
    lastReading: 42,
    unit: '%',
    updatedAt: 'Il y a 5 min'
  },
  {
    id: 'LIGHT-004',
    name: 'Capteur Luminosité',
    type: 'light',
    location: 'Vergers Ouest',
    status: 'online',
    battery: 90,
    lastReading: 850,
    unit: 'lux',
    updatedAt: 'Il y a 3 min'
  },
  {
    id: 'WIND-005',
    name: 'Anémomètre',
    type: 'wind',
    location: 'Station Centrale',
    status: 'online',
    battery: 78,
    lastReading: 12.5,
    unit: 'km/h',
    updatedAt: 'Il y a 1 min'
  },
  {
    id: 'RAIN-006',
    name: 'Pluviomètre',
    type: 'rain',
    location: 'Station Centrale',
    status: 'offline',
    battery: 5,
    lastReading: 0,
    unit: 'mm',
    updatedAt: 'Hier'
  }
]

const getSensorIcon = (type: string) => {
  switch (type) {
    case 'temperature':
      return <Thermometer className="w-5 h-5" />
    case 'humidity':
      return <Droplets className="w-5 h-5" />
    case 'soil':
      return <Activity className="w-5 h-5" />
    case 'light':
      return <Sun className="w-5 h-5" />
    case 'wind':
      return <Wind className="w-5 h-5" />
    case 'rain':
      return <Droplets className="w-5 h-5" />
    default:
      return <Activity className="w-5 h-5" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'online':
      return 'bg-green-100 text-green-700'
    case 'warning':
      return 'bg-yellow-100 text-yellow-700'
    case 'offline':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'online':
      return <CheckCircle2 className="w-4 h-4 text-green-500" />
    case 'warning':
      return <AlertTriangle className="w-4 h-4 text-yellow-500" />
    case 'offline':
      return <AlertTriangle className="w-4 h-4 text-red-500" />
    default:
      return <Signal className="w-4 h-4 text-gray-500" />
  }
}

export default function CapteursIoT() {
  const [sensors, setSensors] = useState<Sensor[]>(mockSensors)
  const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null)
  const [isConnected, setIsConnected] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  // Simulate MQTT connection status
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date())
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const onlineCount = sensors.filter(s => s.status === 'online').length
  const warningCount = sensors.filter(s => s.status === 'warning').length
  const offlineCount = sensors.filter(s => s.status === 'offline').length

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Capteurs IoT</h1>
          <p className="text-gray-500 mt-1">Surveillance des capteurs en temps réel via MQTT.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            <Wifi className="w-4 h-4" />
            <span className="text-sm font-medium">
              {isConnected ? 'MQTT Connecté' : 'Déconnecté'}
            </span>
          </div>
          <button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-xl font-medium transition-colors">
            <Plus className="w-4 h-4" />
            Ajouter
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Capteurs en ligne</span>
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{onlineCount}</p>
          <p className="text-xs text-gray-400 mt-1">/ {sensors.length} total</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Alertes</span>
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{warningCount}</p>
          <p className="text-xs text-gray-400 mt-1">Batterie faible</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Hors ligne</span>
            <Signal className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{offlineCount}</p>
          <p className="text-xs text-gray-400 mt-1">Nécessite attention</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Dernière mise à jour</span>
            <Activity className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-lg font-bold text-gray-900">
            {lastUpdate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </p>
          <p className="text-xs text-gray-400 mt-1">Auto-refresh 30s</p>
        </div>
      </div>

      {/* Sensors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sensors.map((sensor) => (
          <div 
            key={sensor.id}
            onClick={() => setSelectedSensor(sensor)}
            className={`bg-white rounded-2xl p-6 border cursor-pointer transition-all hover:shadow-lg ${
              selectedSensor?.id === sensor.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-100'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  sensor.type === 'temperature' ? 'bg-orange-100 text-orange-600' :
                  sensor.type === 'humidity' ? 'bg-blue-100 text-blue-600' :
                  sensor.type === 'soil' ? 'bg-green-100 text-green-600' :
                  sensor.type === 'light' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {getSensorIcon(sensor.type)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{sensor.name}</h3>
                  <p className="text-sm text-gray-500">{sensor.location}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(sensor.status)}`}>
                {sensor.status}
              </span>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-gray-900">{sensor.lastReading}</span>
                <span className="text-lg text-gray-500">{sensor.unit}</span>
              </div>
              <div className="flex items-center gap-1">
                {getStatusIcon(sensor.status)}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <Battery className={`w-4 h-4 ${sensor.battery < 20 ? 'text-red-500' : 'text-green-500'}`} />
                <span className={`text-sm ${sensor.battery < 20 ? 'text-red-600' : 'text-gray-600'}`}>
                  {sensor.battery}%
                </span>
              </div>
              <span className="text-xs text-gray-400">{sensor.updatedAt}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Configuration Panel */}
      {selectedSensor && (
        <div className="mt-8 bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Configuration - {selectedSensor.name}</h3>
            <button 
              onClick={() => setSelectedSensor(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ID du capteur</label>
              <input 
                type="text" 
                value={selectedSensor.id}
                disabled
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
              <input 
                type="text" 
                value={selectedSensor.name}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Localisation</label>
              <input 
                type="text" 
                value={selectedSensor.location}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select 
                value={selectedSensor.type}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="temperature">Température</option>
                <option value="humidity">Humidité</option>
                <option value="soil">Humidité sol</option>
                <option value="light">Luminosité</option>
                <option value="wind">Vent</option>
                <option value="rain">Pluie</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 mt-6 pt-6 border-t border-gray-100">
            <button className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors">
              <Trash2 className="w-4 h-4" />
              Supprimer
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors">
              <Settings className="w-4 h-4" />
              Paramètres avancés
            </button>
            <button className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors">
              Enregistrer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
