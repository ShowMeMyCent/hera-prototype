import { TrendingDown, TrendingUp, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import type { TrendPoint } from '../../types'
import { Badge } from '../ui/Badge'
import { Card } from '../ui/Card'
import { MiniLineChart } from '../analytics/MiniLineChart'

type StatusTone = 'blue' | 'turquoise' | 'green' | 'orange' | 'red'

export interface KPICardProps {
  icon: LucideIcon
  iconColorClass: string
  iconBgClass: string
  title: string
  status: string
  statusTone: StatusTone
  value: ReactNode
  description: string
  trend: TrendPoint[]
  trendQualifier: string
  trendDirection: 'up' | 'down'
  chartColor: string
}

function trendChangePct(trend: TrendPoint[]): number {
  if (trend.length < 2) return 0
  const first = trend[0].value
  const last = trend[trend.length - 1].value
  if (first === 0) return 0
  return ((last - first) / Math.abs(first)) * 100
}

export function KPICard({
  icon: Icon,
  iconColorClass,
  iconBgClass,
  title,
  status,
  statusTone,
  value,
  description,
  trend,
  trendQualifier,
  trendDirection,
  chartColor,
}: KPICardProps) {
  const changePct = trendChangePct(trend)
  const TrendIcon = trendDirection === 'up' ? TrendingUp : TrendingDown
  const trendToneClass = trendDirection === 'up' ? 'text-green-dark' : 'text-red'

  return (
    <Card className="flex flex-col gap-4 p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconBgClass}`}>
            <Icon className={`h-4.5 w-4.5 ${iconColorClass}`} />
          </div>
          <h3 className="text-sm font-semibold text-text">{title}</h3>
        </div>
        <Badge tone={statusTone}>{status}</Badge>
      </div>

      <div>
        <p className="text-3xl font-bold tracking-tight text-text sm:text-4xl">{value}</p>
        <p className="mt-1.5 text-sm text-text-secondary">{description}</p>
      </div>

      <div className="flex flex-col items-start justify-between gap-3 border-t border-border pt-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-semibold tracking-wide text-text-secondary uppercase">6-Hour Trend</p>
          <p className={`mt-1 flex items-center gap-1 text-sm font-semibold ${trendToneClass}`}>
            <TrendIcon className="h-3.5 w-3.5" />
            {changePct >= 0 ? '+' : ''}
            {changePct.toFixed(1)}% {trendQualifier}
          </p>
        </div>
        <MiniLineChart data={trend} colorVar={chartColor} />
      </div>
    </Card>
  )
}
