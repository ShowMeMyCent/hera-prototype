import { Droplets, Flame, Gauge, PiggyBank, Thermometer } from 'lucide-react'
import { buildTrend } from '../../hooks/useDigitalTwinSimulation'
import { economicData } from '../../data/digitalTwinData'
import type { PlantProfile, SimulationMetrics } from '../../types/digitalTwin'
import { KPICard } from './KPICard'

interface KPIGridProps {
  source: PlantProfile
  receiver: PlantProfile
  metrics: SimulationMetrics
  elapsedSec: number
}

export function KPIGrid({ source, receiver, metrics, elapsedSec }: KPIGridProps) {
  const heatTransferredTrend = buildTrend(source, receiver, elapsedSec, (m) => m.heatTransferredMW)
  const sourceTempTrend = buildTrend(source, receiver, elapsedSec, (m) => m.sourceTemperatureC)
  const receiverTempTrend = buildTrend(source, receiver, elapsedSec, (m) => m.receiverTemperatureC)
  const flowRateTrend = buildTrend(source, receiver, elapsedSec, (m) => m.flowRateKgS)
  const efficiencyTrend = buildTrend(source, receiver, elapsedSec, (m) => m.efficiency * 100)

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-lg font-bold text-text">Key Performance Indicator</h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <KPICard
          icon={Flame}
          iconColorClass="text-orange"
          iconBgClass="bg-orange/10"
          title="Heat Transferred"
          status="Surplus"
          statusTone="orange"
          value={`${metrics.heatTransferredMW.toFixed(2)} MW`}
          description="Rentang layak pemulihan: 70–250°C"
          trend={heatTransferredTrend}
          trendQualifier="Stabil"
          trendDirection="up"
          chartColor="#d97706"
        />
        <KPICard
          icon={Thermometer}
          iconColorClass="text-orange"
          iconBgClass="bg-orange/10"
          title="Source Temperature"
          status="Normal"
          statusTone="orange"
          value={`${metrics.sourceTemperatureC.toFixed(1)}°C`}
          description="Rentang layak pemulihan: 70–250°C"
          trend={sourceTempTrend}
          trendQualifier="Heat Loss"
          trendDirection="down"
          chartColor="#d97706"
        />
        <KPICard
          icon={Thermometer}
          iconColorClass="text-red"
          iconBgClass="bg-red/10"
          title="Receiver Temperature"
          status="Loss"
          statusTone="red"
          value={`${metrics.receiverTemperatureC.toFixed(1)}°C`}
          description="Suhu panas yang diterima pabrik penerima"
          trend={receiverTempTrend}
          trendQualifier="Heat Loss"
          trendDirection="down"
          chartColor="#d6362f"
        />
        <KPICard
          icon={Droplets}
          iconColorClass="text-primary"
          iconBgClass="bg-primary/10"
          title="Flow Rate"
          status="Full Capacity"
          statusTone="blue"
          value={`${metrics.flowRateKgS.toFixed(1)} kg/s`}
          description={`Setara dengan ${Math.round(metrics.flowRateKgS * 3600).toLocaleString('id-ID')} kg/jam pasokan panas`}
          trend={flowRateTrend}
          trendQualifier="Stabil"
          trendDirection="up"
          chartColor="#0875c9"
        />
        <KPICard
          icon={Gauge}
          iconColorClass="text-turquoise-dark"
          iconBgClass="bg-turquoise/10"
          title="System Efficiency"
          status="Stabil"
          statusTone="turquoise"
          value={`${(metrics.efficiency * 100).toFixed(1)}%`}
          description="Sistem Stabil"
          trend={efficiencyTrend}
          trendQualifier="Stabil"
          trendDirection="up"
          chartColor="#09b8b8"
        />
        <KPICard
          icon={PiggyBank}
          iconColorClass="text-green-dark"
          iconBgClass="bg-green/10"
          title="Payback Period"
          status="Menguntungkan"
          statusTone="green"
          value={`${economicData.outcomes.paybackYears.toFixed(1)} Tahun`}
          description="Investasi kembali setelah 3 tahun 2 bulan"
          trend={buildTrend(source, receiver, elapsedSec, () => economicData.outcomes.paybackYears)}
          trendQualifier="Stabil"
          trendDirection="up"
          chartColor="#078b68"
        />
      </div>
    </div>
  )
}
