import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

interface HighlightRingProps {
  active: boolean
  position: [number, number, number]
  radius: number
  color: string
  maxOpacity?: number
}

/** Soft pulsing ground ring used to highlight a hovered or selected facility. */
export function HighlightRing({ active, position, radius, color, maxOpacity = 0.45 }: HighlightRingProps) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const mat = ref.current?.material as THREE.MeshBasicMaterial | undefined
    if (!mat) return
    const target = active ? maxOpacity - 0.12 + 0.12 * Math.sin(state.clock.elapsedTime * 3) : 0
    mat.opacity += (target - mat.opacity) * 0.15
  })

  return (
    <mesh ref={ref} position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius * 0.86, radius, 56]} />
      <meshBasicMaterial color={color} transparent opacity={0} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  )
}
