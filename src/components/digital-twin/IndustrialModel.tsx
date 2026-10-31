import { useGLTF } from '@react-three/drei'
import { useLayoutEffect, useMemo } from 'react'
import * as THREE from 'three'

export interface IndustrialModelProps {
  modelPath: string
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number | [number, number, number]
  /** Optional flat tint override; omit to use the model's own baked colormap texture. */
  color?: string
}

export function IndustrialModel({
  modelPath,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  color,
}: IndustrialModelProps) {
  const { scene } = useGLTF(modelPath)
  const cloned = useMemo(() => scene.clone(true), [scene])

  useLayoutEffect(() => {
    const overrideMaterial = color
      ? new THREE.MeshStandardMaterial({ color, roughness: 0.82, metalness: 0.05 })
      : null
    cloned.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true
        child.receiveShadow = true
        if (overrideMaterial) child.material = overrideMaterial
        else if (child.material instanceof THREE.MeshStandardMaterial) {
          child.material.roughness = 0.85
          child.material.metalness = 0.05
        }
      }
    })
    return () => overrideMaterial?.dispose()
  }, [cloned, color])

  return <primitive object={cloned} position={position} rotation={rotation} scale={scale} />
}
