import { 
  Zap, 
  TrendingUp, 
  Target, 
  Flame, 
  CheckCircle, 
  Zap as ZapIcon,
  BarChart3,
  Share2,
  AlertTriangle,
  Lightbulb,
  TrendingDown,
  Wind
} from 'lucide-react'

const aiStats = [
  {
    icon: Zap,
    title: 'Recommandations Agro IA',
    value: '18',
    badge: 'Suggestions actives',
    badgeColor: 'bg-purple-100 text-purple-600',
    iconBg: 'bg-purple-500'
  },
  {
    icon: TrendingUp,
    title: 'Prédictions',
    value: '6',
    badge: 'Prévisions rendement',
    badgeColor: 'bg-blue-100 text-blue-600',
    iconBg: 'bg-blue-500'
  },
  {
    icon: Target,
    title: 'Optimisation',
    value: '12',
    badge: 'Économies potentielles',
    badgeColor: 'bg-green-100 text-green-600',
    iconBg: 'bg-green-500'
  }
]

const emissionsInsights = [
  {
    icon: AlertTriangle,
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-500',
    title: 'Prédiction Carbone',
    description: 'Basé sur les tendances actuelles, vous dépasserez votre objectif carbone T4 de 8%. Envisagez d\'optimiser l\'utilisation des engrais azotés.',
    badge: 'Priorité Haute',
    badgeColor: 'bg-red-100 text-red-600',
    action: 'Appliquer'
  },
  {
    icon: CheckCircle,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-500',
    title: 'Opportunité Détectée',
    description: 'L\'efficacité de l\'irrigation peut être améliorée de 15% avec un système goutte-à-goutte. ROI estimé: 14 mois.',
    badge: 'Priorité Moyenne',
    badgeColor: 'bg-blue-100 text-blue-600',
    action: 'Voir Détails'
  }
]

const energyInsights = [
  {
    icon: Lightbulb,
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    title: 'Détection Surconsommation Irrigation',
    description: 'Surconsommation d\'eau détectée sur les parcelles 2 et 5. Le passage à l\'irrigation nocturne pourrait économiser 2,400 m³/mois.',
    badge: 'Économie Eau',
    badgeColor: 'bg-yellow-100 text-yellow-700',
    action: 'Planifier Optimisation'
  },
  {
    icon: Wind,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-500',
    title: 'Prédiction Rendement et Carbone',
    description: 'Les modèles prédictifs indiquent une récolte de 15% supérieure à la moyenne, mais une augmentation de 6% des émissions. Ajustez la fertilisation.',
    badge: 'Prévision',
    badgeColor: 'bg-purple-100 text-purple-600',
    action: 'Voir Prévision'
  }
]

const analyticsInsights = [
  {
    icon: TrendingDown,
    iconBg: 'bg-pink-100',
    iconColor: 'text-pink-500',
    title: 'Corrélation Météo-Production',
    description: 'Forte corrélation détectée entre les précipitations et le rendement. Les modèles prédictifs peuvent améliorer la planification de 23%.'
  },
  {
    icon: Target,
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-500',
    title: 'Optimisation des Objectifs',
    description: 'La trajectoire actuelle suggère 87% d\'atteinte des objectifs. Un ajustement de 5% assurerait 95% de réussite.'
  }
]

export default function AIInsights() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agro AI Insights</h1>
          <p className="text-gray-500 mt-1">Analyse intelligente et recommandations pour optimiser votre exploitation agricole.</p>
        </div>
        <button className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-xl font-medium transition-colors">
          <Share2 className="w-4 h-4" />
          Partager
        </button>
      </div>

      {/* AI Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {aiStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 ${stat.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <span className={`inline-block mt-2 text-xs px-2 py-1 rounded-lg ${stat.badgeColor}`}>
                  {stat.badge}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Emissions AI Insights */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
            <Flame className="w-4 h-4 text-red-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Insights Carbone Agricole</h3>
            <p className="text-sm text-gray-500">Recommandations IA pour réduire l'empreinte carbone</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {emissionsInsights.map((insight, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 ${insight.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <insight.icon className={`w-5 h-5 ${insight.iconColor}`} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-2">{insight.title}</h4>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">{insight.description}</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-3 py-1 rounded-full ${insight.badgeColor}`}>
                      {insight.badge}
                    </span>
                    <button className="text-sm text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-1.5 rounded-lg transition-colors">
                      {insight.action}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Energy AI Insights */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
            <ZapIcon className="w-4 h-4 text-orange-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Optimisation Carbone Agricole</h3>
            <p className="text-sm text-gray-500">Recommandations intelligentes pour réduire les émissions</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {energyInsights.map((insight, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 ${insight.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <insight.icon className={`w-5 h-5 ${insight.iconColor}`} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-2">{insight.title}</h4>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">{insight.description}</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-3 py-1 rounded-full ${insight.badgeColor}`}>
                      {insight.badge}
                    </span>
                    <button className="text-sm text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-1.5 rounded-lg transition-colors">
                      {insight.action}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analytics AI Insights */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-pink-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Analytique Agricole</h3>
            <p className="text-sm text-gray-500">Insights data-driven pour optimiser les performances</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {analyticsInsights.map((insight, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 ${insight.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <insight.icon className={`w-5 h-5 ${insight.iconColor}`} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-2">{insight.title}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{insight.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
