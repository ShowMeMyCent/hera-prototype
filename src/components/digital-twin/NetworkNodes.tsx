import { Suspense } from 'react'
import { networkNodes, type NetworkNode, type NetworkNodeKind } from '../../data/heatNetwork'
import type { SelectionTarget } from '../../types/digitalTwin'
import { FacilityPad } from './FacilityPad'
import { HighlightRing } from './HighlightRing'
import { HyteraControlHub } from './HyteraControlHub'
import { PlantCluster } from './PlantCluster'
import { PumpStation } from './PumpStation'

interface NetworkNodesProps {
  /** Nodes sitting on a route that is currently carrying heat. */
  activeNodeIds: Set<string>
  hovered: SelectionTarget | null
  selected: SelectionTarget | null
  running: boolean
  bind: (target: SelectionTarget) => Record<string, unknown>
}

const ACCENT: Record<NetworkNodeKind, string> = {
  source: '#f0a861',
  receiver: '#5cc3c3',
  pump: '#8fa8bb',
  hub: '#7fb4e0',
  exchanger: '#6aa9dd',
}

const RING_COLOR: Record<NetworkNodeKind, string> = {
  source: '#ff9f43',
  receiver: '#09b8b8',
  pump: '#0875c9',
  hub: '#0875c9',
  exchanger: '#0875c9',
}

const IDLE_ACCENT = '#b9c4c8'

/** Target kind used by the inspector for a given node. */
function targetFor(node: NetworkNode): SelectionTarget {
  if (node.kind === 'hub') return { kind: 'control-hub', id: node.id }
  if (node.kind === 'pump') return { kind: 'pump', id: node.id }
  return { kind: node.kind === 'source' ? 'source' : 'receiver', id: node.id }
}

function NodeBody({ node, active, running }: { node: NetworkNode; active: boolean; running: boolean }) {
  if (node.kind === 'hub') {
    return <HyteraControlHub parts={node.parts} scale={node.scale ?? 1} rotationY={node.rotationY ?? 0} />
  }
  if (node.kind === 'pump') {
    return (
      <PumpStation
        parts={node.parts}
        scale={node.scale ?? 1}
        rotationY={node.rotationY ?? 0}
        active={active && running}
      />
    )
  }
  return <PlantCluster parts={node.parts} scale={node.scale ?? 1} rotationY={node.rotationY ?? 0} />
}

/**
 * Every facility that belongs to the thermal network: heat sources, heat receivers,
 * pump stations and the control hub. All of them come from data, so the network grows by
 * editing data/heatNetwork.ts rather than this component.
 */
export function NetworkNodes({ activeNodeIds, hovered, selected, running, bind }: NetworkNodesProps) {
  return (
    <group>
      {networkNodes.map((node) => {
        const target = targetFor(node)
        const active = activeNodeIds.has(node.id)
        const isHighlighted =
          (hovered?.id === node.id && hovered.kind === target.kind) ||
          (selected?.id === node.id && selected.kind === target.kind)
        const padRadius = node.pad ? Math.max(node.pad.width, node.pad.depth) / 2 + 0.6 : 3

        return (
          <group key={node.id}>
            {node.pad && (
              <FacilityPad
                position={[node.position[0], 0, node.position[2]]}
                width={node.pad.width}
                depth={node.pad.depth}
                accent={active ? ACCENT[node.kind] : IDLE_ACCENT}
              />
            )}

            <group {...bind(target)} position={node.position}>
              <Suspense fallback={null}>
                <NodeBody node={node} active={active} running={running} />
              </Suspense>
            </group>

            <HighlightRing
              active={isHighlighted}
              position={[node.position[0], 0.035, node.position[2]]}
              radius={padRadius}
              color={RING_COLOR[node.kind]}
            />
          </group>
        )
      })}
    </group>
  )
}
