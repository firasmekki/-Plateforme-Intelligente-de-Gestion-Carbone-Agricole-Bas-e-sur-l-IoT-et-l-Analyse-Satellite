import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'Achieved', value: 76, color: '#22c55e' },
  { name: 'In Progress', value: 15, color: '#3b82f6' },
  { name: 'Pending', value: 9, color: '#f97316' },
]

export default function SustainabilityChart() {
  return (
    <div className="flex flex-col items-center">
      {/* Chart container */}
      <div className="relative w-48 h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={75}
              paddingAngle={2}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-green-500">76%</span>
          <span className="text-xs text-gray-500">Complete</span>
        </div>
      </div>

      {/* Legend - below the chart */}
      <div className="flex items-center gap-4 mt-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-xs text-gray-600 whitespace-nowrap">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
