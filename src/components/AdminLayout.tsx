import { useState } from 'react'
import AdminSidebar from './AdminSidebar'
import Header from './Header'
import Dashboard from './Dashboard'
import AdminUserManagement from './AdminUserManagement'
import CarboneDetailPage from './CarboneDetailPage'
import type { User } from '../auth/authStore'

type AdminView = 'dashboard' | 'carbone' | 'users'

interface AdminLayoutProps {
  user: User
  onLogout: () => void
}

export default function AdminLayout({ user, onLogout }: AdminLayoutProps) {
  const [currentView, setCurrentView] = useState<AdminView>('dashboard')
  const [headerView, setHeaderView] = useState<'dashboard' | 'ai-insights'>('dashboard')

  const handleSidebarNavigate = (view: AdminView) => {
    if (view === 'users') {
      setCurrentView('users')
    } else {
      setCurrentView(view)
      setHeaderView('dashboard')
    }
  }

  const renderContent = () => {
    if (currentView === 'users') {
      return <AdminUserManagement onBack={() => setCurrentView('dashboard')} />
    }

    switch (currentView) {
      case 'dashboard':
        return <Dashboard />
      case 'carbone':
        return <CarboneDetailPage />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar 
        onNavigate={handleSidebarNavigate}
        currentView={currentView}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          user={user} 
          onLogout={onLogout} 
          currentView={headerView}
          onNavigate={setHeaderView}
        />
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}
