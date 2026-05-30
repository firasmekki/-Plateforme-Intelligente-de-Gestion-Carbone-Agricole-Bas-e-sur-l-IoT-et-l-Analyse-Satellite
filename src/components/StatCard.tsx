import { Leaf, Zap, Droplets, Target, Info } from 'lucide-react'

interface StatCardProps {
  icon: 'emissions' | 'energy' | 'water' | 'goal'
  title: string
  value: string
  unit: string
  target: string
  efficiency: string
}

const iconMap = {
  emissions: { Icon: Leaf, color: 'bg-blue-100 text-blue-600' },
  energy: { Icon: Zap, color: 'bg-green-100 text-green-600' },
  water: { Icon: Droplets, color: 'bg-orange-100 text-orange-600' },
  goal: { Icon: Target, color: 'bg-purple-100 text-purple-600' },
}

export default function StatCard({ icon, title, value, unit, target, efficiency }: StatCardProps) {
  const { Icon, color } = iconMap[icon]

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
        <Info className="w-4 h-4 text-gray-300" />
      </div>
      
      <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
      <div className="flex items-baseline gap-1 mb-3">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
        <span className="text-sm text-gray-500">{unit}</span>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">{target}</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-500 rounded-full"
            style={{ 
              width: efficiency.includes('85') ? '85%' : 
                     efficiency.includes('92') ? '92%' : 
                     efficiency.includes('78') ? '78%' : '89%' 
            }}
          />
        </div>
        <p className="text-xs text-gray-500">{efficiency}</p>
      </div>
    </div>
  )
}
