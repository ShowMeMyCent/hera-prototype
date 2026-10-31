import { Sparkles } from 'lucide-react'
import type { SensorReading } from '../../types'
import { Badge } from '../ui/Badge'
import { Card } from '../ui/Card'

interface StatusBarProps {
  factoryName: string
  reading: SensorReading
  pulse: boolean
}

export function StatusBar({ factoryName, reading, pulse }: StatusBarProps) {
  return (
    <Card className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-6">
      <div>
        <p className="text-xs font-semibold tracking-wide text-text-secondary uppercase">Monitoring Focus</p>
        <p className="mt-1 flex items-center gap-2 text-base font-bold text-text">
          {factoryName}
          <span className="flex items-center gap-1 text-xs font-semibold text-green-dark">
            <span className="h-1.5 w-1.5 rounded-full bg-green" />
            Aktif
          </span>
        </p>
      </div>

      <div>
        <p className="text-xs font-semibold tracking-wide text-text-secondary uppercase">Last Transmission</p>
        <p
          className={`mt-1 text-sm font-semibold text-text transition-colors ${pulse ? 'text-turquoise-dark' : ''}`}
        >
          {reading.lastTransmission}
        </p>
      </div>

      <div>
        <p className="text-xs font-semibold tracking-wide text-text-secondary uppercase">Sensor Status</p>
        <p className="mt-1 text-sm font-semibold text-text">
          {reading.onlineSensors}/{reading.totalSensors} Sensor Online
        </p>
      </div>

      <div className="flex items-center gap-3">
        <p className="text-xs font-semibold tracking-wide text-text-secondary uppercase">Overall Feasibility Status:</p>
        <Badge tone="turquoise" dot={false}>
          <Sparkles className="h-3.5 w-3.5" />
          Layak Dicocokkan (Feasible)
        </Badge>
      </div>
    </Card>
  )
}
