interface FacilityPadProps {
  position: [number, number, number]
  width: number
  depth: number
  rotationY?: number
  /** Colour of the site boundary strip framing the pad. */
  accent: string
}

/**
 * Concrete site apron with a coloured boundary strip. Only the facilities that take part
 * in the simulated exchange get one, which is what lifts them out of the surrounding estate.
 */
export function FacilityPad({ position, width, depth, rotationY = 0, accent }: FacilityPadProps) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]} receiveShadow>
        <planeGeometry args={[width + 1.1, depth + 1.1]} />
        <meshStandardMaterial color={accent} roughness={0.95} transparent opacity={0.55} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 0]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color="#e3e9ea" roughness={0.98} />
      </mesh>
    </group>
  )
}
