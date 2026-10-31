import { Factory, Flame, ThermometerSun, Waves } from 'lucide-react'
import { PIPELINE_SPEC } from '../../data/digitalTwinData'
import { ribbonPath } from '../../lib/sankeyPath'
import type { PlantProfile, SimulationMetrics } from '../../types/digitalTwin'
import { Card } from '../ui/Card'

interface HeatRecoverySankeyProps {
  source: PlantProfile
  receiver: PlantProfile
  metrics: SimulationMetrics
}

const WIDTH = 1040
const HEIGHT = 440

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2 text-[11px]">
      <span className="text-text-secondary">{label}</span>
      <span className="font-semibold text-text">{value}</span>
    </div>
  )
}

export function HeatRecoverySankey({ source, receiver, metrics }: HeatRecoverySankeyProps) {
  const transferredPct = metrics.efficiency * 100
  const lossPct = 100 - transferredPct

  const sourceY = 190
  const pipelineY = 150
  const receiverY = 110
  const lossY = 330

  const sourceRight = { x: 260, y: sourceY }
  const pipelineLeft = { x: 420, y: pipelineY }
  const pipelineRight = { x: 660, y: pipelineY }
  const receiverLeft = { x: 800, y: receiverY }
  const lossLeft = { x: 800, y: lossY }

  return (
    <Card className="flex flex-col gap-1 p-5 sm:p-6">
      <h2 className="text-lg font-bold text-text">Heat Recovery Sankey Diagram</h2>
      <p className="text-sm text-text-secondary">Visualisasi aliran energi panas dari sumber ke penerima</p>

      <div className="mt-4 overflow-x-auto">
        <div className="relative" style={{ width: WIDTH, height: HEIGHT, minWidth: WIDTH }}>
          <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="absolute inset-0">
            <path
              d={ribbonPath(sourceRight.x, sourceRight.y, pipelineLeft.x, pipelineY, 70)}
              fill="#ff9f43"
              opacity={0.65}
            />
            <path
              d={ribbonPath(pipelineRight.x, receiverY + 30, receiverLeft.x, receiverY, 58)}
              fill="#078b68"
              opacity={0.65}
            />
            <path
              d={ribbonPath(pipelineRight.x, lossY - 30, lossLeft.x, lossY, 26)}
              fill="#d6362f"
              opacity={0.6}
            />
          </svg>

          <div
            className="absolute rounded-xl border border-orange/30 bg-orange/5 p-4"
            style={{ left: 20, top: sourceY - 100, width: 240 }}
          >
            <div className="mb-2 flex items-center gap-2">
              <Factory className="h-4 w-4 text-orange" />
              <p className="text-xs font-bold tracking-wide text-text uppercase">Heat Source</p>
            </div>
            <p className="mb-2 text-[11px] text-text-secondary">Pabrik Pemasok ({source.name})</p>
            <div className="flex flex-col gap-1.5 border-t border-orange/20 pt-2">
              <Stat label="Energi Panas Tersedia" value={`${metrics.heatAvailableMW.toFixed(2)} MW`} />
              <Stat label="Suhu Masuk" value={`${metrics.sourceTemperatureC.toFixed(1)}°C`} />
              <Stat label="Laju Aliran" value={`${metrics.flowRateKgS.toFixed(1)} kg/s`} />
            </div>
          </div>

          <div
            className="absolute rounded-xl border border-border bg-black/3 p-4"
            style={{ left: 380, top: pipelineY - 130, width: 240 }}
          >
            <div className="mb-2 flex items-center gap-2">
              <Waves className="h-4 w-4 text-text-secondary" />
              <p className="text-xs font-bold tracking-wide text-text uppercase">Heat Pipeline System</p>
            </div>
            <div className="flex flex-col gap-1.5 border-t border-border pt-2">
              <Stat label="Panjang Pipa" value={`${PIPELINE_SPEC.lengthM} m`} />
              <Stat label="Diameter Pipa" value={PIPELINE_SPEC.diameter} />
              <Stat label="Material" value={PIPELINE_SPEC.material} />
              <Stat label="Isolasi" value={PIPELINE_SPEC.insulation} />
              <Stat label="Laju Aliran" value={`${metrics.flowRateKgS.toFixed(1)} kg/s`} />
              <Stat label="Waktu Operasi" value={`${PIPELINE_SPEC.operatingHoursPerYear.toLocaleString('id-ID')} jam/tahun`} />
            </div>
          </div>

          <div
            className="absolute rounded-xl border border-green/30 bg-green/5 p-4"
            style={{ left: 800, top: receiverY - 70, width: 220 }}
          >
            <div className="mb-2 flex items-center gap-2">
              <ThermometerSun className="h-4 w-4 text-green-dark" />
              <p className="text-xs font-bold tracking-wide text-text uppercase">Heat Receiver</p>
            </div>
            <p className="mb-2 text-[11px] text-text-secondary">Pabrik Penerima ({receiver.name})</p>
            <div className="flex flex-col gap-1.5 border-t border-green/20 pt-2">
              <Stat label="Energi Panas Diterima" value={`${metrics.heatTransferredMW.toFixed(2)} MW (${transferredPct.toFixed(1)}%)`} />
              <Stat label="Suhu Keluar" value={`${metrics.receiverTemperatureC.toFixed(1)}°C`} />
              <Stat label="Laju Aliran" value={`${metrics.flowRateKgS.toFixed(1)} kg/s`} />
            </div>
          </div>

          <div
            className="absolute rounded-xl border border-red/30 bg-red/5 p-4"
            style={{ left: 800, top: lossY - 20, width: 220 }}
          >
            <div className="mb-2 flex items-center gap-2">
              <Flame className="h-4 w-4 text-red" />
              <p className="text-xs font-bold tracking-wide text-text uppercase">Heat Loss</p>
            </div>
            <p className="mb-2 text-[11px] text-text-secondary">Kehilangan Panas</p>
            <div className="flex flex-col gap-1.5 border-t border-red/20 pt-2">
              <Stat label="Energi Hilang" value={`${metrics.heatLossMW.toFixed(2)} MW (${lossPct.toFixed(1)}%)`} />
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
