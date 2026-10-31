import type {
  ObjectInspection,
  PlantProfile,
  RouteMetrics,
  SelectionTarget,
  SimulationMetrics,
} from '../types/digitalTwin'
import { PIPELINE_SPEC } from '../data/digitalTwinData'
import { connectionById, networkRoutes, nodeById, PRIMARY_ROUTE_ID } from '../data/heatNetwork'
import { secondaryFacilities } from '../data/industrialComplex'

/** Metrics of the route a node belongs to, falling back to the primary pair. */
function metricsForNode(
  nodeId: string | undefined,
  routeMetrics: RouteMetrics[],
  fallback: SimulationMetrics,
): SimulationMetrics {
  if (!nodeId) return fallback
  const route = networkRoutes.find((r) => r.sourceId === nodeId || r.receiverId === nodeId)
  if (!route) return fallback
  return routeMetrics.find((r) => r.routeId === route.id)?.metrics ?? fallback
}

export function getObjectInspection(
  target: SelectionTarget,
  source: PlantProfile,
  receiver: PlantProfile,
  metrics: SimulationMetrics,
  routeMetrics: RouteMetrics[] = [],
): ObjectInspection {
  switch (target.kind) {
    case 'source': {
      const node = target.id ? nodeById.get(target.id) : undefined
      const isPrimary = node?.id === 'src-smelter-nikel'
      const m = isPrimary ? metrics : metricsForNode(target.id, routeMetrics, metrics)
      return {
        kind: target.kind,
        title: 'HEAT SOURCE',
        subtitle: isPrimary ? source.name : (node?.name ?? source.name),
        stats: [
          { label: 'Temperature', value: `${m.sourceTemperatureC.toFixed(1)}°C` },
          { label: 'Available Heat', value: `${m.heatAvailableMW.toFixed(2)} MW` },
          { label: 'Flow Rate', value: `${m.flowRateKgS.toFixed(1)} kg/s` },
        ],
        status: 'Stable',
      }
    }
    case 'receiver': {
      const node = target.id ? nodeById.get(target.id) : undefined
      const isPrimary = node?.id === 'rcv-semen-indonesia'
      const m = isPrimary ? metrics : metricsForNode(target.id, routeMetrics, metrics)
      return {
        kind: target.kind,
        title: 'HEAT RECEIVER',
        subtitle: isPrimary ? receiver.name : (node?.name ?? receiver.name),
        stats: [
          { label: 'Received Heat', value: `${m.heatTransferredMW.toFixed(2)} MW` },
          { label: 'Temperature', value: `${m.receiverTemperatureC.toFixed(1)}°C` },
          { label: 'Flow Rate', value: `${m.flowRateKgS.toFixed(1)} kg/s` },
        ],
        status: 'Stable',
      }
    }
    case 'pump': {
      const node = target.id ? nodeById.get(target.id) : undefined
      return {
        kind: target.kind,
        title: 'PUMP STATION',
        subtitle: node?.name ?? 'Pump Station',
        stats: [
          { label: 'Segmen', value: node?.subtitle ?? 'Backbone' },
          { label: 'Laju Aliran', value: `${metrics.flowRateKgS.toFixed(1)} kg/s` },
          { label: 'Tekanan', value: `${(2.4 + metrics.flowRateKgS * 0.06).toFixed(1)} bar` },
        ],
        status: 'Operating',
      }
    }
    case 'pipeline': {
      const connection = target.id ? connectionById.get(target.id) : undefined
      const isHot = connection?.kind !== 'cold'
      return {
        kind: target.kind,
        title: isHot ? 'HOT SUPPLY LINE' : 'RECOVERED HEAT LINE',
        subtitle: `${PIPELINE_SPEC.diameter} · ${PIPELINE_SPEC.material}`,
        stats: [
          {
            label: 'Temperature',
            value: `${(isHot ? metrics.sourceTemperatureC : metrics.receiverTemperatureC).toFixed(1)}°C`,
          },
          { label: 'Flow Rate', value: `${metrics.flowRateKgS.toFixed(1)} kg/s` },
          { label: 'Insulation', value: PIPELINE_SPEC.insulation },
        ],
        status: 'Flowing',
      }
    }
    case 'exchanger':
      return {
        kind: target.kind,
        title: 'HEAT EXCHANGER',
        subtitle: 'HYTERA Thermal Transfer Station',
        stats: [
          { label: 'Heat Transferred', value: `${metrics.heatTransferredMW.toFixed(2)} MW` },
          { label: 'Efficiency', value: `${(metrics.efficiency * 100).toFixed(1)}%` },
          { label: 'Heat Loss', value: `${metrics.heatLossMW.toFixed(2)} MW` },
        ],
        status: 'Operating',
      }
    case 'control-hub': {
      const primary = routeMetrics.find((r) => r.routeId === PRIMARY_ROUTE_ID)
      return {
        kind: target.kind,
        title: 'HYTERA CONTROL HUB',
        subtitle: 'Digital Twin Control Center',
        stats: [
          { label: 'Rute Terpantau', value: `${networkRoutes.length}` },
          { label: 'Node Jaringan', value: `${nodeById.size}` },
          { label: 'Efisiensi Rute Utama', value: `${((primary?.metrics.efficiency ?? metrics.efficiency) * 100).toFixed(1)}%` },
        ],
        status: 'Online',
      }
    }
    case 'secondary': {
      const facility = secondaryFacilities.find((f) => f.id === target.id)
      return {
        kind: target.kind,
        title: 'INDUSTRIAL FACILITY',
        subtitle: facility?.name ?? 'Fasilitas Industri',
        stats: [{ label: 'Tipe', value: facility?.kind ?? 'Fasilitas Pendukung' }],
        status: 'Online',
        compact: true,
      }
    }
  }
}
