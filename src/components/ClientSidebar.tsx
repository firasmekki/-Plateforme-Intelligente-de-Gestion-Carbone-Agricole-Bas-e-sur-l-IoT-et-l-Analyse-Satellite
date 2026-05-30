import { 
  LayoutDashboard, 
  Leaf, 
  Zap, 
  Droplets, 
  Target, 
  FileText, 
  Settings, 
  HelpCircle,
  Sparkles
} from 'lucide-react'

const menuItems = [
  { icon: Sparkles, label: 'Agro AI Insights', active: true },
  { icon: LayoutDashboard, label: 'Dashboard' },
  { icon: Leaf, label: 'Mon Carbone Agricole' },
  { icon: Zap, label: 'Ressources' },
  { icon: Droplets, label: 'Irrigation' },
  { icon: Target, label: 'Objectifs' },
  { icon: FileText, label: 'Rapports' },
]

const generalItems = [
  { icon: Settings, label: 'Settings' },
  { icon: HelpCircle, label: 'Help' },
]

export default function ClientSidebar() {
  return (
    <aside className="w-64 bg-white h-full flex flex-col border-r border-gray-200">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
          <Leaf className="w-6 h-6 text-white" />
        </div>
        <div>
          <span className="text-xl font-semibold text-gray-800">AgroCarbon</span>
          <span className="text-xs text-green-600 block font-medium">Portail Exploitant</span>
        </div>
      </div>

      {/* Menu Label */}
      <div className="px-6 py-2">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Menu</span>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-4">
        {menuItems.map((item, index) => (
          <a
            key={index}
            href="#"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-colors ${
              item.active
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </a>
        ))}
      </nav>

      {/* General Label */}
      <div className="px-6 py-2 mt-4">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Général</span>
      </div>

      {/* General Items */}
      <div className="px-4 pb-6">
        {generalItems.map((item, index) => (
          <button
            key={index}
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
