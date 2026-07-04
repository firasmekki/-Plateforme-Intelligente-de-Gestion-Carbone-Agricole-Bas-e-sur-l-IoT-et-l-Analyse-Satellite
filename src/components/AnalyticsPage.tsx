import { BarChart3, TrendingUp, TrendingDown, Calendar, Leaf, Droplets, Zap, Target } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Legend, Tooltip } from 'recharts'

const evolutionData = [
  { month: 'Jan', carbone: 2100, eau: 1200, energie: 800 },
  { month: 'Fév', carbone: 2050, eau: 1150, energie: 780 },
  { month: 'Mar', carbone: 1980, eau: 1100, energie: 760 },
  { month: 'Avr', carbone: 1850, eau: 1050, energie: 720 },
  { month: 'Mai', carbone: 1750, eau: 980, energie: 690 },
  { month: 'Juin', carbone: 1650, eau: 920, energie: 650 },
]

const kpiCards = [
  {
    title: 'Réduction Carbone',
    value: '-21.4%',
    vsLastYear: '-18%',
    trend: 'down',
    icon: Leaf,
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  {
    title: 'Eau Économisée',
    value: '23.3%',
    vsLastYear: '+12%',
    trend: 'down',
    icon: Droplets,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  {
    title: 'Efficacité Énergétique',
    value: '18.8%',
    vsLastYear: '+8%',
    trend: 'up',
    icon: Zap,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100'
  },
  {
    title: 'Objectifs Atteints',
    value: '4/5',
    vsLastYear: '+1',
    trend: 'up',
    icon: Target,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  }
]

const comparisons = [
  { label: 'Vs Moyenne Secteur', value: '-15%', positive: true },
  { label: 'Vs Année Précédente', value: '-22%', positive: true },
  { label: 'Vs Objectif Annuel', value: '+8%', positive: false },
  { label: 'ROI Optimisation', value: '145%', positive: true },
]

export default function AnalyticsPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-500 mt-1">Analyse approfondie des performances agricoles.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">
          <Calendar className="w-4 h-4" />
          6 derniers mois
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpiCards.map((kpi, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${kpi.bgColor} rounded-xl flex items-center justify-center`}>
                <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
              </div>
              <div className={`flex items-center gap-1 text-sm ${kpi.trend === 'down' ? 'text-green-500' : 'text-blue-500'}`}>
                {kpi.trend === 'down' ? (
                  <TrendingDown className="w-4 h-4" />
                ) : (
                  <TrendingUp className="w-4 h-4" />
                )}
                {kpi.vsLastYear}
              </div>
            </div>
            <p className="text-gray-500 text-sm font-medium">{kpi.title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{kpi.value}</p>
            <p className="text-xs text-gray-400 mt-2">vs année précédente</p>
          </div>
        ))}
      </div>

      {/* Main Chart */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Évolution des Métriques</h3>
              <p className="text-sm text-gray-500">Carbone, Eau et Énergie (6 mois)</p>
            </div>
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={evolutionData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6b7280', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6b7280', fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend iconType="circle" wrapperStyle={{ paddingTop: 20 }} />
              <Line
                type="monotone"
                dataKey="carbone"
                name="Émissions Carbone (kg)"
                stroke="#22c55e"
                strokeWidth={3}
                dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="eau"
                name="Eau (m³)"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="energie"
                name="Énergie (kWh)"
                stroke="#f97316"
                strokeWidth={3}
                dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Comparisons Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Benchmarks & Comparaisons</h3>
          <div className="space-y-4">
            {comparisons.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <span className="font-medium text-gray-700">{item.label}</span>
                <span className={`text-lg font-bold ${item.positive ? 'text-green-600' : 'text-red-600'}`}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Prédictions IA</h3>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">Projection Carbone T4</span>
              </div>
              <p className="text-sm text-green-700">Réduction estimée de 28% si optimisations appliquées</p>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-800">Projection Eau T4</span>
              </div>
              <p className="text-sm text-blue-700">Économie estimée de 35% avec système goutte-à-goutte</p>
            </div>
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-orange-600" />
                <span className="font-medium text-orange-800">Alerte Carburant</span>
              </div>
              <p className="text-sm text-orange-700">Hausse prévue de 12% sans intervention</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
