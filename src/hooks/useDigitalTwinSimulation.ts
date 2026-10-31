import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { networkRoutes, nodeById, PRIMARY_ROUTE_ID } from '../data/heatNetwork'
import type {
  NetworkMetrics,
  NetworkMode,
  PlantProfile,
  RouteMetrics,
  SimulationMetrics,
} from '../types/digitalTwin'
import type { TrendPoint } from '../types'

/** 1x speed advances the simulated clock by this many seconds per real second. */
const SIM_SECONDS_PER_REAL_SECOND = 60

function round(value: number, decimals: number): number {
  const factor = 10 ** decimals
  return Math.round(value * factor) / factor
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function computeMetrics(
  source: PlantProfile,
  receiver: PlantProfile,
  elapsedSec: number,
): SimulationMetrics {
  const tMin = elapsedSec / 60
  const waveA = Math.sin(tMin * 0.21)
  const waveB = Math.sin(tMin * 0.13 + 1.1)
  const waveC = Math.sin(tMin * 0.3 + 0.4)

  const baseEfficiency = clamp((source.qualityFactor + receiver.qualityFactor) / 2, 0.4, 0.96)

  const heatAvailableMW = round(source.heatAvailableMW * (1 + 0.035 * waveA), 2)
  const efficiency = clamp(baseEfficiency + 0.025 * waveB, 0.55, 0.95)
  const heatTransferredMW = round(heatAvailableMW * efficiency, 2)
  const heatLossMW = round(Math.max(heatAvailableMW - heatTransferredMW, 0), 2)
  const sourceTemperatureC = round(source.baseTemperatureC + 4 * waveA, 1)
  const receiverTemperatureC = round(
    receiver.baseTemperatureC + 6 * waveB * (efficiency / baseEfficiency),
    1,
  )
  const flowRateKgS = round(source.baseFlowRateKgS * (1 + 0.04 * waveC), 1)
  const feasible = efficiency >= 0.6 && heatTransferredMW >= 0.5

  return {
    heatAvailableMW,
    heatTransferredMW,
    heatLossMW,
    efficiency,
    sourceTemperatureC,
    receiverTemperatureC,
    flowRateKgS,
    feasible,
  }
}

export function buildTrend(
  source: PlantProfile,
  receiver: PlantProfile,
  elapsedSec: number,
  pick: (m: SimulationMetrics) => number,
  points = 12,
  stepSec = 300,
): TrendPoint[] {
  return Array.from({ length: points }, (_, i) => {
    const sampleAt = Math.max(elapsedSec - (points - 1 - i) * stepSec, 0)
    const metrics = computeMetrics(source, receiver, sampleAt)
    return { t: `${sampleAt}`, value: pick(metrics) }
  })
}

export function formatClock(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = Math.floor(totalSeconds % 60)
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

/** Builds a PlantProfile from a network node so routes can reuse `computeMetrics`. */
function profileForNode(nodeId: string, role: 'source' | 'receiver'): PlantProfile | null {
  const node = nodeById.get(nodeId)
  if (!node?.profile) return null
  return {
    id: node.id,
    name: node.name,
    role,
    subtitle: node.subtitle,
    ...node.profile,
  }
}

/**
 * Metrics for every route on the backbone. The primary pair uses the profiles chosen in
 * the configuration bar; the other routes use their own node data. Each route is offset
 * slightly in simulated time so the network does not pulse in lockstep — still fully
 * deterministic, no random values.
 */
export function computeRouteMetrics(
  elapsedSec: number,
  primarySource: PlantProfile,
  primaryReceiver: PlantProfile,
): RouteMetrics[] {
  return networkRoutes.map((route, index) => {
    const isPrimary = route.id === PRIMARY_ROUTE_ID
    const sourceProfile = isPrimary ? primarySource : profileForNode(route.sourceId, 'source')
    const receiverProfile = isPrimary ? primaryReceiver : profileForNode(route.receiverId, 'receiver')

    const phase = isPrimary ? 0 : index * 420
    const metrics =
      sourceProfile && receiverProfile
        ? computeMetrics(sourceProfile, receiverProfile, elapsedSec + phase)
        : computeMetrics(primarySource, primaryReceiver, elapsedSec + phase)

    return {
      routeId: route.id,
      label: route.label,
      sourceName: sourceProfile?.name ?? primarySource.name,
      receiverName: receiverProfile?.name ?? primaryReceiver.name,
      metrics,
    }
  })
}

/** Roll-up across whichever routes the current mode has running. */
export function aggregateNetwork(routeMetrics: RouteMetrics[], activeRouteIds: Set<string>): NetworkMetrics {
  const active = routeMetrics.filter((r) => activeRouteIds.has(r.routeId))

  const heatAvailableMW = round(active.reduce((sum, r) => sum + r.metrics.heatAvailableMW, 0), 2)
  const heatTransferredMW = round(active.reduce((sum, r) => sum + r.metrics.heatTransferredMW, 0), 2)
  const heatLossMW = round(Math.max(heatAvailableMW - heatTransferredMW, 0), 2)
  const flowRateKgS = round(active.reduce((sum, r) => sum + r.metrics.flowRateKgS, 0), 1)

  return {
    heatAvailableMW,
    heatTransferredMW,
    heatLossMW,
    efficiency: heatAvailableMW > 0 ? heatTransferredMW / heatAvailableMW : 0,
    flowRateKgS,
    activeRoutes: active.length,
    totalRoutes: routeMetrics.length,
  }
}

interface UseDigitalTwinSimulationArgs {
  source: PlantProfile
  receiver: PlantProfile
  runtimeMinutes: number
  mode: NetworkMode
}

export function useDigitalTwinSimulation({ source, receiver, runtimeMinutes, mode }: UseDigitalTwinSimulationArgs) {
  const [running, setRunning] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [elapsedSec, setElapsedSec] = useState(0)
  const rafRef = useRef<number | null>(null)
  const lastTsRef = useRef<number | null>(null)
  const runtimeSec = runtimeMinutes * 60

  useEffect(() => {
    if (!running) return

    function tick(ts: number) {
      if (lastTsRef.current == null) lastTsRef.current = ts
      const dtReal = (ts - lastTsRef.current) / 1000
      lastTsRef.current = ts

      setElapsedSec((prev) => {
        const next = prev + dtReal * speed * SIM_SECONDS_PER_REAL_SECOND
        if (next >= runtimeSec) {
          setRunning(false)
          return runtimeSec
        }
        return next
      })

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
      lastTsRef.current = null
    }
  }, [running, speed, runtimeSec])

  const start = useCallback(() => {
    setElapsedSec((prev) => (prev >= runtimeSec ? 0 : prev))
    setRunning(true)
  }, [runtimeSec])

  const pause = useCallback(() => setRunning(false), [])

  const reset = useCallback(() => {
    setRunning(false)
    setElapsedSec(0)
  }, [])

  const seek = useCallback(
    (sec: number) => setElapsedSec(clamp(sec, 0, runtimeSec)),
    [runtimeSec],
  )

  const metrics = useMemo(
    () => computeMetrics(source, receiver, elapsedSec),
    [source, receiver, elapsedSec],
  )

  const routeMetrics = useMemo(
    () => computeRouteMetrics(elapsedSec, source, receiver),
    [elapsedSec, source, receiver],
  )

  /** Single Pair keeps only the primary route live; Network Overview runs all of them. */
  const activeRouteIds = useMemo(
    () =>
      new Set(
        mode === 'single'
          ? [PRIMARY_ROUTE_ID]
          : networkRoutes.map((route) => route.id),
      ),
    [mode],
  )

  const networkMetrics = useMemo(
    () => aggregateNetwork(routeMetrics, activeRouteIds),
    [routeMetrics, activeRouteIds],
  )

  return {
    running,
    speed,
    setSpeed,
    elapsedSec,
    runtimeSec,
    metrics,
    routeMetrics,
    networkMetrics,
    activeRouteIds,
    start,
    pause,
    reset,
    seek,
  }
}
