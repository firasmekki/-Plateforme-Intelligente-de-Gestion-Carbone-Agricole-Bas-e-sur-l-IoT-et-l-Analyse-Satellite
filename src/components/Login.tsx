import { useState } from 'react'
import { Leaf, Mail, Lock, UserPlus, Shield, User as UserIcon, AlertCircle, CheckCircle } from 'lucide-react'
import { login, registerClient, initAuth, type User } from '../auth/authStore'

interface LoginProps {
  onLogin: (user: User) => void
}

type View = 'select-role' | 'login' | 'register'

export default function Login({ onLogin }: LoginProps) {
  const [view, setView] = useState<View>('select-role')
  const [selectedRole, setSelectedRole] = useState<'admin' | 'client' | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  // Initialiser l'auth au chargement
  initAuth()

  const handleSelectRole = (role: 'admin' | 'client') => {
    setSelectedRole(role)
    setView('login')
    setError('')
    setSuccess('')
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const result = login(email, password)
    
    if (result.success && result.user) {
      // Vérifier que le rôle correspond
      if (selectedRole && result.user.role !== selectedRole) {
        setError(`Ce compte n'est pas un compte ${selectedRole === 'admin' ? 'administrateur' : 'client'}`)
        setLoading(false)
        return
      }
      onLogin(result.user)
    } else {
      setError(result.message)
    }
    
    setLoading(false)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const result = registerClient(email, password, name)
    
    if (result.success) {
      setSuccess(result.message)
      // Rediriger vers login après 2 secondes
      setTimeout(() => {
        setView('login')
        setSuccess('')
        setEmail('')
        setPassword('')
        setName('')
      }, 2000)
    } else {
      setError(result.message)
    }
    
    setLoading(false)
  }

  // Vue de sélection du rôle
  if (view === 'select-role') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mb-4">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">EcoTrack</h1>
            <p className="text-gray-500 mt-1">Choisissez votre type de compte</p>
          </div>

          {/* Role Cards */}
          <div className="space-y-4">
            <button
              onClick={() => handleSelectRole('admin')}
              className="w-full p-6 border-2 border-gray-100 hover:border-green-500 rounded-2xl transition-all group text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-green-100 group-hover:bg-green-500 rounded-xl flex items-center justify-center transition-colors">
                  <Shield className="w-7 h-7 text-green-600 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                    Administrateur
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Accès complet au système
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleSelectRole('client')}
              className="w-full p-6 border-2 border-gray-100 hover:border-blue-500 rounded-2xl transition-all group text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-100 group-hover:bg-blue-500 rounded-xl flex items-center justify-center transition-colors">
                  <UserIcon className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    Client
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Accès aux AI Insights
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Vue de connexion
  if (view === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md">
          {/* Back button */}
          <button
            onClick={() => setView('select-role')}
            className="text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-1 text-sm"
          >
            ← Retour
          </button>

          {/* Logo */}
          <div className="flex flex-col items-center mb-6">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${
              selectedRole === 'admin' ? 'bg-green-500' : 'bg-blue-500'
            }`}>
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Connexion</h1>
            <p className="text-gray-500 mt-1">
              {selectedRole === 'admin' ? 'Espace Administrateur' : 'Espace Client'}
            </p>
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-xl flex items-center gap-2 text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-xl flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4" />
              {success}
            </div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="votre@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl text-white font-semibold transition-colors ${
                selectedRole === 'admin' 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-blue-500 hover:bg-blue-600'
              } disabled:opacity-50`}
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          {/* Lien inscription (uniquement pour clients) */}
          {selectedRole === 'client' && (
            <div className="mt-6 text-center">
              <p className="text-gray-500 text-sm">
                Pas encore de compte ?{' '}
                <button
                  onClick={() => {
                    setView('register')
                    setError('')
                    setEmail('')
                    setPassword('')
                  }}
                  className="text-blue-500 hover:text-blue-600 font-medium"
                >
                  Créer un compte
                </button>
              </p>
            </div>
          )}

          {/* Info admin */}
          {selectedRole === 'admin' && (
            <div className="mt-6 p-4 bg-gray-50 rounded-xl text-sm text-gray-600">
              <p className="font-medium mb-1">Compte par défaut :</p>
              <p>Email: admin@ecotrack.com</p>
              <p>Mot de passe: admin123</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Vue d'inscription (client uniquement)
  if (view === 'register') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md">
          {/* Back button */}
          <button
            onClick={() => setView('login')}
            className="text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-1 text-sm"
          >
            ← Retour
          </button>

          {/* Logo */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-4">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Créer un compte</h1>
            <p className="text-gray-500 mt-1">Inscription Client</p>
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-xl flex items-center gap-2 text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-xl flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4" />
              {success}
            </div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Jean Dupont"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="votre@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-colors disabled:opacity-50"
            >
              {loading ? 'Inscription...' : 'Créer mon compte'}
            </button>
          </form>

          <div className="mt-4 p-3 bg-yellow-50 rounded-xl text-sm text-yellow-700">
            <p>⚠️ Après inscription, votre compte devra être approuvé par l'administrateur avant de pouvoir vous connecter.</p>
          </div>
        </div>
      </div>
    )
  }

  return null
}
