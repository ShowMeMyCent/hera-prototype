import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { IndustrialModel } from './IndustrialModel'
import { PIPE_Y } from '../../data/heatNetwork'

/**
 * The thermal transfer station: a plant-room building taken from the asset pack plus a
 * procedural exchanger skid (shell-and-tube vessels, manifold, control cabinet) — the pack
 * has no heat-exchanger model, so only this piece of equipment is built from primitives.
 */
export function HeatExchanger({ running }: { running: boolean }) {
  const lightRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const mat = lightRef.current?.material as THREE.MeshStandardMaterial | undefined
    if (!mat) return
    mat.emissiveIntensity = running ? 1.3 + 0.7 * Math.sin(state.clock.elapsedTime * 5) : 0.35
  })

  return (
    <group>
      {/* plant room / pump house beside the skid */}
      <IndustrialModel modelPath="/models/building-k.glb" position={[2.6, 0, 1.4]} rotation={[0, -Math.PI / 2, 0]} scale={1.5} />

      {/* concrete plinth */}
      <mesh position={[0, 0.07, 0]} receiveShadow castShadow>
        <boxGeometry args={[3.1, 0.14, 2.3]} />
        <meshStandardMaterial color="#aab4b8" roughness={0.9} />
      </mesh>

      {/* shell-and-tube exchanger vessels */}
      {[-0.45, 0.45].map((z) => (
        <group key={z} position={[0, 0.82, z]}>
          <mesh castShadow receiveShadow rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.36, 0.36, 2.3, 20]} />
            <meshStandardMaterial color="#67777e" metalness={0.55} roughness={0.38} />
          </mesh>
          {[-1.15, 1.15].map((x) => (
            <mesh key={x} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.42, 0.42, 0.12, 20]} />
              <meshStandardMaterial color="#4e5d64" metalness={0.6} roughness={0.35} />
            </mesh>
          ))}
        </group>
      ))}

      {/* support saddles */}
      {[-0.8, 0.8].map((x) =>
        [-0.45, 0.45].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, 0.37, z]} castShadow>
            <boxGeometry args={[0.18, 0.46, 0.5]} />
            <meshStandardMaterial color="#4b585e" roughness={0.6} metalness={0.4} />
          </mesh>
        )),
      )}

      {/* inlet / outlet manifold stubs, aligned with the corridor pipework */}
      {[-1.5, 1.5].map((z) => (
        <mesh key={z} position={[0, PIPE_Y, z * 0.7]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.17, 0.17, 1.1, 14]} />
          <meshStandardMaterial color="#5a6a71" metalness={0.55} roughness={0.4} />
        </mesh>
      ))}

      {/* control cabinet with a status lamp */}
      <mesh position={[-1.5, 0.52, 0.9]} castShadow receiveShadow>
        <boxGeometry args={[0.42, 0.86, 0.34]} />
        <meshStandardMaterial color="#51606a" roughness={0.6} metalness={0.3} />
      </mesh>
      <mesh ref={lightRef} position={[-1.5, 0.98, 0.9]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial color="#09b8b8" emissive="#09b8b8" emissiveIntensity={0.35} toneMapped={false} />
      </mesh>
    </group>
  )
}
