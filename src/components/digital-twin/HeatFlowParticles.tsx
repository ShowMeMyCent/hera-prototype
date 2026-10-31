import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

interface HeatFlowParticlesProps {
  curve: THREE.CatmullRomCurve3
  color: string
  count?: number
  /** Multiplier derived from the simulated flow rate — higher flow, faster travel. */
  speed: number
  active: boolean
  radius?: number
}

const DUMMY = new THREE.Object3D()

/** Glowing slugs of fluid travelling source → exchanger → receiver along a pipeline curve. */
export function HeatFlowParticles({ curve, color, count = 10, speed, active, radius = 0.13 }: HeatFlowParticlesProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const offsets = useMemo(() => Array.from({ length: count }, (_, i) => i / count), [count])
  const material = useMemo(
    () => new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 1.5, toneMapped: false }),
    [color],
  )

  useEffect(() => () => material.dispose(), [material])

  useFrame((state, delta) => {
    const mesh = meshRef.current
    if (!mesh) return
    const dt = active ? Math.min(delta, 0.1) * speed : 0

    offsets.forEach((offset, i) => {
      offsets[i] = (offset + dt * 0.1) % 1
      const point = curve.getPointAt(offsets[i])
      DUMMY.position.copy(point)
      const pulse = 1 + 0.12 * Math.sin(state.clock.elapsedTime * 4 + i)
      DUMMY.scale.setScalar(active ? pulse : 0.0001)
      DUMMY.updateMatrix()
      mesh.setMatrixAt(i, DUMMY.matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} material={material} frustumCulled={false}>
      <sphereGeometry args={[radius, 8, 8]} />
    </instancedMesh>
  )
}
