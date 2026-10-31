import { ArrowLeft, GitBranch, Share2 } from 'lucide-react'
import { useMemo, useRef, useState, type MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageContainer } from '../components/layout/PageContainer'
import { DigitalTwinScene, type DigitalTwinSceneHandle } from '../components/digital-twin/DigitalTwinScene'
import { SimulationControls } from '../components/digital-twin/SimulationControls'
import { SimulationConfigBar } from '../components/digital-twin/SimulationConfigBar'
import { ObjectInspector } from '../components/digital-twin/ObjectInspector'
import { NetworkOverviewPanel } from '../components/digital-twin/NetworkOverviewPanel'
import { KPIGrid } from '../components/digital-twin/KPIGrid'
import { HeatRecoverySankey } from '../components/digital-twin/HeatRecoverySankey'
import { EnergySummary } from '../components/digital-twin/EnergySummary'
import { EconomicSankey } from '../components/digital-twin/EconomicSankey'
import { EconomicSummary } from '../components/digital-twin/EconomicSummary'
import { DEFAULT_RECEIVER_ID, DEFAULT_SOURCE_ID, RECEIVER_PROFILES, SOURCE_PROFILES } from '../data/digitalTwinData'
import { routesForNode } from '../data/heatNetwork'
import { useDigitalTwinSimulation } from '../hooks/useDigitalTwinSimulation'
import { getObjectInspection } from '../lib/digitalTwinInspection'
import { cn } from '../lib/utils'
import type { CameraPresetId, NetworkMode, SelectionTarget } from '../types/digitalTwin'

const RUNTIME_OPTIONS = [
  { value: '60', label: '60 Minutes' },
  { value: '120', label: '120 Minutes' },
  { value: '180', label: '180 Minutes' },
]

const CAMERA_VIEWS: { id: CameraPresetId; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'source', label: 'Source' },
  { id: 'network', label: 'Heat Network' },
  { id: 'receiver', label: 'Receiver' },
]

const MODES: { id: NetworkMode; label: string; icon: typeof GitBranch }[] = [
  { id: 'single', label: 'Single Pair', icon: GitBranch },
  { id: 'network', label: 'Network Overview', icon: Share2 },
]

export function DigitalTwinPage() {
  const navigate = useNavigate()
  const sceneRef = useRef<DigitalTwinSceneHandle>(null)
  const viewportRef = useRef<HTMLDivElement>(null)

  const [sourceId, setSourceId] = useState(DEFAULT_SOURCE_ID)
  const [receiverId, setReceiverId] = useState(DEFAULT_RECEIVER_ID)
  const [runtimeMinutes, setRuntimeMinutes] = useState('120')
  const [mode, setMode] = useState<NetworkMode>('network')

  const [hovered, setHovered] = useState<SelectionTarget | null>(null)
  const [selected, setSelected] = useState<SelectionTarget | null>(null)
  const [pinnedRouteId, setPinnedRouteId] = useState<string | null>(null)
  const [activeView, setActiveView] = useState<CameraPresetId>('overview')
  const [cursor, setCursor] = useState({ x: 0, y: 0, width: 0 })

  const source = useMemo(() => SOURCE_PROFILES.find((p) => p.id === sourceId) ?? SOURCE_PROFILES[0], [sourceId])
  const receiver = useMemo(
    () => RECEIVER_PROFILES.find((p) => p.id === receiverId) ?? RECEIVER_PROFILES[0],
    [receiverId],
  )

  const {
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
  } = useDigitalTwinSimulation({ source, receiver, runtimeMinutes: Number(runtimeMinutes), mode })

  const sourceOptions = SOURCE_PROFILES.map((p) => ({ value: p.id, label: p.name }))
  const receiverOptions = RECEIVER_PROFILES.map((p) => ({ value: p.id, label: p.name }))

  // Pointing at a plant in the scene, or a row in the network panel, isolates its route.
  const highlightedRouteIds = useMemo(() => {
    if (pinnedRouteId) return new Set([pinnedRouteId])

    const target = selected ?? hovered
    if (!target?.id) return null
    if (target.kind !== 'source' && target.kind !== 'receiver') return null

    const routes = routesForNode(target.id)
    return routes.length > 0 ? new Set(routes.map((r) => r.id)) : null
  }, [pinnedRouteId, selected, hovered])

  function handleViewportMouseMove(e: MouseEvent<HTMLDivElement>) {
    const rect = viewportRef.current?.getBoundingClientRect()
    if (!rect) return
    setCursor({ x: e.clientX - rect.left, y: e.clientY - rect.top, width: rect.width })
  }

  function handleView(id: CameraPresetId) {
    setActiveView(id)
    sceneRef.current?.applyPreset(id)
  }

  function handleSelect(target: SelectionTarget | null) {
    setSelected((prev) =>
      prev && target && prev.kind === target.kind && prev.id === target.id ? null : target,
    )
  }

  const hoveredInspection = hovered
    ? getObjectInspection(hovered, source, receiver, metrics, routeMetrics)
    : null
  const selectedInspection = selected
    ? getObjectInspection(selected, source, receiver, metrics, routeMetrics)
    : null

  return (
    <PageContainer className="flex flex-col gap-6">
      <button
        type="button"
        onClick={() => navigate('/analytics')}
        className="flex w-fit items-center gap-1.5 text-sm font-semibold text-text-secondary hover:text-text"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Analytics
      </button>

      <SimulationConfigBar
        sourceOptions={sourceOptions}
        receiverOptions={receiverOptions}
        sourceId={sourceId}
        receiverId={receiverId}
        onSourceChange={setSourceId}
        onReceiverChange={setReceiverId}
        runtimeOptions={RUNTIME_OPTIONS}
        runtimeMinutes={runtimeMinutes}
        onRuntimeChange={setRuntimeMinutes}
        feasible={metrics.feasible}
      />

      <div
        ref={viewportRef}
        onMouseMove={handleViewportMouseMove}
        onMouseLeave={() => setHovered(null)}
        className="relative h-120 overflow-hidden rounded-[14px] border border-border bg-bg shadow-card sm:h-150 lg:h-175"
      >
        <DigitalTwinScene
          ref={sceneRef}
          metrics={metrics}
          routeMetrics={routeMetrics}
          activeRouteIds={activeRouteIds}
          highlightedRouteIds={highlightedRouteIds}
          mode={mode}
          running={running}
          speedMultiplier={speed}
          hovered={hovered}
          selected={selected}
          onHover={setHovered}
          onSelect={handleSelect}
        />

        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-3 sm:p-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="pointer-events-auto flex items-center gap-1 rounded-lg border border-border bg-white/95 p-1 shadow-card">
              {MODES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setMode(item.id)}
                  className={cn(
                    'flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors',
                    mode === item.id
                      ? 'bg-turquoise/10 text-turquoise-dark'
                      : 'text-text-secondary hover:bg-black/4 hover:text-text',
                  )}
                >
                  <item.icon className="h-3.5 w-3.5" />
                  {item.label}
                </button>
              ))}
            </div>

            <div className="pointer-events-auto flex flex-wrap items-center gap-1 rounded-lg border border-border bg-white/95 p-1 shadow-card">
              {CAMERA_VIEWS.map((view) => (
                <button
                  key={view.id}
                  type="button"
                  onClick={() => handleView(view.id)}
                  className={cn(
                    'rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors',
                    activeView === view.id
                      ? 'bg-primary/10 text-primary'
                      : 'text-text-secondary hover:bg-black/4 hover:text-text',
                  )}
                >
                  {view.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-end justify-between gap-3">
            <SimulationControls
              running={running}
              elapsedSec={elapsedSec}
              runtimeSec={runtimeSec}
              speed={speed}
              onStart={start}
              onPause={pause}
              onReset={reset}
              onSeek={seek}
              onSpeedChange={setSpeed}
              className="pointer-events-auto"
            />

            {selectedInspection && (
              <div className="pointer-events-auto hidden sm:block">
                <ObjectInspector
                  inspection={selectedInspection}
                  variant="detail"
                  onClose={() => setSelected(null)}
                />
              </div>
            )}
          </div>
        </div>

        {hoveredInspection && !selected && (
          <div
            className="pointer-events-none absolute z-30"
            style={{
              left: Math.min(cursor.x + 18, (cursor.width || 9999) - 220),
              top: Math.max(cursor.y - 90, 8),
            }}
          >
            <ObjectInspector inspection={hoveredInspection} variant="hover" />
          </div>
        )}

        {selectedInspection && (
          <div className="pointer-events-auto absolute right-3 bottom-3 z-30 sm:hidden">
            <ObjectInspector inspection={selectedInspection} variant="detail" onClose={() => setSelected(null)} />
          </div>
        )}
      </div>

      <NetworkOverviewPanel
        networkMetrics={networkMetrics}
        routeMetrics={routeMetrics}
        activeRouteIds={activeRouteIds}
        highlightedRouteId={pinnedRouteId}
        onHighlightRoute={setPinnedRouteId}
      />

      <KPIGrid source={source} receiver={receiver} metrics={metrics} elapsedSec={elapsedSec} />

      <HeatRecoverySankey source={source} receiver={receiver} metrics={metrics} />
      <EnergySummary metrics={metrics} />

      <EconomicSankey />
      <EconomicSummary />
    </PageContainer>
  )
}
