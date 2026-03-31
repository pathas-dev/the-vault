import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import type { RoundData } from '@/entities/round'
import { calculateRoundTotal } from '@/entities/round'

interface RoundChartProps {
  rounds: RoundData[]
}

export function RoundChart({ rounds }: RoundChartProps) {
  const data = rounds.map((round, i) => ({
    name: `R${i + 1}`,
    value: calculateRoundTotal(round),
  }))

  return (
    <div className="w-full h-32 mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barCategoryGap="20%">
          <XAxis
            dataKey="name"
            tick={{ fill: '#dfe2eb', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#181c22',
              border: '1px solid rgba(255,198,55,0.2)',
              borderRadius: '4px',
              color: '#dfe2eb',
              fontSize: 12,
            }}
            cursor={{ fill: 'rgba(255,198,55,0.05)' }}
          />
          <Bar
            dataKey="value"
            fill="#ffc637"
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
