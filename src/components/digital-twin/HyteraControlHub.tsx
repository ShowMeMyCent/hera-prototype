import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import type { FacilityPart } from '../../data/industrialComplex'
import { PlantCluster } from './PlantCluster'

interface HyteraControlHubProps {
  parts: FacilityPart[]
  scale?: number
  rotationY?: number
}

/**
 * HYTERA Control Hub — the network's monitoring and AI-matching facility. An ordinary
 * industrial control building (not a futuristic landmark) with a comms mast and beacon.
 */
export function HyteraControlHub({ parts, scale = 1, rotationY = 0 }: HyteraControlHubProps) {
  const beaconRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const mat = beaconRef.current?.material as THREE.MeshStandardMaterial | undefined
    if (!mat) return
    mat.emissiveIntensity = 0.6 + 0.6 * Math.sin(state.clock.elapsedTime * 2)
  })

  return (
    <group>
      <PlantCluster parts={parts} scale={scale} rotationY={rotationY} />

      <mesh position={[-0.8, 3.1, -0.8]} castShadow>
        <cylinderGeometry args={[0.05, 0.07, 1.6, 8]} />
        <meshStandardMaterial color="#8c979c" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh ref={beaconRef} position={[-0.8, 3.95, -0.8]}>
        <sphereGeometry args={[0.1, 10, 10]} />
        <meshStandardMaterial color="#0875c9" emissive="#0875c9" emissiveIntensity={0.6} toneMapped={false} />
      </mesh>
    </group>
  )
}
