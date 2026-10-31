import { Activity } from 'lucide-react'
import type { SensorReading } from '../../types'
import { cn } from '../../lib/utils'
import { MetricCard } from './MetricCard'

export function ContinuityCard({ reading }: { reading: SensorReading }) {
  return (
    <MetricCard
      icon={Activity}
      iconColorClass="text-green-dark"
      iconBgClass="bg-green/10"
      title="Kontinuitas Suplai (Continuity)"
      status="Sangat Layak"
      statusTone="green"
      value={`${reading.continuity}%`}
      description="Indikasi ketersediaan pasokan konstan (uptime 24 jam terakhir)"
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold tracking-wide text-text-secondary uppercase">24-Hour Active Profile</p>
        <p className="text-xs font-semibold text-text-secondary">{reading.downtimeMinutes}m downtime total</p>
      </div>
      <div className="mt-3 flex gap-1">
        {reading.uptimeProfile.map((block, i) => (
          <div
            key={`${block.label}-${i}`}
            className={cn(
              'h-6 flex-1 rounded-sm',
              block.status === 'online' ? 'bg-green' : 'bg-red',
            )}
            title={`${block.label} — ${block.status === 'online' ? 'Online' : 'Downtime'}`}
          />
        ))}
      </div>
    </MetricCard>
  )
}
