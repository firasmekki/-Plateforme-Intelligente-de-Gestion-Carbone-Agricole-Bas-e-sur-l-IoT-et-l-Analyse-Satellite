import { useState } from 'react'
import ClientSidebar from './ClientSidebar'
import Header from './Header'
import AIInsights from './AIInsights'
import ClientDashboard from './ClientDashboard'
import type { User } from '../auth/authStore'

interface ClientLayoutProps {
  user: User
  onLogout: () => void
}

export default function ClientLayout({ user, onLogout }: ClientLayoutProps) {
  const [currentView, setCurrentView] = useState<'dashboard' | 'ai-insights'>('dashboard')

  return (
    <div className="flex h-screen bg-gray-50">
      <ClientSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          user={user} 
          onLogout={onLogout} 
          currentView={currentView}
          onNavigate={setCurrentView}
        />
        <main className="flex-1 overflow-y-auto">
          {currentView === 'dashboard' ? (
            <ClientDashboard user={user} />
          ) : (
            <AIInsights />
          )}
        </main>
      </div>
    </div>
  )
}
