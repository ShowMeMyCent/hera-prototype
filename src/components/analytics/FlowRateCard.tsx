import { Wind } from 'lucide-react'
import type { SensorReading } from '../../types'
import { MetricCard } from './MetricCard'
import { MiniLineChart } from './MiniLineChart'

export function FlowRateCard({ reading }: { reading: SensorReading }) {
  const kgPerHour = Math.round(reading.flowRate * 3600).toLocaleString('id-ID')

  return (
    <MetricCard
      icon={Wind}
      iconColorClass="text-turquoise-dark"
      iconBgClass="bg-turquoise/10"
      title="Laju Aliran Massa (Flow Rate)"
      status="Stabil"
      statusTone="turquoise"
      value={`${reading.flowRate} kg/s`}
      description={`Setara dengan ${kgPerHour} kg/jam pasokan panas`}
    >
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-semibold tracking-wide text-text-secondary uppercase">Volume Feed</p>
          <p className="mt-1 text-sm font-semibold text-text">Konsisten</p>
        </div>
        <MiniLineChart data={reading.flowRateTrend} colorVar="#09B8B8" unit=" kg/s" />
      </div>
    </MetricCard>
  )
}
