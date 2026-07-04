import { Leaf, Zap, Droplets, Info, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'

const resourcesData = [
  { name: 'Engrais Azotés', current: 450, optimal: 380, unit: 'kg/ha' },
  { name: 'Engrais Phosphatés', current: 180, optimal: 160, unit: 'kg/ha' },
  { name: 'Carburant Tracteur', current: 1250, optimal: 1100, unit: 'L/mois' },
  { name: 'Électricité', current: 3200, optimal: 2800, unit: 'kWh/mois' },
]

const statsCards = [
  {
    icon: Leaf,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    title: 'Engrais Utilisés',
    value: '2,840',
    unit: 'kg',
    trend: 'up',
    trendValue: '8%',
    progress: 78,
    progressColor: 'bg-purple-500',
    target: 'vs Optimal (2,400)',
    efficiency: 'Efficacité: 78%'
  },
  {
    icon: Zap,
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    title: 'Carburant Consommé',
    value: '1,250',
    unit: 'L',
    trend: 'down',
    trendValue: '5%',
    progress: 85,
    progressColor: 'bg-orange-500',
    target: 'vs Objectif (1,100)',
    efficiency: 'Bonne performance'
  },
  {
    icon: Droplets,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    title: 'Énergie Électrique',
    value: '3,200',
    unit: 'kWh',
    trend: 'up',
    trendValue: '12%',
    progress: 65,
    progressColor: 'bg-blue-500',
    target: 'vs Cible (2,800)',
    efficiency: 'Surconsommation'
  }
]

export default function RessourcesAgricolesPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Ressources Agricoles</h1>
        <p className="text-gray-500 mt-1">Suivi et optimisation des ressources agricoles et énergétiques.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statsCards.map((card, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 ${card.iconBg} rounded-xl flex items-center justify-center`}>
                <card.icon className={`w-5 h-5 ${card.iconColor}`} />
              </div>
              <div className={`flex items-center gap-1 text-sm ${card.trend === 'up' ? 'text-red-500' : 'text-green-500'}`}>
                {card.trend === 'up' ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {card.trendValue}
              </div>
            </div>
            
            <h3 className="text-gray-500 text-sm font-medium mb-1">{card.title}</h3>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-3xl font-bold text-gray-900">{card.value}</span>
              <span className="text-sm text-gray-500">{card.unit}</span>
            </div>
            
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
              <div className={`h-full ${card.progressColor} rounded-full`} style={{ width: `${card.progress}%` }} />
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">{card.target}</span>
              <span className="text-gray-400">{card.efficiency}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Consommation par Ressource</h3>
              <p className="text-sm text-gray-500">Actuel vs Optimal</p>
            </div>
          </div>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height={256}>
            <BarChart data={resourcesData} barGap={8}>
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
              <Bar dataKey="current" name="Consommation Actuelle" fill="#f97316" radius={[4, 4, 0, 0]} isAnimationActive={false} />
              <Bar dataKey="optimal" name="Consommation Optimale" fill="#22c55e" radius={[4, 4, 0, 0]} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Optimisations Recommandées</h3>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Leaf className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Réduire engrais azotés</h4>
                <p className="text-sm text-gray-500">Potentiel d'économie: 15% (-70 kg/ha)</p>
                <span className="text-xs text-green-600 font-medium">Économie: 450€/mois</span>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Droplets className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Optimiser irrigation électrique</h4>
                <p className="text-sm text-gray-500">Passer en heures creuses (-400 kWh/mois)</p>
                <span className="text-xs text-green-600 font-medium">Économie: 120€/mois</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Alertes Ressources</h3>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Info className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Stock engrais faible</h4>
                <p className="text-sm text-gray-500">Engrais azotés: 15 jours restants</p>
                <span className="text-xs text-orange-600 font-medium">Commande recommandée</span>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <ArrowUpRight className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Pic consommation carburant</h4>
                <p className="text-sm text-gray-500">+25% ce mois vs moyenne</p>
                <span className="text-xs text-red-600 font-medium">Investigation requise</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
