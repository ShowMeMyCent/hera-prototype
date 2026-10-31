import type { SimulationMetrics } from '../../types/digitalTwin'
import { Card } from '../ui/Card'

interface EnergySummaryProps {
  metrics: SimulationMetrics
}

function LegendRow({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="flex items-center gap-2 text-text-secondary">
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
        {label}
      </span>
      <span className="font-semibold text-text">{value}</span>
    </div>
  )
}

export function EnergySummary({ metrics }: EnergySummaryProps) {
  const transferredPct = metrics.efficiency * 100
  const lossPct = 100 - transferredPct

  return (
    <Card className="flex flex-col gap-4 p-5 sm:p-6">
      <p className="text-xs font-bold tracking-wide text-text-secondary uppercase">Ringkasan Aliran Energi</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
        <div className="flex flex-col gap-2.5">
          <LegendRow color="#078b68" label="Energi Panas Diterima" value={`${metrics.heatTransferredMW.toFixed(2)} MW (${transferredPct.toFixed(1)}%)`} />
          <LegendRow color="#d6362f" label="Kehilangan Panas" value={`${metrics.heatLossMW.toFixed(2)} MW (${lossPct.toFixed(1)}%)`} />
          <LegendRow color="#ff9f43" label="Energi Panas Tersedia" value={`${metrics.heatAvailableMW.toFixed(2)} MW (100%)`} />
        </div>

        <div className="rounded-xl border border-turquoise/30 bg-turquoise/5 px-5 py-3 text-center">
          <p className="text-[11px] font-semibold tracking-wide text-text-secondary uppercase">Efisiensi Sistem</p>
          <p className="text-2xl font-bold text-turquoise-dark">{transferredPct.toFixed(1)}%</p>
          <p className="text-[11px] text-text-secondary">Energi termanfaatkan dari total energi panas tersedia</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-1 border-t border-border pt-4 text-sm">
        <span className="text-text-secondary">
          Loss Percentage: <span className="font-semibold text-red">{lossPct.toFixed(1)}%</span>
        </span>
        <span className="text-text-secondary">
          Efisiensi Sistem: <span className="font-semibold text-turquoise-dark">{transferredPct.toFixed(1)}%</span>
        </span>
      </div>
    </Card>
  )
}
