import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { PIPE_Y } from '../../data/heatNetwork'
import type { FacilityPart } from '../../data/industrialComplex'
import { PlantCluster } from './PlantCluster'

interface PumpStationProps {
  parts: FacilityPart[]
  scale?: number
  rotationY?: number
  /** Pumps only spin while the simulation is running and the station is on a live route. */
  active: boolean
}

/**
 * An inline pump/control station on the backbone: the GLB control building from the asset
 * pack plus a small procedural pump skid tied into the corridor pipework.
 */
export function PumpStation({ parts, scale = 1, rotationY = 0, active }: PumpStationProps) {
  const impellerRef = useRef<THREE.Mesh>(null)
  const lampRef = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    if (impellerRef.current && active) impellerRef.current.rotation.z += delta * 6
    const mat = lampRef.current?.material as THREE.MeshStandardMaterial | undefined
    if (mat) mat.emissiveIntensity = active ? 1.1 + 0.7 * Math.sin(state.clock.elapsedTime * 4) : 0.25
  })

  return (
    <group>
      <PlantCluster parts={parts} scale={scale} rotationY={rotationY} />

      {/* pump skid facing the backbone */}
      <group position={[1.9, 0, 0]}>
        <mesh position={[0, 0.06, 0]} receiveShadow castShadow>
          <boxGeometry args={[1.5, 0.12, 1.1]} />
          <meshStandardMaterial color="#aab4b8" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.42, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
          <cylinderGeometry args={[0.26, 0.26, 0.9, 16]} />
          <meshStandardMaterial color="#67777e" metalness={0.55} roughness={0.4} />
        </mesh>
        <mesh ref={impellerRef} position={[0.5, 0.42, 0]} rotation={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 0.14, 12]} />
          <meshStandardMaterial color="#4e5d64" metalness={0.6} roughness={0.35} />
        </mesh>
        {/* riser tying the skid into the elevated corridor pipe */}
        <mesh position={[-0.55, PIPE_Y / 2 + 0.2, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, PIPE_Y + 0.4, 10]} />
          <meshStandardMaterial color="#5a6a71" metalness={0.5} roughness={0.45} />
        </mesh>
        <mesh ref={lampRef} position={[0, 0.78, 0.36]}>
          <sphereGeometry args={[0.07, 10, 10]} />
          <meshStandardMaterial color="#09b8b8" emissive="#09b8b8" emissiveIntensity={0.25} toneMapped={false} />
        </mesh>
      </group>
    </group>
  )
}
