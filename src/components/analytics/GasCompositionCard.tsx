import { Layers } from 'lucide-react'
import type { SensorReading } from '../../types'
import { MetricCard } from './MetricCard'

const segments = (c: SensorReading['gasComposition']) => [
  { key: 'co2', label: 'CO₂', value: c.co2, colorClass: 'bg-turquoise' },
  { key: 'n2', label: 'N₂', value: c.n2, colorClass: 'bg-primary' },
  { key: 'h2o', label: 'H₂O', value: c.h2o, colorClass: 'bg-green' },
  { key: 'other', label: 'Lainnya', value: c.other, colorClass: 'bg-text-secondary' },
]

export function GasCompositionCard({ reading }: { reading: SensorReading }) {
  const parts = segments(reading.gasComposition)

  return (
    <MetricCard
      icon={Layers}
      iconColorClass="text-text"
      iconBgClass="bg-black/5"
      title="Komposisi Gas Buang (Constituents)"
      status="Kadar Sulfur Rendah"
      statusTone="green"
      value={`CO₂ Dominan (${reading.gasComposition.co2}%)`}
      description="Aman untuk kompresi dan pipa tembaga penukar panas"
    >
      <p className="mb-2 text-xs font-semibold tracking-wide text-text-secondary uppercase">Gas Volume Share</p>
      <div className="flex h-2.5 w-full overflow-hidden rounded-full">
        {parts.map((part) => (
          <div
            key={part.key}
            className={part.colorClass}
            style={{ width: `${part.value}%` }}
            title={`${part.label} ${part.value}%`}
          />
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        {parts.map((part) => (
          <div key={part.key} className="flex items-center gap-1.5 text-xs text-text-secondary">
            <span className={`h-2 w-2 rounded-full ${part.colorClass}`} />
            {part.label} {part.value}%
          </div>
        ))}
      </div>
    </MetricCard>
  )
}
