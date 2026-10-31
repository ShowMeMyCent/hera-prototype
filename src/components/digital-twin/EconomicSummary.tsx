import { Banknote, Coins, PiggyBank, Receipt, TrendingUp, Wallet } from 'lucide-react'
import { economicData } from '../../data/digitalTwinData'
import { formatIdr } from '../../lib/utils'
import { Card } from '../ui/Card'

function rp(value: number): string {
  return `Rp${formatIdr(value)}`
}

function SummaryStat({ icon: Icon, label, value }: { icon: typeof Banknote; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-[11px] font-semibold tracking-wide text-text-secondary uppercase">{label}</p>
        <p className="text-sm font-bold text-text">{value}</p>
      </div>
    </div>
  )
}

function OutcomeTile({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 rounded-xl border border-border bg-bg px-4 py-4 text-center">
      <p className="text-[11px] font-semibold tracking-wide text-text-secondary uppercase">{label}</p>
      <p className="text-xl font-bold" style={{ color: tone }}>
        {value}
      </p>
    </div>
  )
}

export function EconomicSummary() {
  const { summary10yr, outcomes } = economicData

  return (
    <Card className="flex flex-col gap-5 p-5 sm:p-6">
      <p className="text-xs font-bold tracking-wide text-text-secondary uppercase">Ringkasan Analisis Ekonomi (10 Tahun)</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <SummaryStat icon={Wallet} label="Total Investasi Awal" value={rp(summary10yr.totalInvestment)} />
        <SummaryStat icon={PiggyBank} label="Total Penghematan (10 Thn)" value={rp(summary10yr.totalSavings)} />
        <SummaryStat icon={Receipt} label="Total Biaya Operasional (10 Thn)" value={rp(summary10yr.totalOpex)} />
        <SummaryStat icon={Coins} label="Total Profit (10 Thn)" value={rp(summary10yr.totalProfit)} />
        <SummaryStat icon={Banknote} label="Net Cash Flow (10 Thn)" value={rp(summary10yr.netCashFlow)} />
      </div>

      <div className="grid grid-cols-2 gap-3 border-t border-border pt-5 sm:grid-cols-4">
        <OutcomeTile label="Payback Period" value={`~${outcomes.paybackYears.toFixed(1)} Tahun`} tone="#0875c9" />
        <OutcomeTile label="Long-Term ROI (10 Thn)" value={`${outcomes.roiPct}%`} tone="#078b68" />
        <OutcomeTile label="IRR (Internal Rate of Return)" value={`${outcomes.irrPct}%`} tone="#09b8b8" />
        <OutcomeTile label="NPV (10 Thn)" value={rp(outcomes.npv)} tone="#078b68" />
      </div>

      <div className="flex items-center gap-2 text-xs text-text-secondary">
        <TrendingUp className="h-3.5 w-3.5 shrink-0 text-green-dark" />
        Proyek layak secara ekonomi dengan tingkat pengembalian investasi yang kompetitif.
      </div>
    </Card>
  )
}
