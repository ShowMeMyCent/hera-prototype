import { ArrowRight, Gauge, Network, Thermometer, TrendingDown, Zap } from 'lucide-react'
import { PRIMARY_ROUTE_ID } from '../../data/heatNetwork'
import type { NetworkMetrics, RouteMetrics } from '../../types/digitalTwin'
import { Badge } from '../ui/Badge'
import { Card } from '../ui/Card'
import { cn } from '../../lib/utils'

interface NetworkOverviewPanelProps {
  networkMetrics: NetworkMetrics
  routeMetrics: RouteMetrics[]
  activeRouteIds: Set<string>
  highlightedRouteId: string | null
  onHighlightRoute: (routeId: string | null) => void
}

function NetworkStat({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Zap
  label: string
  value: string
  tone: string
}) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: `${tone}1a`, color: tone }}>
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-[11px] font-semibold tracking-wide text-text-secondary uppercase">{label}</p>
        <p className="text-sm font-bold text-text">{value}</p>
      </div>
    </div>
  )
}

/**
 * Network-level roll-up across every live route on the shared backbone, plus the route
 * list itself — hovering a row highlights that route in the 3D scene.
 */
export function NetworkOverviewPanel({
  networkMetrics,
  routeMetrics,
  activeRouteIds,
  highlightedRouteId,
  onHighlightRoute,
}: NetworkOverviewPanelProps) {
  return (
    <Card className="flex flex-col gap-5 p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-text">Network KPI</h2>
          <p className="text-sm text-text-secondary">
            Ringkasan seluruh jaringan panas pada thermal backbone bersama
          </p>
        </div>
        <Badge tone="turquoise" dot>
          {networkMetrics.activeRoutes} / {networkMetrics.totalRoutes} rute aktif
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <NetworkStat
          icon={Zap}
          label="Total Panas Tersedia"
          value={`${networkMetrics.heatAvailableMW.toFixed(2)} MW`}
          tone="#d97706"
        />
        <NetworkStat
          icon={Network}
          label="Total Panas Tersalurkan"
          value={`${networkMetrics.heatTransferredMW.toFixed(2)} MW`}
          tone="#078b68"
        />
        <NetworkStat
          icon={TrendingDown}
          label="Total Kehilangan"
          value={`${networkMetrics.heatLossMW.toFixed(2)} MW`}
          tone="#d6362f"
        />
        <NetworkStat
          icon={Gauge}
          label="Efisiensi Jaringan"
          value={`${(networkMetrics.efficiency * 100).toFixed(1)}%`}
          tone="#09b8b8"
        />
        <NetworkStat
          icon={Thermometer}
          label="Total Laju Aliran"
          value={`${networkMetrics.flowRateKgS.toFixed(1)} kg/s`}
          tone="#0875c9"
        />
      </div>

      <div className="flex flex-col gap-2 border-t border-border pt-4">
        <p className="text-xs font-bold tracking-wide text-text-secondary uppercase">Rute Pertukaran Panas</p>
        {routeMetrics.map((route) => {
          const active = activeRouteIds.has(route.routeId)
          const highlighted = highlightedRouteId === route.routeId

          return (
            <button
              key={route.routeId}
              type="button"
              onMouseEnter={() => onHighlightRoute(route.routeId)}
              onMouseLeave={() => onHighlightRoute(null)}
              onFocus={() => onHighlightRoute(route.routeId)}
              onBlur={() => onHighlightRoute(null)}
              className={cn(
                'flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-lg border px-3.5 py-2.5 text-left transition-colors',
                highlighted ? 'border-primary/40 bg-primary/5' : 'border-border hover:bg-black/3',
                !active && 'opacity-55',
              )}
            >
              <div className="flex min-w-0 items-center gap-2">
                <span className="truncate text-sm font-semibold text-text">{route.sourceName}</span>
                <ArrowRight className="h-3.5 w-3.5 shrink-0 text-text-secondary" />
                <span className="truncate text-sm font-semibold text-text">{route.receiverName}</span>
                {route.routeId === PRIMARY_ROUTE_ID && (
                  <Badge tone="blue" className="shrink-0">
                    Pair Utama
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-4 text-xs">
                <span className="text-text-secondary">
                  Transfer <span className="font-semibold text-text">{route.metrics.heatTransferredMW.toFixed(2)} MW</span>
                </span>
                <span className="text-text-secondary">
                  Efisiensi{' '}
                  <span className="font-semibold text-turquoise-dark">
                    {(route.metrics.efficiency * 100).toFixed(1)}%
                  </span>
                </span>
                <Badge tone={active ? 'green' : 'neutral'}>{active ? 'Aktif' : 'Standby'}</Badge>
              </div>
            </button>
          )
        })}
      </div>
    </Card>
  )
}
