import { useState } from 'react'
import { Search, Bell, ChevronDown, LogOut, User } from 'lucide-react'
import type { User as UserType } from '../auth/authStore'

interface HeaderProps {
  user: UserType
  onLogout: () => void
  currentView?: 'dashboard' | 'ai-insights'
  onNavigate?: (view: 'dashboard' | 'ai-insights') => void
}

export default function Header({ user, onLogout, currentView = 'dashboard', onNavigate }: HeaderProps) {
  const [showDropdown, setShowDropdown] = useState(false)

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const getAvatarColor = (role: string) => {
    return role === 'admin' ? 'bg-green-500' : 'bg-blue-500'
  }

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Left side - Navigation selon le rôle */}
      <div className="flex items-center gap-6">
        <nav className="flex items-center gap-6">
          {user.role === 'admin' ? (
            <>
              <button 
                onClick={() => onNavigate?.('dashboard')}
                className={`font-medium transition-colors ${
                  currentView === 'dashboard' ? 'text-green-500' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Home
              </button>
              <button 
                onClick={() => onNavigate?.('ai-insights')}
                className={`font-medium transition-colors ${
                  currentView === 'ai-insights' ? 'text-green-500' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                AI Insights
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => onNavigate?.('dashboard')}
                className={`font-medium transition-colors ${
                  currentView === 'dashboard' ? 'text-blue-500' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Dashboard
              </button>
              <button 
                onClick={() => onNavigate?.('ai-insights')}
                className={`font-medium transition-colors ${
                  currentView === 'ai-insights' ? 'text-blue-500' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                AI Insights
              </button>
            </>
          )}
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
        </button>

        {/* Profile avec dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-xl p-2 transition-colors"
          >
            <div className={`w-10 h-10 ${getAvatarColor(user.role)} rounded-full flex items-center justify-center text-white font-semibold`}>
              {getInitials(user.name)}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-gray-800">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown menu */}
          {showDropdown && (
            <>
              {/* Overlay pour fermer quand on clique ailleurs */}
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowDropdown(false)}
              />
              
              {/* Menu */}
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 z-20 py-2">
                {/* Info utilisateur */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="font-semibold text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <span className={`inline-block mt-2 text-xs px-2 py-1 rounded-full ${
                    user.role === 'admin' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {user.role === 'admin' ? 'Administrateur' : 'Client'}
                  </span>
                </div>

                {/* Options */}
                <div className="py-2">
                  <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors">
                    <User className="w-4 h-4" />
                    Profil
                  </button>
                  <button 
                    onClick={() => {
                      setShowDropdown(false)
                      onLogout()
                    }}
                    className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Déconnexion
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
