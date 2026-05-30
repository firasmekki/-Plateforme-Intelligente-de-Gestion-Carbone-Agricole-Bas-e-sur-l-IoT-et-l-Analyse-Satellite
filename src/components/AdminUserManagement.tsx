import { useState, useEffect } from 'react'
import { Users, Check, X, Clock, UserCheck, UserX, Search } from 'lucide-react'
import { getAllClients, getPendingClients, approveClient, rejectClient, type User } from '../auth/authStore'

interface AdminUserManagementProps {
  onBack?: () => void
}

export default function AdminUserManagement({ onBack }: AdminUserManagementProps) {
  const [clients, setClients] = useState<User[]>([])
  const [pendingClients, setPendingClients] = useState<User[]>([])
  const [activeTab, setActiveTab] = useState<'all' | 'pending'>('pending')
  const [searchTerm, setSearchTerm] = useState('')
  const [message, setMessage] = useState('')

  const loadData = () => {
    setClients(getAllClients())
    setPendingClients(getPendingClients())
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleApprove = (clientId: string, clientName: string) => {
    if (approveClient(clientId)) {
      setMessage(`✅ ${clientName} a été approuvé avec succès`)
      loadData()
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const handleReject = (clientId: string, clientName: string) => {
    if (rejectClient(clientId)) {
      setMessage(`❌ La demande de ${clientName} a été rejetée`)
      loadData()
      setTimeout(() => setMessage(''), 3000)
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
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Clients</h1>
          <p className="text-gray-500 mt-1">Gérer les demandes d'inscription et les comptes clients</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-2">
            <span className="text-sm text-yellow-700">
              <span className="font-semibold">{pendingClients.length}</span> demande{pendingClients.length > 1 ? 's' : ''} en attente
            </span>
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl">
          {message}
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
        {filteredClients.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">
              {activeTab === 'pending' ? 'Aucune demande en attente' : 'Aucun client trouvé'}
            </p>
            <p className="text-sm">
              {activeTab === 'pending' 
                ? 'Les nouvelles demandes d\'inscription apparaîtront ici' 
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
                        className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                        title="Approuver"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleReject(client.id, client.name)}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                        title="Rejeter"
                      >
                        <X className="w-5 h-5" />
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
