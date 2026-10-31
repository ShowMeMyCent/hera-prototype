import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { HeatFlowParticles } from './HeatFlowParticles'

interface HeatPipelineProps {
  points: [number, number, number][]
  /** Colour of the flow particles. */
  color: string
  /** Colour of the pipe itself. */
  pipeColor: string
  flowSpeed: number
  running: boolean
  /** Idle legs of the network render as plain grey pipework with no flow. */
  dimmed?: boolean
  /** Particle count scales with the leg length so long trunks do not look empty. */
  particleCount?: number
}

const DIM_COLOR = '#b2bdc1'

/** One leg of the network: insulated pipe plus the fluid travelling through it. */
export function HeatPipeline({
  points,
  color,
  pipeColor,
  flowSpeed,
  running,
  dimmed = false,
  particleCount,
}: HeatPipelineProps) {
  const curve = useMemo(
    () => new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)), false, 'catmullrom', 0.08),
    [points],
  )
  const tubeGeometry = useMemo(() => new THREE.TubeGeometry(curve, 72, 0.24, 10, false), [curve])

  useEffect(() => () => tubeGeometry.dispose(), [tubeGeometry])

  const count = useMemo(() => {
    if (particleCount != null) return particleCount
    return Math.max(3, Math.min(14, Math.round(curve.getLength() / 2.2)))
  }, [curve, particleCount])

  return (
    <group>
      <mesh geometry={tubeGeometry} castShadow receiveShadow>
        <meshStandardMaterial
          color={dimmed ? DIM_COLOR : pipeColor}
          metalness={dimmed ? 0.2 : 0.5}
          roughness={dimmed ? 0.8 : 0.4}
        />
      </mesh>
      {!dimmed && (
        <HeatFlowParticles curve={curve} color={color} speed={flowSpeed} active={running} count={count} />
      )}
    </group>
  )
}
