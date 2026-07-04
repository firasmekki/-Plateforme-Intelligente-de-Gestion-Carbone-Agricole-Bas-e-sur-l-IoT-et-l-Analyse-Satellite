import { Filter, ArrowUpRight, ArrowDownRight, Leaf, Droplets, Zap, Info, AlertTriangle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'

const statsCards = [
  {
    icon: Leaf,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    title: 'Émissions Totales',
    value: '18,500',
    unit: 'kg CO₂e',
    trend: 'up',
    trendValue: '12%',
    progress: 72,
    progressColor: 'bg-green-500',
    target: 'vs Objectif (15,000)',
    timeInfo: '2 mois pour objectif'
  },
  {
    icon: Zap,
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    title: 'Émissions Directes',
    value: '12,400',
    unit: 'kg CO₂e',
    trend: 'down',
    trendValue: '5%',
    progress: 65,
    progressColor: 'bg-orange-500',
    target: 'Benchmark: 8,500 kg',
    timeInfo: 'Au-dessus moyenne'
  },
  {
    icon: Droplets,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    title: 'Compensation Carbone',
    value: '2,450',
    unit: 'kg CO₂e',
    trend: 'down',
    trendValue: '8%',
    progress: 48,
    progressColor: 'bg-blue-500',
    target: 'Objectif: 5,000 kg',
    timeInfo: 'Ce trimestre'
  }
]

const chartData = [
  { name: 'Engrais', current: 1240, target: 1100, moyenne: 1300 },
  { name: 'Carburant', current: 680, target: 650, moyenne: 720 },
  { name: 'Irrigation', current: 520, target: 480, moyenne: 560 },
  { name: 'Machines', current: 407, target: 380, moyenne: 420 },
]

const performanceInsights = [
  {
    title: 'Cultures Intensives',
    efficiency: '85%',
    vsTarget: '+8.2%',
    vsTargetColor: 'text-red-500',
    description: 'Performance correcte, marge d\'amélioration',
    color: 'bg-red-500'
  },
  {
    title: 'Transport Récolte',
    efficiency: '78%',
    vsTarget: '+12.5%',
    vsTargetColor: 'text-orange-500',
    description: 'Bonne performance, marge d\'amélioration',
    color: 'bg-orange-500'
  },
  {
    title: 'Irrigation Optimisée',
    efficiency: '92%',
    vsTarget: '-15.3%',
    vsTargetColor: 'text-green-500',
    description: 'Excellente performance',
    color: 'bg-green-500'
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

export default function CarboneDetailPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Carbone Agricole</h1>
        <p className="text-gray-500 mt-1">Surveillez et gérez les émissions de votre exploitation agricole.</p>
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
              <span className="text-gray-400">{card.timeInfo}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Chart */}
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
              <BarChart data={chartData} barGap={8}>
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
                <Bar dataKey="moyenne" name="Moyenne" fill="#6b7280" radius={[4, 4, 0, 0]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance par Secteur</h3>
          <div className="space-y-6">
            {performanceInsights.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${item.color}`}></span>
                    <span className="font-medium text-gray-900">{item.title}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{item.efficiency}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: item.efficiency }} />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">vs Objectif</span>
                  <span className={`font-medium ${item.vsTargetColor}`}>
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
