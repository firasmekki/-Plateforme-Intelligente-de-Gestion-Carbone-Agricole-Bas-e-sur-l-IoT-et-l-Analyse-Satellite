import { Filter, ArrowUpRight, ArrowDownRight, Leaf, Droplets, Zap, Info, AlertTriangle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'

const emissionsData = [
  { name: 'Engrais', current: 1240, target: 1100, avg: 1300 },
  { name: 'Carburant', current: 680, target: 650, avg: 720 },
  { name: 'Irrigation', current: 520, target: 480, avg: 560 },
  { name: 'Machines', current: 407, target: 380, avg: 420 },
]

const performanceData = [
  {
    title: 'Cultures Intensives',
    efficiency: '85%',
    vsTarget: '+8.2%',
    color: 'bg-red-500',
    dotColor: 'bg-red-500',
    description: 'Performance correcte, marge d\'amélioration',
    trend: 'up'
  },
  {
    title: 'Transport Récolte',
    efficiency: '78%',
    vsTarget: '+12.5%',
    color: 'bg-orange-500',
    dotColor: 'bg-orange-500',
    description: 'Bonne performance, marge d\'amélioration',
    trend: 'up'
  },
  {
    title: 'Irrigation Optimisée',
    efficiency: '92%',
    vsTarget: '-15.3%',
    color: 'bg-green-500',
    dotColor: 'bg-green-500',
    description: 'Excellente performance',
    trend: 'down'
  }
]

const recommendedActions = [
  {
    priority: 'Haute Priorité',
    priorityColor: 'bg-red-100 text-red-700',
    dotColor: 'bg-red-500',
    title: 'Optimiser l\'Utilisation des Engrais',
    description: 'Implémenter une fertilisation de précision pour réduire les émissions de 15%',
    potential: '-185 kg CO₂e',
    action: 'Voir Détails'
  },
  {
    priority: 'Priorité Moyenne',
    priorityColor: 'bg-yellow-100 text-yellow-700',
    dotColor: 'bg-yellow-500',
    title: 'Moderniser le Parc Machine',
    description: 'Remplacer les tracteurs anciens par des modèles plus efficaces',
    potential: '-78 kg CO₂e',
    action: 'Voir Détails'
  }
]

export default function CarboneAgricolePage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Carbone Agricole</h1>
        <p className="text-gray-500 mt-1">Surveillez et gérez les émissions de votre exploitation agricole.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Emissions */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Leaf className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex items-center gap-1 text-red-500 text-sm">
              <ArrowUpRight className="w-4 h-4" />
              12%
            </div>
          </div>
          <h3 className="text-gray-500 text-sm font-medium mb-1">Émissions Totales</h3>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-3xl font-bold text-gray-900">18,500</span>
            <span className="text-sm text-gray-500">kg CO₂e</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
            <div className="h-full bg-green-500 rounded-full" style={{ width: '72%' }} />
          </div>
          <p className="text-xs text-gray-500">vs Objectif (15,000 kg)</p>
        </div>

        {/* Scope 1 Emissions */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-orange-600" />
            </div>
            <div className="flex items-center gap-1 text-green-500 text-sm">
              <ArrowDownRight className="w-4 h-4" />
              5%
            </div>
          </div>
          <h3 className="text-gray-500 text-sm font-medium mb-1">Émissions Directes</h3>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-3xl font-bold text-gray-900">12,400</span>
            <span className="text-sm text-gray-500">kg CO₂e</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
            <div className="h-full bg-orange-500 rounded-full" style={{ width: '65%' }} />
          </div>
          <p className="text-xs text-gray-500">Benchmark: 8,500 kg CO₂e</p>
        </div>

        {/* Carbon Offset */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Droplets className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex items-center gap-1 text-green-500 text-sm">
              <ArrowDownRight className="w-4 h-4" />
              8%
            </div>
          </div>
          <h3 className="text-gray-500 text-sm font-medium mb-1">Compensation Carbone</h3>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-3xl font-bold text-gray-900">2,450</span>
            <span className="text-sm text-gray-500">kg CO₂e</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: '48%' }} />
          </div>
          <p className="text-xs text-gray-500">Objectif: 5,000 kg CO₂e</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Emissions Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Filter className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Émissions par Source</h3>
                <p className="text-sm text-gray-500">Actuel vs Objectif vs Moyenne</p>
              </div>
            </div>
            <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-1.5 rounded-lg">
              <Filter className="w-4 h-4" />
              3M
            </button>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height={256}>
              <BarChart data={emissionsData} barGap={8}>
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
                <Legend 
                  iconType="circle"
                  wrapperStyle={{ paddingTop: 20 }}
                />
                <Bar dataKey="current" name="Actuel" fill="#ef4444" radius={[4, 4, 0, 0]} isAnimationActive={false} />
                <Bar dataKey="target" name="Objectif" fill="#22c55e" radius={[4, 4, 0, 0]} isAnimationActive={false} />
                <Bar dataKey="avg" name="Moyenne" fill="#6b7280" radius={[4, 4, 0, 0]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance par Secteur</h3>
          <div className="space-y-6">
            {performanceData.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${item.dotColor || item.color}`}></span>
                    <span className="font-medium text-gray-900">{item.title}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{item.efficiency}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
                  <div className={`h-full rounded-full ${item.color}`} style={{ width: item.efficiency }} />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">vs Objectif</span>
                  <span className={`font-medium ${item.trend === 'down' ? 'text-green-600' : 'text-red-600'}`}>
                    {item.vsTarget}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Actions */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions Recommandées</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {recommendedActions.map((action, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 ${action.priorityColor.split(' ')[0]} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  {action.priority.includes('Haute') ? (
                    <AlertTriangle className={`w-5 h-5 ${action.priorityColor.split(' ')[1]}`} />
                  ) : (
                    <Info className={`w-5 h-5 ${action.priorityColor.split(' ')[1]}`} />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`w-2 h-2 rounded-full ${action.dotColor}`}></span>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${action.priorityColor}`}>
                      {action.priority}
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{action.title}</h4>
                  <p className="text-sm text-gray-600 mb-4">{action.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-600 font-medium">Potentiel: {action.potential}</span>
                    <button className="text-sm text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-1.5 rounded-lg transition-colors">
                      {action.action}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
