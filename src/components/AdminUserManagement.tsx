import { useState, useEffect } from 'react'
import { Users, Check, X, Clock, UserCheck, UserX, Search, RefreshCw } from 'lucide-react'
import { getAllClients, getPendingClients, approveClient, rejectClient, type User } from '../auth/authStore'

export default function AdminUserManagement() {
  const [clients, setClients] = useState<User[]>([])
  const [pendingClients, setPendingClients] = useState<User[]>([])
  const [activeTab, setActiveTab] = useState<'all' | 'pending'>('pending')
  const [searchTerm, setSearchTerm] = useState('')
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const loadData = async () => {
    setLoading(true)
    try {
      const [allClients, pending] = await Promise.all([getAllClients(), getPendingClients()])
      setClients(allClients)
      setPendingClients(pending)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const showMessage = (text: string, type: 'success' | 'error' | 'info') => {
    setMessage({ text, type })
    setTimeout(() => setMessage(null), 3500)
  }

  const handleApprove = async (clientId: string, clientName: string) => {
    setActionLoading(clientId)
    const ok = await approveClient(clientId)
    setActionLoading(null)
    if (ok) {
      showMessage(`${clientName} a été approuvé avec succès`, 'success')
      await loadData()
    } else {
      showMessage(`Erreur lors de l'approbation de ${clientName}`, 'error')
    }
  }

  const handleReject = async (clientId: string, clientName: string) => {
    setActionLoading(clientId)
    const ok = await rejectClient(clientId)
    setActionLoading(null)
    if (ok) {
      showMessage(`La demande de ${clientName} a été rejetée`, 'error')
      await loadData()
    } else {
      showMessage(`Erreur lors du rejet de ${clientName}`, 'error')
    }
  }

  const filteredClients = (activeTab === 'pending' ? pendingClients : clients).filter(
    client => 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"><UserCheck className="w-3 h-3" /> Actif</span>
      case 'pending':
        return <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full"><Clock className="w-3 h-3" /> En attente</span>
      case 'rejected':
        return <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full"><UserX className="w-3 h-3" /> Rejeté</span>
      default:
        return null
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Demandes de Création de Comptes</h1>
          <p className="text-gray-500 mt-1">Gérer les demandes d'inscription et approuver les nouveaux comptes clients</p>
        </div>
        <div className="flex items-center gap-3">
          {pendingClients.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-2">
              <span className="text-sm text-yellow-700">
                <span className="font-semibold">{pendingClients.length}</span> demande{pendingClients.length > 1 ? 's' : ''} en attente
              </span>
            </div>
          )}
          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition-colors text-sm font-medium"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
        </div>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
            <Clock className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{pendingClients.length}</p>
            <p className="text-xs text-gray-500">En attente</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
            <UserCheck className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{clients.filter(c => c.status === 'active').length}</p>
            <p className="text-xs text-gray-500">Approuvés</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
            <UserX className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{clients.filter(c => c.status === 'rejected').length}</p>
            <p className="text-xs text-gray-500">Rejetés</p>
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-6 p-4 rounded-xl border text-sm font-medium ${
          message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' :
          message.type === 'error' ? 'bg-red-50 border-red-200 text-red-700' :
          'bg-blue-50 border-blue-200 text-blue-700'
        }`}>
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded-xl font-medium transition-colors ${
            activeTab === 'pending' 
              ? 'bg-yellow-500 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            En attente ({pendingClients.length})
          </span>
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl font-medium transition-colors ${
            activeTab === 'all' 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <span className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Tous les clients ({clients.length})
          </span>
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher par nom ou email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Clients List */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">
            <RefreshCw className="w-10 h-10 mx-auto mb-3 animate-spin text-gray-300" />
            <p className="text-sm">Chargement des demandes...</p>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">
              {activeTab === 'pending' ? 'Aucune demande en attente' : 'Aucun client trouvé'}
            </p>
            <p className="text-sm">
              {activeTab === 'pending'
                ? "Les nouvelles demandes d'inscription apparaîtront ici"
                : 'Essayez de modifier votre recherche'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredClients.map((client) => (
              <div key={client.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                    <span className="text-lg font-semibold text-blue-600">
                      {client.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{client.name}</h3>
                    <p className="text-sm text-gray-500">{client.email}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Inscrit le {new Date(client.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {getStatusBadge(client.status)}

                  {client.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(client.id, client.name)}
                        disabled={actionLoading === client.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium disabled:opacity-50"
                        title="Approuver"
                      >
                        <Check className="w-4 h-4" />
                        Approuver
                      </button>
                      <button
                        onClick={() => handleReject(client.id, client.name)}
                        disabled={actionLoading === client.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium disabled:opacity-50"
                        title="Rejeter"
                      >
                        <X className="w-4 h-4" />
                        Rejeter
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
