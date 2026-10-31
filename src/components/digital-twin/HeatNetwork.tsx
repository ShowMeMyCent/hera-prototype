import { EXCHANGER_ANCHOR, networkConnections, PIPE_Y, pipeSupports } from '../../data/heatNetwork'
import type { SelectionTarget } from '../../types/digitalTwin'
import { FacilityPad } from './FacilityPad'
import { HeatExchanger } from './HeatExchanger'
import { HeatPipeline } from './HeatPipeline'
import { HighlightRing } from './HighlightRing'

interface HeatNetworkProps {
  running: boolean
  flowSpeed: number
  /** Connections on a route that is currently carrying heat. */
  activeConnectionIds: Set<string>
  hovered: SelectionTarget | null
  selected: SelectionTarget | null
  bind: (target: SelectionTarget) => Record<string, unknown>
}

const PIPE_COLORS = {
  hot: { pipe: '#c96a2e', flow: '#ff9f43' },
  cold: { pipe: '#1f8a8a', flow: '#09b8b8' },
}

/** Posts carrying the corridor pipework so the network reads as built infrastructure. */
function PipeSupports() {
  return (
    <group>
      {pipeSupports.map(([x, z], i) => (
        <group key={`${x.toFixed(2)}-${z.toFixed(2)}-${i}`} position={[x, 0, z]}>
          <mesh position={[0, PIPE_Y / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.14, PIPE_Y, 0.14]} />
            <meshStandardMaterial color="#8c969b" roughness={0.75} metalness={0.25} />
          </mesh>
          <mesh position={[0, PIPE_Y, 0]} castShadow>
            <boxGeometry args={[0.52, 0.08, 0.2]} />
            <meshStandardMaterial color="#79848a" roughness={0.7} metalness={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/**
 * The shared thermal network: every branch and backbone segment is rendered from the
 * connection list, so new legs appear simply by being added to data/heatNetwork.ts.
 * Legs that are not carrying heat in the current mode render as idle grey pipework.
 */
export function HeatNetwork({ running, flowSpeed, activeConnectionIds, hovered, selected, bind }: HeatNetworkProps) {
  const exchangerActive = hovered?.kind === 'exchanger' || selected?.kind === 'exchanger'

  return (
    <group>
      <FacilityPad position={[EXCHANGER_ANCHOR[0] + 0.6, 0, EXCHANGER_ANCHOR[2]]} width={7.5} depth={5.5} accent="#6aa9dd" />
      <PipeSupports />

      {networkConnections.map((connection) => {
        const colors = PIPE_COLORS[connection.kind]
        const dimmed = !activeConnectionIds.has(connection.id)

        return (
          <group key={connection.id} {...bind({ kind: 'pipeline', id: connection.id })}>
            <HeatPipeline
              points={connection.points}
              color={colors.flow}
              pipeColor={colors.pipe}
              flowSpeed={flowSpeed}
              running={running}
              dimmed={dimmed}
            />
          </group>
        )
      })}

      <group {...bind({ kind: 'exchanger' })} position={EXCHANGER_ANCHOR}>
        <HeatExchanger running={running} />
      </group>
      <HighlightRing
        active={exchangerActive}
        position={[EXCHANGER_ANCHOR[0], 0.035, EXCHANGER_ANCHOR[2]]}
        radius={3.2}
        color="#0875c9"
      />
    </group>
  )
}
