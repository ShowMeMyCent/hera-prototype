import type { FeasibilitySummary, SensorReading, TrendPoint, UptimeBlock } from '../types'

function buildTrend(base: number, points: number, spread: number): TrendPoint[] {
  const now = Date.now()
  return Array.from({ length: points }, (_, i) => {
    const wobble = Math.sin(i * 1.3) * spread + (i % 3 === 0 ? spread * 0.4 : 0)
    return {
      t: new Date(now - (points - i) * 60 * 60 * 1000).toISOString(),
      value: Number((base + wobble).toFixed(1)),
    }
  })
}

function buildUptimeProfile(): UptimeBlock[] {
  return Array.from({ length: 9 }, (_, i) => ({
    label: `${i * 3}:00`,
    status: i === 6 ? 'downtime' : 'online',
  }))
}

export const initialSensorReading: SensorReading = {
  temperature: 187,
  temperatureTrend: buildTrend(185, 12, 3),
  temperatureChangePct: 2.4,
  flowRate: 4.2,
  flowRateTrend: buildTrend(4.2, 12, 0.3),
  continuity: 94.7,
  uptimeProfile: buildUptimeProfile(),
  downtimeMinutes: 12,
  gasComposition: { co2: 68, n2: 22, h2o: 8, other: 2 },
  lastTransmission: '14 Agu 2026 · 10:32 WIB',
  onlineSensors: 12,
  totalSensors: 12,
}

export const feasibilitySummary: FeasibilitySummary = {
  recoverableEnergyMW: 2.4,
  matchConfidencePct: 87,
  co2ReductionTonPerYear: 1200,
}
