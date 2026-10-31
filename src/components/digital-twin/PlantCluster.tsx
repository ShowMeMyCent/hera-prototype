import type { FacilityPart } from '../../data/industrialComplex'
import { IndustrialModel } from './IndustrialModel'

interface PlantClusterProps {
  parts: FacilityPart[]
  scale?: number
  rotationY?: number
}

/**
 * Renders one facility's GLB composition. Every node in the thermal network — plants,
 * pump stations, the control hub — is described as a list of parts in data, so adding a
 * facility never means writing a new 3D component.
 */
export function PlantCluster({ parts, scale = 1, rotationY = 0 }: PlantClusterProps) {
  return (
    <group scale={scale} rotation={[0, rotationY, 0]}>
      {parts.map((part, i) => (
        <IndustrialModel
          key={`${part.model}-${i}`}
          modelPath={part.model}
          position={part.position}
          rotation={part.rotationY ? [0, part.rotationY, 0] : undefined}
          scale={part.scale ?? 1}
        />
      ))}
    </group>
  )
}
