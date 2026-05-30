import { Shield, User, Leaf } from 'lucide-react'

interface RoleSelectionProps {
  onSelectRole: (role: 'admin' | 'client') => void
}

export default function RoleSelection({ onSelectRole }: RoleSelectionProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mb-4">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">EcoTrack</h1>
          <p className="text-gray-500 mt-1">Choose your access portal</p>
        </div>

        {/* Role Cards */}
        <div className="space-y-4">
          {/* Admin Option */}
          <button
            onClick={() => onSelectRole('admin')}
            className="w-full p-6 border-2 border-gray-100 hover:border-green-500 rounded-2xl transition-all group text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-green-100 group-hover:bg-green-500 rounded-xl flex items-center justify-center transition-colors">
                <Shield className="w-7 h-7 text-green-600 group-hover:text-white transition-colors" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                  Administrator
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Full access to dashboard, analytics, and team management
                </p>
              </div>
            </div>
          </button>

          {/* Client Option */}
          <button
            onClick={() => onSelectRole('client')}
            className="w-full p-6 border-2 border-gray-100 hover:border-blue-500 rounded-2xl transition-all group text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-100 group-hover:bg-blue-500 rounded-xl flex items-center justify-center transition-colors">
                <User className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  Client
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Access AI insights, recommendations, and personal analytics
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-400 mt-8">
          Secure access control system
        </p>
      </div>
    </div>
  )
}
