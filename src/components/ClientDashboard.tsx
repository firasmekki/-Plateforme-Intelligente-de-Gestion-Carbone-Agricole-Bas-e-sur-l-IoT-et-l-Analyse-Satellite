import { Download, Leaf, Zap, Droplets, Target, Info, Plus, CheckCircle2, AlertTriangle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts'
import SustainabilityChart from './SustainabilityChart'
import type { User } from '../auth/authStore'

interface ClientDashboardProps {
  user: User
}

const carbonData = [
  { name: 'Engrais', value: 2800, color: '#8b5cf6' },
  { name: 'Carburant', value: 2100, color: '#f97316' },
  { name: 'Irrigation', value: 1900, color: '#3b82f6' },
]

const activities = [
  {
    icon: CheckCircle2,
    title: 'Optimisation réussie !',
    description: 'Réduction de 20% sur l\'utilisation des engrais azotés',
    time: 'il y a 2 heures',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600'
  },
  {
    icon: AlertTriangle,
    title: 'Alerte irrigation',
    description: 'Surconsommation d\'eau détectée sur le parcelle 3',
    time: 'il y a 4 heures',
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600'
  }
]

export default function ClientDashboard({ user }: ClientDashboardProps) {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mon Exploitation</h1>
          <p className="text-gray-500 mt-1">Bienvenue {user.name}, suivez l'empreinte carbone de votre ferme.</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-xl font-medium transition-colors">
          <Download className="w-4 h-4" />
          Télécharger Rapport
        </button>
      </div>

      {/* Stat Cards - Version simplifiée pour client */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Leaf className="w-5 h-5 text-blue-600" />
            </div>
            <Info className="w-4 h-4 text-gray-300" />
          </div>
          <h3 className="text-gray-500 text-sm font-medium mb-1">Empreinte Carbone</h3>
          <div className="flex items-baseline gap-1 mb-3">
            <span className="text-2xl font-bold text-gray-900">6,800</span>
            <span className="text-sm text-gray-500">kg CO₂e</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: '72%' }} />
          </div>
          <p className="text-xs text-gray-500 mt-2">Objectif: 72% atteint</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-green-600" />
            </div>
            <Info className="w-4 h-4 text-gray-300" />
          </div>
          <h3 className="text-gray-500 text-sm font-medium mb-1">Carburant Utilisé</h3>
          <div className="flex items-baseline gap-1 mb-3">
            <span className="text-2xl font-bold text-gray-900">425</span>
            <span className="text-sm text-gray-500">L</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full" style={{ width: '85%' }} />
          </div>
          <p className="text-xs text-gray-500 mt-2">Optimisation: -12% ce mois</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <Droplets className="w-5 h-5 text-orange-600" />
            </div>
            <Info className="w-4 h-4 text-gray-300" />
          </div>
          <h3 className="text-gray-500 text-sm font-medium mb-1">Eau d'Irrigation</h3>
          <div className="flex items-baseline gap-1 mb-3">
            <span className="text-2xl font-bold text-gray-900">8,200</span>
            <span className="text-sm text-gray-500">m³</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500 rounded-full" style={{ width: '65%' }} />
          </div>
          <p className="text-xs text-gray-500 mt-2">Alerte: +8% ce mois</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-purple-600" />
            </div>
            <Info className="w-4 h-4 text-gray-300" />
          </div>
          <h3 className="text-gray-500 text-sm font-medium mb-1">Objectifs Agricoles</h3>
          <div className="flex items-baseline gap-1 mb-3">
            <span className="text-2xl font-bold text-gray-900">3</span>
            <span className="text-sm text-gray-500">/ 5</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-purple-500 rounded-full" style={{ width: '60%' }} />
          </div>
          <p className="text-xs text-gray-500 mt-2">60% complété</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Carbon Emissions Chart */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 lg:col-span-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Émissions par Source (Engrais, Carburant, Eau)</h3>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height={192}>
              <BarChart data={carbonData}>
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
                <Bar dataKey="value" radius={[4, 4, 0, 0]} isAnimationActive={false}>
                  {carbonData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sustainability Goals */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 lg:col-span-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Mes Objectifs Agricoles</h3>
            <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-1.5 rounded-lg">
              <Plus className="w-4 h-4" />
              Nouveau
            </button>
          </div>
          <div className="flex items-center justify-center">
            <SustainabilityChart />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Mon Activité Récente</h3>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex gap-3">
              <div className={`w-10 h-10 rounded-full ${activity.iconBg} flex items-center justify-center flex-shrink-0`}>
                <activity.icon className={`w-5 h-5 ${activity.iconColor}`} />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 text-sm">{activity.title}</h4>
                <p className="text-xs text-gray-500">{activity.description}</p>
                <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
