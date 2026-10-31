import { Line, LineChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { TrendPoint } from '../../types'

interface MiniLineChartProps {
  data: TrendPoint[]
  colorVar: string
  unit?: string
}

export function MiniLineChart({ data, colorVar, unit = '' }: MiniLineChartProps) {
  return (
    <div className="h-16 w-full sm:w-44">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
          <Tooltip
            cursor={{ stroke: colorVar, strokeWidth: 1, strokeDasharray: '3 3' }}
            contentStyle={{
              borderRadius: 10,
              border: '1px solid var(--color-border)',
              boxShadow: '0 4px 12px rgba(23,33,43,0.08)',
              fontSize: 12,
              padding: '6px 10px',
            }}
            formatter={(value) => [`${value}${unit}`, '']}
            labelFormatter={() => ''}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={colorVar}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
            isAnimationActive
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
