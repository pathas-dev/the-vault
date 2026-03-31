import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import type { RoundData } from '@/entities/round'
import { calculateRoundTotal } from '@/entities/round'
import { CHART_COLORS } from '@/shared/config'

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
            tick={{ fill: CHART_COLORS.text, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: CHART_COLORS.tooltip,
              border: `1px solid ${CHART_COLORS.tooltipBorder}`,
              borderRadius: '4px',
              color: CHART_COLORS.text,
              fontSize: 12,
            }}
            cursor={{ fill: CHART_COLORS.cursor }}
          />
          <Bar
            dataKey="value"
            fill={CHART_COLORS.bar}
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
