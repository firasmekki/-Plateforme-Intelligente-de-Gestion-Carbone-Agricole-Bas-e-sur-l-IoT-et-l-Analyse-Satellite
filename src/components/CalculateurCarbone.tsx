import { useState } from 'react'
import { Calculator, Leaf, Droplets, Zap, Tractor, Sprout, ChevronRight, RotateCcw, Download, Info } from 'lucide-react'

interface CultureType {
  id: string
  name: string
  category: 'cereals' | 'legumes' | 'vegetables' | 'fruits' | 'industrial'
  baseEmission: number // kg CO2e/ha
  waterConsumption: number // m3/ha
  fertilizerNeed: number // kg N/ha
}

const cultureTypes: CultureType[] = [
  { id: 'ble', name: 'Blé tendre', category: 'cereals', baseEmission: 850, waterConsumption: 450, fertilizerNeed: 180 },
  { id: 'mais', name: 'Maïs grain', category: 'cereals', baseEmission: 1200, waterConsumption: 680, fertilizerNeed: 220 },
  { id: 'orge', name: 'Orge', category: 'cereals', baseEmission: 720, waterConsumption: 380, fertilizerNeed: 150 },
  { id: 'colza', name: 'Colza', category: 'industrial', baseEmission: 980, waterConsumption: 520, fertilizerNeed: 200 },
  { id: 'tournesol', name: 'Tournesol', category: 'industrial', baseEmission: 750, waterConsumption: 480, fertilizerNeed: 160 },
  { id: 'pois', name: 'Pois protéagineux', category: 'legumes', baseEmission: 420, waterConsumption: 280, fertilizerNeed: 20 },
  { id: 'feverole', name: 'Féverole', category: 'legumes', baseEmission: 380, waterConsumption: 320, fertilizerNeed: 25 },
  { id: 'tomate', name: 'Tomates (plein champ)', category: 'vegetables', baseEmission: 650, waterConsumption: 420, fertilizerNeed: 140 },
  { id: 'carotte', name: 'Carottes', category: 'vegetables', baseEmission: 580, waterConsumption: 380, fertilizerNeed: 120 },
  { id: 'pomme', name: 'Pommiers', category: 'fruits', baseEmission: 320, waterConsumption: 280, fertilizerNeed: 80 },
  { id: 'vigne', name: 'Vigne (vin)', category: 'fruits', baseEmission: 480, waterConsumption: 220, fertilizerNeed: 60 },
]

interface CalculationResult {
  totalEmission: number
  emissionPerHectare: number
  emissionPerTon: number
  waterConsumption: number
  fertilizerConsumption: number
  dieselConsumption: number
  details: {
    fertilization: number
    diesel: number
    irrigation: number
    soil: number
  }
}

export default function CalculateurCarbone() {
  const [selectedCulture, setSelectedCulture] = useState<CultureType | null>(null)
  const [surface, setSurface] = useState<number>(10)
  const [yieldPerHa, setYieldPerHa] = useState<number>(7)
  const [irrigation, setIrrigation] = useState<boolean>(false)
  const [tillage, setTillage] = useState<'conventional' | 'reduced' | 'no-till'>('conventional')
  const [result, setResult] = useState<CalculationResult | null>(null)

  const calculateEmissions = () => {
    if (!selectedCulture) return

    const baseEmission = selectedCulture.baseEmission * surface
    const fertilization = selectedCulture.fertilizerNeed * surface * 5.5 // 5.5 kg CO2e/kg N
    const diesel = surface * (tillage === 'conventional' ? 85 : tillage === 'reduced' ? 65 : 45)
    const irrigationEmission = irrigation ? selectedCulture.waterConsumption * surface * 0.3 : 0

    const totalEmission = baseEmission + fertilization + diesel + irrigationEmission
    const totalYield = surface * yieldPerHa

    setResult({
      totalEmission: Math.round(totalEmission),
      emissionPerHectare: Math.round(totalEmission / surface),
      emissionPerTon: Math.round(totalEmission / totalYield),
      waterConsumption: Math.round(selectedCulture.waterConsumption * surface),
      fertilizerConsumption: Math.round(selectedCulture.fertilizerNeed * surface),
      dieselConsumption: Math.round(diesel / 2.6), // 2.6 kg CO2e/L diesel
      details: {
        fertilization: Math.round(fertilization),
        diesel: Math.round(diesel),
        irrigation: Math.round(irrigationEmission),
        soil: Math.round(baseEmission * 0.3)
      }
    })
  }

  const resetCalculator = () => {
    setSelectedCulture(null)
    setSurface(10)
    setYieldPerHa(7)
    setIrrigation(false)
    setTillage('conventional')
    setResult(null)
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Calculateur Carbone</h1>
        <p className="text-gray-500 mt-1">Estimez l'empreinte carbone selon le type de culture et les pratiques agricoles.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="space-y-6">
          {/* Culture Selection */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Sprout className="w-5 h-5 text-green-600" />
              Sélection de la culture
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              {cultureTypes.map((culture) => (
                <button
                  key={culture.id}
                  onClick={() => setSelectedCulture(culture)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    selectedCulture?.id === culture.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-100 hover:border-green-200'
                  }`}
                >
                  <p className="font-medium text-gray-900">{culture.name}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Base: {culture.baseEmission} kg CO₂e/ha
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Parameters */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-blue-600" />
              Paramètres de calcul
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Surface (hectares)
                </label>
                <input
                  type="number"
                  value={surface}
                  onChange={(e) => setSurface(Number(e.target.value))}
                  min="0.1"
                  step="0.1"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rendement estimé (tonnes/ha)
                </label>
                <input
                  type="number"
                  value={yieldPerHa}
                  onChange={(e) => setYieldPerHa(Number(e.target.value))}
                  min="1"
                  step="0.5"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de travail du sol
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'conventional', label: 'Conventionnel', emission: 85 },
                    { id: 'reduced', label: 'Réduit', emission: 65 },
                    { id: 'no-till', label: 'Sans labour', emission: 45 }
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setTillage(type.id as any)}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        tillage === type.id
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-blue-200'
                      }`}
                    >
                      <p className="font-medium text-sm">{type.label}</p>
                      <p className="text-xs text-gray-500 mt-1">{type.emission} L/ha</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Droplets className="w-5 h-5 text-blue-500" />
                  <span className="font-medium text-gray-700">Irrigation</span>
                </div>
                <button
                  onClick={() => setIrrigation(!irrigation)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    irrigation ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    irrigation ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
            </div>

            <button
              onClick={calculateEmissions}
              disabled={!selectedCulture}
              className="w-full mt-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Calculator className="w-5 h-5" />
              Calculer l'empreinte carbone
            </button>
          </div>
        </div>

        {/* Results */}
        <div>
          {result ? (
            <div className="space-y-6">
              {/* Main Result */}
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-8 text-white">
                <h3 className="text-lg font-semibold mb-2">Empreinte Carbone Totale</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold">{result.totalEmission.toLocaleString()}</span>
                  <span className="text-2xl">kg CO₂e</span>
                </div>
                <p className="text-green-100 mt-2">
                  Pour {surface} hectares de {selectedCulture?.name}
                </p>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Leaf className="w-5 h-5 text-red-500" />
                    <span className="text-sm text-gray-500">Par hectare</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{result.emissionPerHectare} kg</p>
                  <p className="text-xs text-gray-400">CO₂e/ha</p>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Tractor className="w-5 h-5 text-orange-500" />
                    <span className="text-sm text-gray-500">Par tonne</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{result.emissionPerTon} kg</p>
                  <p className="text-xs text-gray-400">CO₂e/t</p>
                </div>
              </div>

              {/* Breakdown */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Détail des émissions</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                        <Sprout className="w-5 h-5 text-purple-600" />
                      </div>
                      <span className="font-medium text-gray-700">Fertilisation</span>
                    </div>
                    <span className="font-bold text-gray-900">{result.details.fertilization.toLocaleString()} kg</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                        <Tractor className="w-5 h-5 text-orange-600" />
                      </div>
                      <span className="font-medium text-gray-700">Diesel (travail du sol)</span>
                    </div>
                    <span className="font-bold text-gray-900">{result.details.diesel.toLocaleString()} kg</span>
                  </div>

                  {irrigation && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                          <Droplets className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="font-medium text-gray-700">Irrigation</span>
                      </div>
                      <span className="font-bold text-gray-900">{result.details.irrigation.toLocaleString()} kg</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                        <Leaf className="w-5 h-5 text-green-600" />
                      </div>
                      <span className="font-medium text-gray-700">Sol et résidus</span>
                    </div>
                    <span className="font-bold text-gray-900">{result.details.soil.toLocaleString()} kg</span>
                  </div>
                </div>
              </div>

              {/* Resource Consumption */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Consommation de ressources</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Droplets className="w-5 h-5 text-blue-600" />
                      <span className="text-sm text-gray-600">Eau</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-700">{result.waterConsumption.toLocaleString()} m³</p>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Sprout className="w-5 h-5 text-purple-600" />
                      <span className="text-sm text-gray-600">Engrais azotés</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-700">{result.fertilizerConsumption.toLocaleString()} kg N</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  onClick={resetCalculator}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Nouveau calcul
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors">
                  <Download className="w-4 h-4" />
                  Exporter
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center bg-gray-50 rounded-2xl border border-gray-100 p-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calculator className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Prêt à calculer</h3>
                <p className="text-gray-500 max-w-sm">
                  Sélectionnez une culture et renseignez les paramètres pour estimer l'empreinte carbone de votre parcelle.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-8 bg-blue-50 rounded-2xl p-6 border border-blue-100">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Info className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-medium text-blue-900 mb-1">Méthodologie de calcul</h4>
            <p className="text-sm text-blue-700">
              Ce calculateur utilise les facteurs d'émission du Bilan Carbone® et les données de l'ADEME. 
              Les calculs prennent en compte les émissions directes (engrais, diesel) et indirectes (irrigation). 
              Les valeurs sont des estimations et peuvent varier selon les conditions locales.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
