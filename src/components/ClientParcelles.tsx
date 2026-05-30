import { useState, useEffect } from 'react'
import { Plus, MapPin, Trash2, Edit2, Save, X, Leaf, Droplets, Loader2 } from 'lucide-react'
import { api } from '../services/api'

interface Parcelle {
  id: string
  name: string
  culture: string
  surface: number
  carbonEmission: number
  waterConsumption: number
  coordinates: { x: number; y: number; width: number; height: number }
  color: string
}

const cultureOptions = [
  { value: 'ble', label: 'Blé', color: '#eab308' },
  { value: 'mais', label: 'Maïs', color: '#22c55e' },
  { value: 'orge', label: 'Orge', color: '#f97316' },
  { value: 'colza', label: 'Colza', color: '#8b5cf6' },
  { value: 'tournesol', label: 'Tournesol', color: '#fbbf24' },
  { value: 'tomate', label: 'Tomates', color: '#ef4444' },
  { value: 'pomme', label: 'Pommiers', color: '#22c55e' },
  { value: 'vigne', label: 'Vigne', color: '#7c3aed' },
  { value: 'prairie', label: 'Prairie', color: '#10b981' },
  { value: 'autre', label: 'Autre...', color: '#6b7280' },
]

export default function ClientParcelles() {
  const [parcelles, setParcelles] = useState<Parcelle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Charger les parcelles depuis l'API au chargement
  useEffect(() => {
    loadParcelles()
  }, [])

  const loadParcelles = async () => {
    try {
      setLoading(true)
      // Debug: vérifier le token
      const token = localStorage.getItem('token')
      console.log('🔑 Token in localStorage:', token ? 'Present' : 'Missing')
      console.log('📡 Fetching parcelles from API...')
      const response = await api.getMyParcelles()
      console.log('✅ Parcelles received:', response)
      setParcelles(response.parcelles || [])
    } catch (err: any) {
      console.error('❌ Error loading parcelles:', err)
      setError('Erreur: ' + (err.message || 'API indisponible'))
    } finally {
      setLoading(false)
    }
  }
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newParcelle, setNewParcelle] = useState<Partial<Parcelle>>({
    culture: 'ble',
    surface: 10,
  })
  const [customCulture, setCustomCulture] = useState('')

  const handleAddParcelle = async () => {
    if (!newParcelle.name || !newParcelle.surface) return
    
    try {
      // Gérer la culture personnalisée
      let cultureLabel: string
      let cultureColor: string
      
      if (newParcelle.culture === 'autre') {
        if (!customCulture.trim()) return // Ne pas ajouter si pas de culture personnalisée
        cultureLabel = customCulture
        cultureColor = '#6b7280' // Couleur grise pour autre
      } else {
        const culture = cultureOptions.find(c => c.value === newParcelle.culture)
        cultureLabel = culture?.label || 'Blé'
        cultureColor = culture?.color || '#22c55e'
      }
      
      const surface = newParcelle.surface || 10
      
      // Calculer l'empreinte carbone approximative basée sur la surface
      const baseEmission = newParcelle.culture === 'autre' ? 500 : {
        ble: 850, mais: 1200, orge: 720, colza: 980, tournesol: 750,
        tomate: 650, pomme: 320, vigne: 480, prairie: 120
      }[newParcelle.culture || 'ble'] || 500
      
      const waterConsumption = newParcelle.culture === 'autre' ? 400 : 
        (cultureOptions.find(c => c.value === newParcelle.culture)?.value === 'mais' ? 680 : 
         cultureOptions.find(c => c.value === newParcelle.culture)?.value === 'tomate' ? 420 : 320)
      
      const parcelle: Parcelle = {
        id: `P${Date.now()}`,
        name: newParcelle.name,
        culture: cultureLabel,
        surface: surface,
        carbonEmission: Math.round((baseEmission * surface) / 10),
        waterConsumption: Math.round(waterConsumption * surface / 10),
        coordinates: generateCoordinates(parcelles.length),
        color: cultureColor
      }
      
      // Appeler l'API pour créer la parcelle
      const response = await api.createParcelle(parcelle)
      if (response.parcelle) {
        setParcelles([...parcelles, response.parcelle])
      }
      
      // Reset form
      setNewParcelle({ culture: 'ble', surface: 10 })
      setCustomCulture('')
      setShowAddForm(false)
    } catch (err) {
      setError('Erreur lors de la création de la parcelle')
      console.error('Error adding parcelle:', err)
    }
  }

  const handleDeleteParcelle = async (id: string) => {
    try {
      await api.deleteParcelle(id)
      setParcelles(parcelles.filter(p => p.id !== id))
    } catch (err) {
      setError('Erreur lors de la suppression')
      console.error(err)
    }
  }

  const handleUpdateParcelle = (id: string, updates: Partial<Parcelle>) => {
    setParcelles(parcelles.map(p => 
      p.id === id ? { ...p, ...updates } : p
    ))
  }

  const generateCoordinates = (index: number) => {
    // Générer des positions automatiques pour la carte
    const positions = [
      { x: 10, y: 10, width: 35, height: 25 },
      { x: 55, y: 10, width: 35, height: 35 },
      { x: 10, y: 42, width: 20, height: 20 },
      { x: 35, y: 42, width: 25, height: 25 },
      { x: 65, y: 52, width: 25, height: 20 },
      { x: 10, y: 68, width: 40, height: 25 },
    ]
    return positions[index % positions.length]
  }

  const totalSurface = parcelles.reduce((sum, p) => sum + p.surface, 0)
  const totalCarbon = parcelles.reduce((sum, p) => sum + p.carbonEmission, 0)
  const totalWater = parcelles.reduce((sum, p) => sum + p.waterConsumption, 0)

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes Parcelles</h1>
          <p className="text-gray-500 mt-1">Gérez vos parcelles et suivez leur empreinte carbone.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-xl font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Ajouter une Parcelle
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-500">Chargement...</span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-4 mb-6 bg-red-50 border border-red-200 rounded-xl text-red-600">
          <p className="font-medium">{error}</p>
          <button 
            onClick={loadParcelles}
            className="mt-2 text-sm underline hover:no-underline"
          >
            Réessayer
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Nombre de parcelles</p>
              <p className="text-2xl font-bold text-gray-900">{parcelles.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Leaf className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Surface totale</p>
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
              <p className="text-sm text-gray-500">Émissions totales</p>
              <p className="text-2xl font-bold text-gray-900">{totalCarbon} kg</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Nouvelle Parcelle</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nom de la parcelle</label>
              <input
                type="text"
                placeholder="Ex: Champ Nord"
                value={newParcelle.name || ''}
                onChange={(e) => setNewParcelle({...newParcelle, name: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type de culture</label>
              <select
                value={newParcelle.culture}
                onChange={(e) => setNewParcelle({...newParcelle, culture: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              >
                {cultureOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              {newParcelle.culture === 'autre' && (
                <input
                  type="text"
                  placeholder="Précisez la culture..."
                  value={customCulture}
                  onChange={(e) => setCustomCulture(e.target.value)}
                  className="w-full mt-2 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Surface (hectares)</label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={newParcelle.surface || 10}
                onChange={(e) => setNewParcelle({...newParcelle, surface: parseFloat(e.target.value)})}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            <button 
              onClick={handleAddParcelle}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-medium"
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

      {/* Carte des parcelles */}
      {parcelles.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Vue d'ensemble de mes parcelles</h3>
          
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
              {parcelles.map((parcelle, index) => (
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
                    {parcelle.name}
                  </text>
                  <text
                    x={parcelle.coordinates.x + parcelle.coordinates.width / 2}
                    y={parcelle.coordinates.y + parcelle.coordinates.height / 2 + 3}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize="2.5"
                  >
                    {parcelle.surface} ha
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      )}

      {/* Liste des parcelles */}
      <div className="bg-white rounded-2xl border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Liste de mes parcelles</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {parcelles.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Vous n'avez pas encore de parcelles.</p>
              <p className="text-sm">Cliquez sur "Ajouter une Parcelle" pour commencer.</p>
            </div>
          ) : (
            parcelles.map((parcelle) => (
              <div key={parcelle.id} className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: parcelle.color + '20' }}
                  >
                    <MapPin className="w-6 h-6" style={{ color: parcelle.color }} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{parcelle.name}</h4>
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
                <button 
                  onClick={() => handleDeleteParcelle(parcelle.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-xl"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
