import { Target, CheckCircle2, Clock, AlertCircle, TrendingUp, Leaf, Droplets, Zap } from 'lucide-react'

const objectifs = [
  {
    icon: Leaf,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    title: 'Réduction Émissions Carbone',
    target: '-25%',
    current: '-18%',
    progress: 72,
    deadline: '31 Déc 2024',
    status: 'En cours',
    statusColor: 'bg-blue-100 text-blue-700'
  },
  {
    icon: Droplets,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    title: 'Optimisation Irrigation',
    target: '-30%',
    current: '-22%',
    progress: 73,
    deadline: '30 Sep 2024',
    status: 'En cours',
    statusColor: 'bg-blue-100 text-blue-700'
  },
  {
    icon: Zap,
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    title: 'Réduction Carburant',
    target: '-20%',
    current: '-8%',
    progress: 40,
    deadline: '31 Déc 2024',
    status: 'En retard',
    statusColor: 'bg-red-100 text-red-700'
  }
]

const milestones = [
  { date: 'Jan 2024', event: 'Audit énergétique complet', completed: true },
  { date: 'Mar 2024', event: 'Installation capteurs irrigation', completed: true },
  { date: 'Juin 2024', event: 'Formation équipe optimisation', completed: true },
  { date: 'Sep 2024', event: 'Objectif irrigation -30%', completed: false },
  { date: 'Déc 2024', event: 'Objectif carbone -25%', completed: false },
]

export default function ObjectifsPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Objectifs Agricoles</h1>
        <p className="text-gray-500 mt-1">Suivi des objectifs de réduction carbone et d'efficacité.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Objectifs Actifs</p>
              <p className="text-2xl font-bold text-gray-900">5</p>
            </div>
          </div>
          <p className="text-xs text-gray-500">3 en cours, 2 complétés</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Progression Moyenne</p>
              <p className="text-2xl font-bold text-gray-900">62%</p>
            </div>
          </div>
          <p className="text-xs text-green-600">+8% vs mois dernier</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Jours Restants (T4)</p>
              <p className="text-2xl font-bold text-gray-900">89</p>
            </div>
          </div>
          <p className="text-xs text-gray-500">Objectif annuel 2024</p>
        </div>
      </div>

      {/* Objectifs Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {objectifs.map((obj, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 ${obj.iconBg} rounded-xl flex items-center justify-center`}>
                <obj.icon className={`w-6 h-6 ${obj.iconColor}`} />
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${obj.statusColor}`}>
                {obj.status}
              </span>
            </div>
            
            <h3 className="font-semibold text-gray-900 mb-2">{obj.title}</h3>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-3xl font-bold text-gray-900">{obj.current}</span>
              <span className="text-sm text-gray-500">/ {obj.target}</span>
            </div>
            
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
              <div 
                className={`h-full rounded-full ${obj.progress >= 70 ? 'bg-green-500' : obj.progress >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                style={{ width: `${obj.progress}%` }} 
              />
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Progression: {obj.progress}%</span>
              <span className="text-gray-400">Échéance: {obj.deadline}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Calendrier des Jalons</h3>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          <div className="space-y-6">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-start gap-4 relative">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                  milestone.completed 
                    ? 'bg-green-500' 
                    : 'bg-white border-2 border-gray-300'
                }`}>
                  {milestone.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  ) : (
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 pt-1">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-medium ${milestone.completed ? 'text-gray-900' : 'text-gray-600'}`}>
                      {milestone.event}
                    </h4>
                    <span className="text-sm text-gray-500">{milestone.date}</span>
                  </div>
                  {milestone.completed && (
                    <p className="text-sm text-green-600 mt-1">Complété ✓</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
