import type { TrendPoint } from './index'

export interface PlantProfile {
  id: string
  name: string
  role: 'source' | 'receiver'
  subtitle: string
  baseTemperatureC: number
  heatAvailableMW: number
  baseFlowRateKgS: number
  qualityFactor: number
}

export interface SimulationMetrics {
  heatAvailableMW: number
  heatTransferredMW: number
  heatLossMW: number
  efficiency: number
  sourceTemperatureC: number
  receiverTemperatureC: number
  flowRateKgS: number
  feasible: boolean
}

export interface EconomicLineItem {
  label: string
  value: number
}

export interface SimulationStatus {
  label: string
  tone: 'green' | 'orange' | 'red' | 'blue'
}

export type ObjectKind =
  | 'source'
  | 'receiver'
  | 'pump'
  | 'exchanger'
  | 'pipeline'
  | 'control-hub'
  | 'secondary'

/** What the pointer is currently over / what the inspector is pinned to. */
export interface SelectionTarget {
  kind: ObjectKind
  /** Identifies which node / connection / tenant, since several share a kind. */
  id?: string
}

/** Single Pair shows only the primary route; Network Overview runs the whole backbone. */
export type NetworkMode = 'single' | 'network'

/** Per-route and whole-network roll-up of the simulation. */
export interface RouteMetrics {
  routeId: string
  label: string
  sourceName: string
  receiverName: string
  metrics: SimulationMetrics
}

export interface NetworkMetrics {
  heatAvailableMW: number
  heatTransferredMW: number
  heatLossMW: number
  efficiency: number
  flowRateKgS: number
  activeRoutes: number
  totalRoutes: number
}

export interface ObjectInspection {
  kind: ObjectKind
  title: string
  subtitle: string
  stats: { label: string; value: string }[]
  status: string
  /** Secondary facilities get a reduced panel rather than the full facility dashboard. */
  compact?: boolean
}

export interface KpiTrend {
  points: TrendPoint[]
  changeLabel: string
}

export type CameraPresetId = 'overview' | 'source' | 'network' | 'receiver'
