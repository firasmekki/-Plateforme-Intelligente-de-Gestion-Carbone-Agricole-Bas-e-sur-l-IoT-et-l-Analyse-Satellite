import { Download, Plus, CheckCircle2, AlertTriangle, Leaf, Zap, Droplets, Target } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts'

const carbonData = [
  { name: 'Champ Blé', value: 4500, color: '#eab308' },
  { name: 'Champ Maïs', value: 6200, color: '#22c55e' },
  { name: 'Vergers', value: 3800, color: '#f97316' },
  { name: 'Serres', value: 5200, color: '#3b82f6' },
  { name: 'Pâturages', value: 2800, color: '#8b5cf6' },
]

const teamMembers = [
  {
    name: 'Jean Dupont',
    role: 'Agronome',
    task: 'Optimisation des cultures de blé',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    statusColor: 'bg-yellow-100 text-yellow-700'
  },
  {
    name: 'Marie Martin',
    role: 'Technicienne Irrigation',
    task: 'Installation système goutte-à-goutte',
    status: 'En cours',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    statusColor: 'bg-blue-100 text-blue-700'
  }
]

const activities = [
  {
    icon: CheckCircle2,
    title: 'Réduction engrais azotés réussie',
    description: 'Champ Maïs : baisse de 15% des émissions CO₂',
    time: 'il y a 2 heures',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600'
  },
  {
    icon: AlertTriangle,
    title: 'Alerte surconsommation irrigation',
    description: 'Champ Blé dépasse la cible mensuelle de 8%',
    time: 'il y a 4 heures',
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600'
  }
]

export default function Dashboard() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Agricole</h1>
          <p className="text-gray-500 mt-1">Surveillez et optimisez l'empreinte carbone de vos exploitations.</p>
        </div>
        <button className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-xl font-medium transition-colors">
          <Download className="w-4 h-4" />
          Télécharger Rapport
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Leaf className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-gray-500 text-sm">Émissions Carbone</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">18,500 <span className="text-sm font-normal text-gray-500">kg CO₂e</span></p>
          <p className="text-xs text-gray-400 mt-2">vs Objectif (15,000)</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-orange-600" />
            </div>
            <span className="text-gray-500 text-sm">Carburant Utilisé</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">1,240 <span className="text-sm font-normal text-gray-500">L</span></p>
          <p className="text-xs text-gray-400 mt-2">vs Objectif (1,100 L)</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Droplets className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-gray-500 text-sm">Eau d'Irrigation</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">45,200 <span className="text-sm font-normal text-gray-500">m³</span></p>
          <p className="text-xs text-gray-400 mt-2">vs Objectif (40,000 m³)</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-gray-500 text-sm">Objectifs Agricoles</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">68 <span className="text-sm font-normal text-gray-500">%</span></p>
          <p className="text-xs text-gray-400 mt-2">vs Objectif (80%)</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Carbon Emissions Chart - 6.5/10 = 65% */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 lg:col-span-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Émissions par Exploitation</h3>
          </div>
          <div className="flex gap-6">
            <div className="flex-1 h-48">
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
            <div className="w-48">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Résumé</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Le Champ Maïs génère le plus d'émissions (6.2T CO₂e), suivi des Serres (5.2T) et du Champ Blé (4.5T). Les Vergers et Pâturages ont les émissions les plus faibles. Total des émissions : 22,500 kg CO₂e. Les cultures intensives représentent 65% du total.
              </p>
            </div>
          </div>
        </div>

        {/* Sustainability Goals - 3.5/10 = 35% */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 lg:col-span-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Objectifs Agricoles</h3>
            <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-1.5 rounded-lg">
              <Plus className="w-4 h-4" />
              Nouveau
            </button>
          </div>
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="w-32 h-32 rounded-full border-8 border-green-200 border-t-green-500 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-gray-900">68%</span>
              </div>
              <p className="text-sm text-gray-600">3 objectifs sur 5 atteints</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Collaboration */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Équipe Agricole</h3>
            <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-1.5 rounded-lg">
              <Plus className="w-4 h-4" />
              Ajouter Membre
            </button>
          </div>
          <div className="space-y-4">
            {teamMembers.map((member, index) => (
              <div key={index} className="flex items-center gap-4">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{member.name}</h4>
                  <p className="text-sm text-gray-500">{member.role}</p>
                  <p className="text-sm text-gray-400">{member.task}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full ${member.statusColor}`}>
                  {member.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Activité Récente</h3>
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
    </div>
  )
}
