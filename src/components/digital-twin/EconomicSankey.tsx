import { economicData } from '../../data/digitalTwinData'
import { formatIdr } from '../../lib/utils'
import { ribbonPath } from '../../lib/sankeyPath'
import { Card } from '../ui/Card'

const WIDTH = 1420
const HEIGHT = 640

function rp(value: number): string {
  return `Rp${formatIdr(value)}`
}

function BreakdownCard({
  left,
  top,
  width,
  title,
  subtitle,
  items,
  totalLabel,
  totalValue,
  accent,
}: {
  left: number
  top: number
  width: number
  title: string
  subtitle?: string
  items: { label: string; value: number }[]
  totalLabel: string
  totalValue: string
  accent: string
}) {
  return (
    <div
      className="absolute rounded-xl border bg-white p-3.5 shadow-card"
      style={{ left, top, width, borderColor: accent + '40' }}
    >
      <p className="text-[10px] font-bold tracking-wide text-text-secondary uppercase">{title}</p>
      {subtitle && <p className="text-[10px] text-text-secondary">{subtitle}</p>}
      <div className="mt-2 flex flex-col gap-1 border-t border-border pt-2">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between gap-2 text-[10.5px]">
            <span className="text-text-secondary">{item.label}</span>
            <span className="font-semibold text-text">{rp(item.value)}</span>
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
        <span className="text-[10px] font-bold text-text-secondary uppercase">{totalLabel}</span>
        <span className="text-xs font-bold" style={{ color: accent }}>
          {totalValue}
        </span>
      </div>
    </div>
  )
}

function TotalNode({
  left,
  top,
  width,
  title,
  value,
  subtitle,
  accent,
}: {
  left: number
  top: number
  width: number
  title: string
  value: string
  subtitle?: string
  accent: string
}) {
  return (
    <div
      className="absolute rounded-xl border bg-white px-4 py-3 text-center shadow-card"
      style={{ left, top, width, borderColor: accent + '50' }}
    >
      <p className="text-[10px] font-bold tracking-wide text-text-secondary uppercase">{title}</p>
      <p className="mt-1 text-sm font-bold" style={{ color: accent }}>
        {value}
      </p>
      {subtitle && <p className="mt-0.5 text-[10px] text-text-secondary">{subtitle}</p>}
    </div>
  )
}

export function EconomicSankey() {
  const { investment, revenue, opex } = economicData
  const grossIncomePct = (economicData.ebt / economicData.grossIncome) * 100
  const netCashFlowPct = (economicData.netCashFlow / economicData.grossIncome) * 100
  const taxPct = (economicData.tax / economicData.ebt) * 100

  const investY = 70
  const revenueY = 300
  const opexY = 500
  const ebtY = 380
  const netY = 330
  const taxY = 500
  const cumulativeY = 330

  const col1X = 20
  const col2X = 330
  const col3X = 590
  const col4X = 850
  const col5X = 1140

  return (
    <Card className="flex flex-col gap-1 p-5 sm:p-6">
      <h2 className="text-lg font-bold text-text">Sankey Diagram — Analisis Ekonomi Proyek</h2>
      <p className="text-sm text-text-secondary">Aliran Keuangan Selama 10 Tahun Operasi</p>

      <div className="mt-4 overflow-x-auto">
        <div className="relative" style={{ width: WIDTH, height: HEIGHT, minWidth: WIDTH }}>
          <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="absolute inset-0">
            <path d={ribbonPath(col2X + 160, investY + 25, col5X + 40, cumulativeY + 35, 10)} fill="#ff9f43" opacity={0.25} />

            <path d={ribbonPath(col1X + 250, investY + 25, col2X, investY + 25, 34)} fill="#0875c9" opacity={0.6} />
            <path d={ribbonPath(col1X + 250, revenueY + 25, col2X, revenueY + 25, 46)} fill="#078b68" opacity={0.6} />
            <path d={ribbonPath(col1X + 250, opexY + 20, col2X, opexY + 20, 30)} fill="#d6362f" opacity={0.55} />

            <path d={ribbonPath(col2X + 160, revenueY + 25, col3X, ebtY + 15, 40)} fill="#078b68" opacity={0.6} />
            <path d={ribbonPath(col2X + 160, opexY + 20, col3X, ebtY + 35, 26)} fill="#d6362f" opacity={0.5} />

            <path d={ribbonPath(col3X + 150, ebtY + 15, col4X, netY + 18, 28)} fill="#078b68" opacity={0.65} />
            <path d={ribbonPath(col3X + 150, ebtY + 40, col4X, taxY + 18, 16)} fill="#ff9f43" opacity={0.6} />

            <path d={ribbonPath(col4X + 170, netY + 18, col5X, cumulativeY + 25, 26)} fill="#078b68" opacity={0.65} />
          </svg>

          <BreakdownCard
            left={col1X}
            top={investY - 45}
            width={250}
            title="Investasi Awal"
            subtitle="Tahun 0"
            items={investment.items}
            totalLabel="Total Investasi"
            totalValue={rp(investment.total)}
            accent="#0875c9"
          />
          <BreakdownCard
            left={col1X}
            top={revenueY - 35}
            width={250}
            title="Pendapatan Kotor / Tahun"
            items={revenue.items}
            totalLabel="Total"
            totalValue={`${rp(revenue.total)} / tahun`}
            accent="#078b68"
          />
          <BreakdownCard
            left={col1X}
            top={opexY - 35}
            width={250}
            title="Biaya Operasional / Tahun"
            items={opex.items}
            totalLabel="Total Opex"
            totalValue={`${rp(opex.total)} / tahun`}
            accent="#d6362f"
          />

          <TotalNode left={col2X} top={investY} width={190} title="Total Investasi" value={rp(investment.total)} accent="#0875c9" />
          <TotalNode left={col2X} top={revenueY} width={190} title="Gross Income" value={`${rp(economicData.grossIncome)} / tahun`} accent="#078b68" />
          <TotalNode left={col2X} top={opexY} width={190} title="Total Opex" value={`${rp(opex.total)} / tahun`} accent="#d6362f" />

          <TotalNode
            left={col3X}
            top={ebtY}
            width={190}
            title="Laba Sebelum Pajak (EBT)"
            value={`${rp(economicData.ebt)} / tahun`}
            subtitle={`${grossIncomePct.toFixed(0)}% dari Gross Income`}
            accent="#17212b"
          />

          <TotalNode
            left={col4X}
            top={netY}
            width={190}
            title="Net Cash Flow"
            value={`${rp(economicData.netCashFlow)} / tahun`}
            subtitle={`${netCashFlowPct.toFixed(0)}% dari Gross Income`}
            accent="#078b68"
          />
          <TotalNode
            left={col4X}
            top={taxY}
            width={190}
            title="Pajak (PPh 25%)"
            value={`${rp(economicData.tax)} / tahun`}
            subtitle={`${taxPct.toFixed(0)}% dari EBT`}
            accent="#ff9f43"
          />

          <TotalNode
            left={col5X}
            top={cumulativeY}
            width={220}
            title="Cumulative Cash Flow"
            value={rp(economicData.cumulativeCashFlow10yr)}
            subtitle="Total Net Cash Flow selama 10 tahun"
            accent="#078b68"
          />
        </div>
      </div>
    </Card>
  )
}
