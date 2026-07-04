import { Droplets, AlertTriangle, CheckCircle2, Info, TrendingDown, TrendingUp } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'

const irrigationData = [
  { name: 'Lun', actuel: 120, optimal: 100, precipitation: 5 },
  { name: 'Mar', actuel: 145, optimal: 110, precipitation: 0 },
  { name: 'Mer', actuel: 110, optimal: 105, precipitation: 12 },
  { name: 'Jeu', actuel: 160, optimal: 100, precipitation: 0 },
  { name: 'Ven', actuel: 135, optimal: 95, precipitation: 8 },
  { name: 'Sam', actuel: 90, optimal: 80, precipitation: 25 },
  { name: 'Dim', actuel: 75, optimal: 70, precipitation: 18 },
]

const parcelles = [
  { 
    name: 'Parcelle 1 - Blé', 
    consumption: '450 m³', 
    efficiency: '85%',
    status: 'Optimal',
    statusColor: 'bg-green-100 text-green-700',
    trend: 'down'
  },
  { 
    name: 'Parcelle 2 - Maïs', 
    consumption: '820 m³', 
    efficiency: '72%',
    status: 'Surconsommation',
    statusColor: 'bg-red-100 text-red-700',
    trend: 'up'
  },
  { 
    name: 'Parcelle 3 - Légumes', 
    consumption: '320 m³', 
    efficiency: '92%',
    status: 'Excellent',
    statusColor: 'bg-blue-100 text-blue-700',
    trend: 'down'
  },
  { 
    name: 'Parcelle 4 - Vergers', 
    consumption: '280 m³', 
    efficiency: '88%',
    status: 'Optimal',
    statusColor: 'bg-green-100 text-green-700',
    trend: 'stable'
  },
]

export default function IrrigationPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Irrigation</h1>
        <p className="text-gray-500 mt-1">Surveillance et optimisation de la consommation d'eau d'irrigation.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Droplets className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Consommation Totale</p>
              <p className="text-2xl font-bold text-gray-900">1,870 m³</p>
            </div>
          </div>
          <p className="text-xs text-gray-500">vs Objectif: 1,560 m³ (+20%)</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Efficacité Moyenne</p>
              <p className="text-2xl font-bold text-gray-900">84%</p>
            </div>
          </div>
          <p className="text-xs text-green-600">+5% vs mois dernier</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Alertes Actives</p>
              <p className="text-2xl font-bold text-gray-900">2</p>
            </div>
          </div>
          <p className="text-xs text-gray-500">Surconsommation détectée</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Économie Potentielle</p>
              <p className="text-2xl font-bold text-gray-900">310 m³</p>
            </div>
          </div>
          <p className="text-xs text-green-600">~450€/mois d'économie</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Consommation d'Eau (7 derniers jours)</h3>
            <p className="text-sm text-gray-500">Comparaison avec objectifs et précipitations</p>
          </div>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height={256}>
            <AreaChart data={irrigationData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6b7280', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6b7280', fontSize: 12 }}
              />
              <Legend iconType="circle" wrapperStyle={{ paddingTop: 20 }} />
              <Area type="monotone" dataKey="actuel" name="Consommation Actuelle (m³)" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} isAnimationActive={false} />
              <Area type="monotone" dataKey="optimal" name="Objectif (m³)" stroke="#22c55e" fill="#22c55e" fillOpacity={0.1} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Parcelles Table */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Suivi par Parcelle</h3>
        <div className="space-y-4">
          {parcelles.map((parcelle, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Droplets className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{parcelle.name}</h4>
                  <p className="text-sm text-gray-500">Consommation: {parcelle.consumption}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">Efficacité</p>
                  <p className="text-lg font-bold text-blue-600">{parcelle.efficiency}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${parcelle.statusColor}`}>
                  {parcelle.status}
                </span>
                {parcelle.trend === 'down' ? (
                  <TrendingDown className="w-5 h-5 text-green-500" />
                ) : parcelle.trend === 'up' ? (
                  <TrendingUp className="w-5 h-5 text-red-500" />
                ) : (
                  <div className="w-5 h-5 flex items-center justify-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
