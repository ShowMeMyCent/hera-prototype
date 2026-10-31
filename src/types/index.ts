export interface TrendPoint {
  t: string
  value: number
}

export interface GasComposition {
  co2: number
  n2: number
  h2o: number
  other: number
}

export interface UptimeBlock {
  label: string
  status: 'online' | 'downtime'
}

export interface SensorReading {
  temperature: number
  temperatureTrend: TrendPoint[]
  temperatureChangePct: number
  flowRate: number
  flowRateTrend: TrendPoint[]
  continuity: number
  uptimeProfile: UptimeBlock[]
  downtimeMinutes: number
  gasComposition: GasComposition
  lastTransmission: string
  onlineSensors: number
  totalSensors: number
}

export interface FeasibilitySummary {
  recoverableEnergyMW: number
  matchConfidencePct: number
  co2ReductionTonPerYear: number
}

export interface IndustrialZone {
  id: string
  name: string
}

export interface Factory {
  id: string
  zoneId: string
  name: string
}

export interface SensorPoint {
  id: string
  factoryId: string
  name: string
}

export interface CriteriaScores {
  roi: number
  capex: number
  temperature: number
  fluctuation: number
  co2: number
  efficiency: number
}

export type HeatGrade = 'A' | 'B' | 'C'

export interface Match {
  id: string
  supplier: string
  receiver: string
  score: number
  grade: HeatGrade
  gradeLabel: string
  category: string
  capacityMW: number
  priceIdrPerMWh: number
  distanceKm: number
  economy: number
  technical: number
  environmental: number
  criteria: CriteriaScores
  boilerCostIdrPerMWh: number
}
