import { useState } from 'react'
import { Plus, Trash2, Wifi, Edit2, Save, X, Users, CheckCircle2 } from 'lucide-react'

interface Capteur {
  id: string
  name: string
  type: 'temperature' | 'humidity' | 'light' | 'soil' | 'wind' | 'rain' | 'custom'
  description: string
  unit: string
  status: 'available' | 'assigned'
  assignedTo?: string
  clientName?: string
}

const initialCapteurs: Capteur[] = [
  { id: 'TEMP-001', name: 'Capteur Température', type: 'temperature', description: 'Mesure la température ambiante', unit: '°C', status: 'assigned', assignedTo: 'client-1', clientName: 'Jean' },
  { id: 'HUM-001', name: 'Capteur Humidité', type: 'humidity', description: 'Mesure l\'humidité de l\'air', unit: '%', status: 'assigned', assignedTo: 'client-2', clientName: 'Marie' },
  { id: 'LIGHT-001', name: 'Capteur Luminosité', type: 'light', description: 'Mesure l\'intensité lumineuse', unit: 'lux', status: 'available' },
]

const clients = [
  { id: 'client-1', name: 'Jean Dupont', email: 'jean@gmail.com' },
  { id: 'client-2', name: 'Marie Martin', email: 'marie@gmail.com' },
  { id: 'client-3', name: 'Pierre Bernard', email: 'pierre@gmail.com' },
]

const getSensorIcon = (type: string) => {
  switch (type) {
    case 'temperature':
      return '🌡️'
    case 'humidity':
      return '💧'
    case 'light':
      return '☀️'
    case 'soil':
      return '🌱'
    case 'wind':
      return '💨'
    case 'rain':
      return '🌧️'
    default:
      return '📡'
  }
}

export default function AdminCapteurs() {
  const [capteurs, setCapteurs] = useState<Capteur[]>(initialCapteurs)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingCapteur, setEditingCapteur] = useState<string | null>(null)
  const [newCapteur, setNewCapteur] = useState<Partial<Capteur>>({
    type: 'temperature',
    status: 'available'
  })

  const handleAddCapteur = () => {
    if (!newCapteur.name || !newCapteur.description) return
    
    const capteur: Capteur = {
      id: `CAP-${Date.now()}`,
      name: newCapteur.name,
      type: newCapteur.type as any,
      description: newCapteur.description,
      unit: newCapteur.unit || '-',
      status: 'available'
    }
    
    setCapteurs([...capteurs, capteur])
    setNewCapteur({ type: 'temperature', status: 'available' })
    setShowAddForm(false)
  }

  const handleDeleteCapteur = (id: string) => {
    setCapteurs(capteurs.filter(c => c.id !== id))
  }

  const handleAssignCapteur = (capteurId: string, clientId: string, clientName: string) => {
    setCapteurs(capteurs.map(c => 
      c.id === capteurId 
        ? { ...c, status: 'assigned', assignedTo: clientId, clientName }
        : c
    ))
  }

  const handleUnassignCapteur = (capteurId: string) => {
    setCapteurs(capteurs.map(c => 
      c.id === capteurId 
        ? { ...c, status: 'available', assignedTo: undefined, clientName: undefined }
        : c
    ))
  }

  const availableCapteurs = capteurs.filter(c => c.status === 'available')
  const assignedCapteurs = capteurs.filter(c => c.status === 'assigned')

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Capteurs IoT</h1>
          <p className="text-gray-500 mt-1">Ajoutez et assignez des capteurs à vos clients.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-xl font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Ajouter un Capteur
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Wifi className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Capteurs</p>
              <p className="text-2xl font-bold text-gray-900">{capteurs.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Disponibles</p>
              <p className="text-2xl font-bold text-gray-900">{availableCapteurs.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Assignés</p>
              <p className="text-2xl font-bold text-gray-900">{assignedCapteurs.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Nouveau Capteur</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nom du capteur</label>
              <input
                type="text"
                placeholder="Ex: Capteur Température Serre 1"
                value={newCapteur.name || ''}
                onChange={(e) => setNewCapteur({...newCapteur, name: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={newCapteur.type}
                onChange={(e) => setNewCapteur({...newCapteur, type: e.target.value as any})}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500"
              >
                <option value="temperature">Température</option>
                <option value="humidity">Humidité</option>
                <option value="light">Luminosité</option>
                <option value="soil">Humidité Sol</option>
                <option value="wind">Vent</option>
                <option value="rain">Pluie</option>
                <option value="custom">Personnalisé</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Unité</label>
              <input
                type="text"
                placeholder="Ex: °C, %, lux"
                value={newCapteur.unit || ''}
                onChange={(e) => setNewCapteur({...newCapteur, unit: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <input
                type="text"
                placeholder="Description du capteur"
                value={newCapteur.description || ''}
                onChange={(e) => setNewCapteur({...newCapteur, description: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            <button 
              onClick={handleAddCapteur}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl font-medium"
            >
              <Save className="w-4 h-4" />
              Enregistrer
            </button>
            <button 
              onClick={() => setShowAddForm(false)}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl font-medium"
            >
              <X className="w-4 h-4" />
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Available Capteurs */}
      <div className="bg-white rounded-2xl border border-gray-100 mb-8">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            Capteurs Disponibles
            <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">{availableCapteurs.length}</span>
          </h3>
        </div>
        <div className="divide-y divide-gray-100">
          {availableCapteurs.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Aucun capteur disponible. Ajoutez-en un nouveau !
            </div>
          ) : (
            availableCapteurs.map((capteur) => (
              <div key={capteur.id} className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">
                    {getSensorIcon(capteur.type)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{capteur.name}</h4>
                    <p className="text-sm text-gray-500">{capteur.description}</p>
                    <p className="text-xs text-gray-400">ID: {capteur.id} • Unité: {capteur.unit}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    onChange={(e) => {
                      const client = clients.find(c => c.id === e.target.value)
                      if (client) handleAssignCapteur(capteur.id, client.id, client.name)
                    }}
                    className="px-3 py-2 border border-gray-200 rounded-xl text-sm"
                    defaultValue=""
                  >
                    <option value="" disabled>Assigner à...</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>{client.name}</option>
                    ))}
                  </select>
                  <button 
                    onClick={() => handleDeleteCapteur(capteur.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Assigned Capteurs */}
      <div className="bg-white rounded-2xl border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            Capteurs Assignés
            <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">{assignedCapteurs.length}</span>
          </h3>
        </div>
        <div className="divide-y divide-gray-100">
          {assignedCapteurs.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Aucun capteur assigné pour le moment.
            </div>
          ) : (
            assignedCapteurs.map((capteur) => (
              <div key={capteur.id} className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">
                    {getSensorIcon(capteur.type)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{capteur.name}</h4>
                    <p className="text-sm text-gray-500">{capteur.description}</p>
                    <p className="text-xs text-gray-400">ID: {capteur.id} • Unité: {capteur.unit}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                    {capteur.clientName}
                  </div>
                  <button 
                    onClick={() => handleUnassignCapteur(capteur.id)}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Libérer
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
