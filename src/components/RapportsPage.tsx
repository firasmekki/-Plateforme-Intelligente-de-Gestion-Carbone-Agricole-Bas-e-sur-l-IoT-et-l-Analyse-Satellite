import { FileText, Download, Calendar, Filter, CheckCircle2, Clock, AlertCircle } from 'lucide-react'

const rapports = [
  {
    title: 'Rapport Mensuel - Émissions Carbone',
    date: 'Janvier 2024',
    type: 'PDF',
    size: '2.4 MB',
    status: 'Disponible',
    statusColor: 'bg-green-100 text-green-700',
    generated: 'Il y a 2 jours'
  },
  {
    title: 'Analyse Consommation Eau',
    date: 'Q4 2023',
    type: 'Excel',
    size: '1.8 MB',
    status: 'Disponible',
    statusColor: 'bg-green-100 text-green-700',
    generated: 'Il y a 1 semaine'
  },
  {
    title: 'Audit Ressources Agricoles',
    date: 'Annuel 2023',
    type: 'PDF',
    size: '4.2 MB',
    status: 'Disponible',
    statusColor: 'bg-green-100 text-green-700',
    generated: 'Il y a 3 semaines'
  },
  {
    title: 'Rapport Mensuel - Émissions Carbone',
    date: 'Décembre 2023',
    type: 'PDF',
    size: '2.1 MB',
    status: 'Archivé',
    statusColor: 'bg-gray-100 text-gray-700',
    generated: 'Il y a 1 mois'
  }
]

const scheduledReports = [
  {
    title: 'Rapport Hebdomadaire',
    frequency: 'Tous les lundis',
    recipients: '3 emails',
    status: 'Actif',
    next: '15 Avr 2024'
  },
  {
    title: 'Rapport Mensuel',
    frequency: '1er du mois',
    recipients: '5 emails',
    status: 'Actif',
    next: '1 Mai 2024'
  }
]

export default function RapportsPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rapports</h1>
          <p className="text-gray-500 mt-1">Générez et téléchargez vos rapports d'analyse.</p>
        </div>
        <button className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-xl font-medium transition-colors">
          <FileText className="w-4 h-4" />
          Nouveau Rapport
        </button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <button className="bg-white rounded-xl p-4 border border-gray-100 hover:border-green-300 transition-colors text-left">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mb-3">
            <FileText className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="font-medium text-gray-900">Rapport Carbone</h3>
          <p className="text-sm text-gray-500">Émissions et objectifs</p>
        </button>
        <button className="bg-white rounded-xl p-4 border border-gray-100 hover:border-blue-300 transition-colors text-left">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="font-medium text-gray-900">Rapport Eau</h3>
          <p className="text-sm text-gray-500">Consommation irrigation</p>
        </button>
        <button className="bg-white rounded-xl p-4 border border-gray-100 hover:border-orange-300 transition-colors text-left">
          <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mb-3">
            <FileText className="w-5 h-5 text-orange-600" />
          </div>
          <h3 className="font-medium text-gray-900">Rapport Complet</h3>
          <p className="text-sm text-gray-500">Toutes les métriques</p>
        </button>
      </div>

      {/* Filtres */}
      <div className="flex items-center gap-4 mb-6">
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">
          <Calendar className="w-4 h-4" />
          Période
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">
          <Filter className="w-4 h-4" />
          Type
        </button>
      </div>

      {/* Liste des rapports */}
      <div className="bg-white rounded-2xl border border-gray-100 mb-8">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Rapports Générés</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {rapports.map((rapport, index) => (
            <div key={index} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{rapport.title}</h4>
                  <p className="text-sm text-gray-500">{rapport.date} • {rapport.type} • {rapport.size}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${rapport.statusColor}`}>
                  {rapport.status}
                </span>
                <span className="text-sm text-gray-400">{rapport.generated}</span>
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rapports Programmés */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Rapports Programmés</h3>
        <div className="space-y-4">
          {scheduledReports.map((report, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{report.title}</h4>
                  <p className="text-sm text-gray-500">{report.frequency} • {report.recipients}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">Prochain: {report.next}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    report.status === 'Actif' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {report.status}
                  </span>
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <AlertCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
