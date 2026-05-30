import { 
  LayoutDashboard, 
  Leaf, 
  Zap, 
  Droplets, 
  Target, 
  FileText, 
  BarChart3, 
  Users, 
  Settings, 
  HelpCircle, 
  LogOut 
} from 'lucide-react'

const defaultMenuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: Leaf, label: 'Emissions', badge: '12+' },
  { icon: Zap, label: 'Energy' },
  { icon: Droplets, label: 'Water' },
  { icon: Target, label: 'Goals' },
  { icon: FileText, label: 'Reports' },
  { icon: BarChart3, label: 'Analytics' },
  { icon: Users, label: 'Team' },
]

const generalItems = [
  { icon: Settings, label: 'Settings' },
  { icon: HelpCircle, label: 'Help' },
  { icon: LogOut, label: 'Logout' },
]

interface SidebarProps {
  onLogout?: () => void
}

export default function Sidebar({ onLogout }: SidebarProps) {
  return (
    <aside className="w-64 bg-white h-full flex flex-col border-r border-gray-200">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
          <Leaf className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-semibold text-gray-800">EcoTrack</span>
      </div>

      {/* Menu Label */}
      <div className="px-6 py-2">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Menu</span>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-4">
        {defaultMenuItems.map((item, index) => (
          <a
            key={index}
            href="#"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-colors ${
              item.active
                ? 'bg-green-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
            {item.badge && (
              <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
                item.active ? 'bg-white text-green-500' : 'bg-green-100 text-green-600'
              }`}>
                {item.badge}
              </span>
            )}
          </a>
        ))}
      </nav>

      {/* General Label */}
      <div className="px-6 py-2 mt-4">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">General</span>
      </div>

      {/* General Items */}
      <div className="px-4 pb-6">
        {generalItems.map((item, index) => (
          <button
            key={index}
            onClick={item.label === 'Logout' ? onLogout : undefined}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 text-gray-600 hover:bg-gray-100 transition-colors text-left"
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </aside>
  )
}
