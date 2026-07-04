import { useState, useEffect, useRef } from 'react'
import {
  LayoutDashboard,
  Leaf,
  Zap,
  Droplets,
  Target,
  FileText,
  BarChart3,
  MapPin,
  Cloud,
  Wifi,
  Calculator,
  Settings,
  HelpCircle,
  LogOut,
  Download,
  Plus,
  AlertTriangle,
  Search,
  Bell,
  ChevronDown,
  User,
  Users
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts'
import IrrigationPage from './components/IrrigationPage'
import ObjectifsPage from './components/ObjectifsPage'
import RapportsPage from './components/RapportsPage'
import AnalyticsPage from './components/AnalyticsPage'
import CarboneDetailPage from './components/CarboneDetailPage'
import ClientParcelles from './components/ClientParcelles'
import SatelliteFarmV2 from './components/SatelliteFarmV2'
import AdminParcelles from './components/AdminParcelles'
import CarteParcelles from './components/CarteParcelles'
import MeteoWidget from './components/MeteoWidget'
import CapteursIoT from './components/CapteursIoT'
import CalculateurCarbone from './components/CalculateurCarbone'
import AdminCapteurs from './components/AdminCapteurs'
import AdminUserManagement from './components/AdminUserManagement'
import ClientDashboard from './components/ClientDashboard'
import { api } from './services/api'

// Types simples
interface User {
  id: string
  email: string
  role: 'admin' | 'client'
  name: string
  status: 'active' | 'pending' | 'rejected'
  createdAt: string
}

// Client menu items - defined outside component for use in initialization
const clientMenuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'carbone', label: 'Mon Carbone', icon: Leaf },
  { id: 'irrigation', label: 'Mon Irrigation', icon: Droplets },
  { id: 'mes-parcelles', label: 'Mes Parcelles', icon: MapPin },
  { id: 'satellite-farm', label: 'Satellite Farm', icon: MapPin },
  { id: 'meteo', label: 'Météo', icon: Cloud },
  { id: 'capteurs', label: 'Capteurs IoT', icon: Wifi },
  { id: 'calculateur', label: 'Calculateur', icon: Calculator },
  { id: 'rapports', label: 'Mes Rapports', icon: FileText },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
]

type View = 'dashboard' | 'carbone' | 'irrigation' | 'objectifs' | 'rapports' | 'analytics' | 'carte' | 'meteo' | 'capteurs' | 'calculateur' | 'mes-parcelles' | 'satellite-farm' | 'admin-capteurs' | 'admin-parcelles' | 'admin-users' | 'parametres'

// Login / Inscription avec API Backend
function SimpleLogin({ onLogin }: { onLogin: (user: User) => void }) {
  const [view, setView] = useState<'login' | 'register'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const resetForm = () => { setName(''); setEmail(''); setPassword(''); setError(''); setSuccess('') }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Erreur de connexion')
      if (data.token) api.setToken(data.token)
      const user: User = {
        id: data.user.id.toString(),
        email: data.user.email,
        role: data.user.role,
        name: data.user.name,
        status: data.user.status,
        createdAt: data.user.created_at || new Date().toISOString()
      }
      localStorage.setItem('agrocarbon_user', JSON.stringify(user))
      onLogin(user)
    } catch (err: any) {
      setError(err.message || 'Email ou mot de passe incorrect')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role: 'client' })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Erreur d\'inscription')
      setSuccess('Compte créé ! En attente d\'approbation par l\'administrateur.')
      setTimeout(() => { resetForm(); setView('login') }, 2500)
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'inscription')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">AgroCarbon</h1>
          <p className="text-gray-500 mt-1">{view === 'login' ? 'Plateforme agricole' : 'Créer un compte'}</p>
        </div>

        {/* Onglets */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          <button
            onClick={() => { resetForm(); setView('login') }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'login' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Connexion
          </button>
          <button
            onClick={() => { resetForm(); setView('register') }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'register' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Inscription
          </button>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm">{error}</div>}
        {success && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-xl text-sm">{success}</div>}

        {view === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="votre@email.com" required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent" disabled={loading} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent" disabled={loading} />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white rounded-xl font-medium transition-colors">
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jean Dupont" required minLength={2}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent" disabled={loading} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="votre@email.com" required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent" disabled={loading} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent" disabled={loading} />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white rounded-xl font-medium transition-colors">
              {loading ? 'Inscription...' : 'Créer mon compte'}
            </button>
            <p className="text-xs text-center text-gray-400">Votre compte sera activé après validation par un administrateur.</p>
          </form>
        )}
      </div>
    </div>
  )
}

// Layout CLIENT (menu restreint)
function ClientLayout({ user, onLogout }: { user: User; onLogout: () => void }) {
  // Récupérer la vue depuis l'URL ou localStorage ou utiliser 'dashboard' par défaut
  const [currentView, setCurrentView] = useState<View>(() => {
    // Essayer d'abord de lire l'URL
    const path = window.location.pathname
    const pathPart = path.replace('/client/', '').replace('/client', '')
    if (pathPart && clientMenuItems.some(item => item.id === pathPart)) {
      return pathPart as View
    }
    // Sinon utiliser localStorage
    const saved = localStorage.getItem('client_currentView') as View
    return saved || 'dashboard'
  })
  // Sauvegarder la vue quand elle change + mettre à jour l'URL
  const isFirstRender = useRef(true)
  useEffect(() => {
    localStorage.setItem('client_currentView', currentView)
    // Skip URL update on first render to preserve initial URL
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    // Changer l'URL sans recharger la page
    const url = currentView === 'dashboard' ? '/client' : `/client/${currentView}`
    window.history.replaceState({}, '', url)
  }, [currentView])

  // Effacer la vue sauvegardée à la déconnexion
  const handleLogout = () => {
    localStorage.removeItem('client_currentView')
    onLogout()
  }

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <ClientDashboard user={user} />
      case 'carbone':
        return <CarboneDetailPage />
      case 'irrigation':
        return <IrrigationPage />
      case 'objectifs':
        return <ObjectifsPage />
      case 'rapports':
        return <RapportsPage />
      case 'analytics':
        return <AnalyticsPage />
      case 'mes-parcelles':
        return <ClientParcelles />
      case 'satellite-farm':
        return <SatelliteFarmV2 />
      case 'carte':
        return <CarteParcelles />
      case 'meteo':
        return <MeteoWidget />
      case 'capteurs':
        return <CapteursIoT />
      case 'calculateur':
        return <CalculateurCarbone />
      default:
        return <DashboardOverview />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Client Simplifié */}
      <header className="sticky top-0 z-40 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">AgroCarbon</span>
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Task"
              className="pl-10 pr-4 py-2 w-64 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Notification */}
          <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Profile avec nom complet */}
          <div className="relative group">
            <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-xl p-2 transition-colors">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                {user.name.charAt(0)}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <button 
                onClick={handleLogout}
                className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors rounded-xl"
              >
                <LogOut className="w-4 h-4" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className={`flex ${currentView === 'satellite-farm' ? 'h-[calc(100vh-4rem)]' : ''}`}>
        {/* Sidebar Client */}
        <aside className={`w-64 bg-white flex flex-col border-r border-gray-200 ${currentView === 'satellite-farm' ? 'h-full' : 'sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto self-start'}`}>
          <div className="p-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-semibold text-gray-800">Mon Espace</span>
              <span className="text-xs text-blue-600 block font-medium">Portail Client</span>
            </div>
          </div>

          <div className="px-6 py-2">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Menu</span>
          </div>

          <nav className="flex-1 px-4">
            {clientMenuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id as View)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-colors text-left ${
                  currentView === item.id
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

        </aside>

        <main className={currentView === 'satellite-farm' ? 'flex-1 overflow-hidden relative' : 'flex-1'}>
          {currentView === 'satellite-farm' ? (
            <div className="absolute inset-0">
              <SatelliteFarmV2 />
            </div>
          ) : (
            <div>
              {renderContent()}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

// Layout ADMIN (navigation complète)
function AdminLayout({ user, onLogout }: { user: User; onLogout: () => void }) {
  // Récupérer la vue sauvegardée ou utiliser 'dashboard' par défaut
  const [currentView, setCurrentView] = useState<View>(() => {
    const saved = localStorage.getItem('admin_currentView') as View
    return saved || 'dashboard'
  })
  // Sauvegarder la vue quand elle change + mettre à jour l'URL
  useEffect(() => {
    localStorage.setItem('admin_currentView', currentView)
    // Changer l'URL sans recharger la page
    const url = currentView === 'dashboard' ? '/admin' : `/admin/${currentView}`
    window.history.replaceState({}, '', url)
  }, [currentView])

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'carbone', label: 'Carbone Agricole', icon: Leaf, badge: '12+' },
    { id: 'irrigation', label: 'Irrigation', icon: Droplets },
    { id: 'objectifs', label: 'Objectifs', icon: Target },
    { id: 'rapports', label: 'Rapports', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'admin-parcelles', label: 'Toutes les Parcelles', icon: MapPin, badge: 'ADMIN' },
    { id: 'meteo', label: 'Météo', icon: Cloud },
    { id: 'admin-capteurs', label: 'Gestion Capteurs', icon: Wifi, badge: 'ADMIN' },
    { id: 'admin-users', label: 'Demandes de Comptes', icon: Users, badge: 'ADMIN' },
    { id: 'calculateur', label: 'Calculateur', icon: Calculator },
  ]

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardOverview />
      case 'carbone':
        return <CarboneDetailPage />
      case 'irrigation':
        return <IrrigationPage />
      case 'objectifs':
        return <ObjectifsPage />
      case 'rapports':
        return <RapportsPage />
      case 'analytics':
        return <AnalyticsPage />
      case 'carte':
        return <CarteParcelles />
      case 'meteo':
        return <MeteoWidget />
      case 'capteurs':
        return <CapteursIoT />
      case 'calculateur':
        return <CalculateurCarbone />
      case 'admin-capteurs':
        return <AdminCapteurs />
      case 'admin-parcelles':
        return <AdminParcelles />
      case 'admin-users':
        return <AdminUserManagement />
      case 'parametres':
        return <ParametresPage user={user} onLogout={onLogout} />
      default:
        return <DashboardOverview />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Original */}
      <header className="sticky top-0 z-40 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
        {/* Left side - Navigation */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 mr-4">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">AgroCarbon</span>
          </div>
          <nav className="flex items-center gap-6">
            <button 
              onClick={() => setCurrentView('dashboard')}
              className={`font-medium transition-colors ${
                currentView === 'dashboard' ? 'text-green-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Home
            </button>
            <button 
              onClick={() => setCurrentView('carbone')}
              className={`font-medium transition-colors ${
                currentView === 'carbone' ? 'text-green-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Agro AI Insights
            </button>
          </nav>
        </div>

        {/* Right side - Search and Profile */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Task"
              className="pl-10 pr-4 py-2 w-64 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Notification */}
          <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Profile avec menu déroulant */}
          <div className="relative group">
            <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-xl p-2 transition-colors">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                {user.name.charAt(0)}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>
            
            {/* Dropdown menu */}
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <button 
                onClick={onLogout}
                className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors rounded-xl"
              >
                <LogOut className="w-4 h-4" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <aside className="w-64 bg-white flex flex-col border-r border-gray-200 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto self-start">
          {/* Logo */}
          <div className="p-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-semibold text-gray-800">AgroCarbon</span>
              <span className="text-xs text-green-600 block font-medium">Portail Admin</span>
            </div>
          </div>

          {/* Menu Label */}
          <div className="px-6 py-2">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Menu</span>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 px-4">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id as View)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-colors text-left ${
                  currentView === item.id
                    ? 'bg-green-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                {item.badge && (
                  <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
                    currentView === item.id ? 'bg-white text-green-500' : 'bg-green-100 text-green-600'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* General Label */}
          <div className="px-6 py-2 mt-4">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Général</span>
          </div>

          {/* General Items */}
          <div className="px-4 pb-6">
            <button
              onClick={() => setCurrentView('parametres')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-colors text-left ${
                currentView === 'parametres' ? 'bg-green-500 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">Paramètres</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 text-gray-600 hover:bg-gray-100 transition-colors text-left">
              <HelpCircle className="w-5 h-5" />
              <span className="font-medium">Aide</span>
            </button>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

// Page Paramètres Admin
function ParametresPage({ user, onLogout }: { user: User; onLogout: () => void }) {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-1">Paramètres</h2>
      <p className="text-gray-500 mb-8">Gérez votre compte et vos préférences</p>

      {/* Profil */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-green-500" /> Profil
        </h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Nom</label>
            <input
              type="text"
              defaultValue={user.name}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
            <input
              type="email"
              defaultValue={user.email}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Rôle</label>
            <input
              type="text"
              value={user.role === 'admin' ? 'Administrateur' : 'Client'}
              disabled
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
            />
          </div>
        </div>
        <button className="mt-4 px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm rounded-xl font-medium transition-colors">
          Enregistrer les modifications
        </button>
      </div>

      {/* Sécurité */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-green-500" /> Sécurité
        </h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Mot de passe actuel</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Nouveau mot de passe</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
        <button className="mt-4 px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm rounded-xl font-medium transition-colors">
          Changer le mot de passe
        </button>
      </div>

      {/* Déconnexion */}
      <div className="bg-white rounded-2xl border border-red-100 p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <LogOut className="w-5 h-5 text-red-500" /> Session
        </h3>
        <p className="text-sm text-gray-500 mb-4">Déconnectez-vous de votre compte administrateur.</p>
        <button
          onClick={onLogout}
          className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm rounded-xl font-medium transition-colors"
        >
          Se déconnecter
        </button>
      </div>
    </div>
  )
}

// Dashboard original avec graphiques
function DashboardOverview() {
  const carbonData = [
    { name: 'Champ Blé', value: 4500, color: '#eab308' },
    { name: 'Champ Maïs', value: 6200, color: '#22c55e' },
    { name: 'Vergers', value: 3800, color: '#f97316' },
    { name: 'Serres', value: 5200, color: '#3b82f6' },
    { name: 'Pâturages', value: 2800, color: '#8b5cf6' },
  ]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard Agricole</h2>
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
          <div className="h-2 bg-gray-100 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-green-500 rounded-full" style={{ width: '85%' }} />
          </div>
          <p className="text-xs text-gray-400 mt-2">vs Objectif (15,000) - Optimisation: 85%</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-orange-600" />
            </div>
            <span className="text-gray-500 text-sm">Carburant Utilisé</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">1,240 <span className="text-sm font-normal text-gray-500">L</span></p>
          <div className="h-2 bg-gray-100 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-orange-500 rounded-full" style={{ width: '78%' }} />
          </div>
          <p className="text-xs text-gray-400 mt-2">vs Objectif (1,100 L) - Efficacité: 78%</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Droplets className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-gray-500 text-sm">Eau d'Irrigation</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">45,200 <span className="text-sm font-normal text-gray-500">m³</span></p>
          <div className="h-2 bg-gray-100 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-red-500 rounded-full" style={{ width: '112%' }} />
          </div>
          <p className="text-xs text-red-400 mt-2">vs Objectif (40,000 m³) - Surconsommation: +12%</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-gray-500 text-sm">Objectifs Agricoles</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">68 <span className="text-sm font-normal text-gray-500">%</span></p>
          <div className="h-2 bg-gray-100 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-purple-500 rounded-full" style={{ width: '68%' }} />
          </div>
          <p className="text-xs text-gray-400 mt-2">vs Objectif (80%) - Progression: 68%</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Carbon Emissions Chart */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 lg:col-span-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Émissions par Exploitation</h3>
          </div>
          <div className="flex gap-6">
            <div className="flex-1 min-w-0 h-48">
              <ResponsiveContainer width="100%" height={192}>
                <BarChart data={carbonData}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
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
                Le Champ Maïs génère le plus d'émissions (6.2T CO₂e), suivi des Serres (5.2T) et du Champ Blé (4.5T). Les Vergers et Pâturages ont les émissions les plus faibles.
              </p>
            </div>
          </div>
        </div>

        {/* Sustainability Goals */}
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

      {/* Team & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Équipe Agricole</h3>
            <button className="flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-100 transition-colors">
              <Plus className="w-4 h-4" />
              Ajouter Membre
            </button>
          </div>
          <div className="space-y-4">
            {[
              { name: 'Jean Dupont', role: 'Agronome', task: 'Optimisation des cultures de blé', status: 'Active' },
              { name: 'Marie Martin', role: 'Technicienne', task: 'Analyse de l\'irrigation', status: 'In Review' },
              { name: 'Pierre Bernard', role: 'Responsable', task: 'Rapport mensuel carbone', status: 'Active' },
            ].map((member, i) => (
              <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-medium">{member.name.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{member.name}</h4>
                  <p className="text-sm text-gray-500">{member.role} • {member.task}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  member.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {member.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Activité Récente</h3>
          <div className="space-y-4">
            {[
              { text: 'Rapport carbone généré', time: 'Il y a 2h', icon: FileText },
              { text: 'Nouvelle donnée capteur reçue', time: 'Il y a 4h', icon: Wifi },
              { text: 'Objectif irrigation atteint', time: 'Il y a 6h', icon: Target },
              { text: 'Alerte surconsommation eau', time: 'Il y a 8h', icon: AlertTriangle },
            ].map((activity, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <activity.icon className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.text}</p>
                  <p className="text-xs text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function App() {
  const [user, setUser] = useState<User | null>(() => {
    // Récupérer l'utilisateur du localStorage au chargement
    const savedUser = localStorage.getItem('agrocarbon_user')
    return savedUser ? JSON.parse(savedUser) : null
  })

  const handleLogin = (newUser: User) => {
    setUser(newUser)
  }

  const handleLogout = () => {
    localStorage.removeItem('agrocarbon_user')
    setUser(null)
  }

  if (!user) {
    return <SimpleLogin onLogin={handleLogin} />
  }

  // Rediriger vers le bon layout selon le rôle
  if (user.role === 'client') {
    return <ClientLayout user={user} onLogout={handleLogout} />
  }

  return <AdminLayout user={user} onLogout={handleLogout} />
}

export default App
