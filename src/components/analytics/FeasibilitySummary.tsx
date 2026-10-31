import { ArrowRight } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import type { FeasibilitySummary as FeasibilitySummaryType } from '../../types'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'

export function FeasibilitySummary({ summary }: { summary: FeasibilitySummaryType }) {
  const navigate = useNavigate()

  return (
    <Card className="flex flex-col gap-6 border-turquoise/30 bg-gradient-to-br from-turquoise/5 to-primary/5 p-6 sm:p-7 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex-1">
        <h3 className="text-lg font-bold text-text">
          Ringkasan Kelayakan Pemulihan Panas <span className="font-semibold text-text-secondary">(Feasibility Study)</span>
        </h3>
        <p className="mt-2 max-w-2xl text-sm text-text-secondary">
          Berdasarkan pembacaan sensor IoT, titik pembuangan panas pada PT Smelter Sulawesi memenuhi seluruh
          kriteria untuk dikonversi menjadi pasokan panas.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div>
            <p className="text-xs font-semibold tracking-wide text-text-secondary uppercase">Est. Recoverable Energy</p>
            <p className="mt-1 text-xl font-bold text-primary">{summary.recoverableEnergyMW} MW thermal</p>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-wide text-text-secondary uppercase">Match Confidence Score</p>
            <p className="mt-1 text-xl font-bold text-turquoise-dark">{summary.matchConfidencePct}% Accurate</p>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-wide text-text-secondary uppercase">Potential CO₂ Reduction</p>
            <p className="mt-1 text-xl font-bold text-green-dark">
              {summary.co2ReductionTonPerYear.toLocaleString('id-ID')} ton/tahun
            </p>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-stretch gap-3 sm:items-end">
        <Button variant="secondary" onClick={() => navigate('/analytics/digital-twin')}>
          Simulasi Digital Twin
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Link to="/marketplace" className="text-center text-sm font-semibold text-primary hover:underline">
          Lihat Detail Pencocokan (View Matches)
        </Link>
      </div>
    </Card>
  )
}
