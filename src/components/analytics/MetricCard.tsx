import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Badge } from '../ui/Badge'
import { Card } from '../ui/Card'

type StatusTone = 'blue' | 'turquoise' | 'green' | 'orange' | 'red'

interface MetricCardProps {
  icon: LucideIcon
  iconColorClass: string
  iconBgClass: string
  title: string
  status: string
  statusTone: StatusTone
  value: ReactNode
  description: string
  children: ReactNode
}

export function MetricCard({
  icon: Icon,
  iconColorClass,
  iconBgClass,
  title,
  status,
  statusTone,
  value,
  description,
  children,
}: MetricCardProps) {
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
        <p className="text-4xl font-bold tracking-tight text-text">{value}</p>
        <p className="mt-1.5 text-sm text-text-secondary">{description}</p>
      </div>

      <div className="border-t border-border pt-4">{children}</div>
    </Card>
  )
}
