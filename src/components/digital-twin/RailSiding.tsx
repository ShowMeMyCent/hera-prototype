import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import {
  RAIL_END_Z,
  RAIL_START_Z,
  RAIL_X,
  railModels,
  railTrack,
  TRAIN_SPEED,
  TRAIN_Y,
  trainConsist,
} from '../../data/sceneProps'
import { IndustrialModel } from './IndustrialModel'
import { InstancedAsset } from './InstancedAssets'

interface RailSidingProps {
  running: boolean
  speedMultiplier: number
}

const RAIL_LENGTH = RAIL_END_Z - RAIL_START_Z
/** Length of the whole consist, so the rearmost car never runs off the end of the track. */
const CONSIST_LENGTH = trainConsist[trainConsist.length - 1].offset + 2
const RUN_LENGTH = RAIL_LENGTH - CONSIST_LENGTH

/**
 * The estate's rail siding: instanced track along the eastern boundary with a freight
 * consist that runs while the simulation does, so the district has movement at its edge.
 */
export function RailSiding({ running, speedMultiplier }: RailSidingProps) {
  const trainRef = useRef<THREE.Group>(null)
  const travelled = useRef(0)

  useFrame((_, delta) => {
    const group = trainRef.current
    if (!group) return

    if (running) {
      travelled.current = (travelled.current + TRAIN_SPEED * speedMultiplier * Math.min(delta, 0.1)) % RUN_LENGTH
    }

    group.position.z = RAIL_START_Z + CONSIST_LENGTH + travelled.current
  })

  return (
    <group>
      <InstancedAsset modelPath={railModels.straight} instances={railTrack} castShadow={false} />

      <group ref={trainRef} position={[RAIL_X, 0, RAIL_START_Z]}>
        {trainConsist.map((car) => (
          <group key={car.model} position={[0, TRAIN_Y, -car.offset]}>
            <IndustrialModel modelPath={car.model} />
          </group>
        ))}
      </group>
    </group>
  )
}
