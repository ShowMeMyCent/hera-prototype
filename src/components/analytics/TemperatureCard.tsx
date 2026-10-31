import { Thermometer, TrendingUp } from 'lucide-react'
import type { SensorReading } from '../../types'
import { MetricCard } from './MetricCard'
import { MiniLineChart } from './MiniLineChart'

export function TemperatureCard({ reading }: { reading: SensorReading }) {
  return (
    <MetricCard
      icon={Thermometer}
      iconColorClass="text-primary"
      iconBgClass="bg-primary/10"
      title="Suhu Gas Buang (Exhaust Temp)"
      status="Sesuai Parameter"
      statusTone="green"
      value={`${reading.temperature}°C`}
      description="Rentang layak pemulihan: 70–250°C"
    >
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-semibold tracking-wide text-text-secondary uppercase">6-Hour Trend</p>
          <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-green-dark">
            <TrendingUp className="h-3.5 w-3.5" />
            +{reading.temperatureChangePct}% Stabil
          </p>
        </div>
        <MiniLineChart data={reading.temperatureTrend} colorVar="#0875C9" unit="°C" />
      </div>
    </MetricCard>
  )
}
