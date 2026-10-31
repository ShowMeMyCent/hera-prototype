import { useGLTF } from '@react-three/drei'
import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import type { InstanceTransform } from '../../data/industrialComplex'

interface SourceMesh {
  geometry: THREE.BufferGeometry
  material: THREE.Material | THREE.Material[]
  localMatrix: THREE.Matrix4
}

interface InstancedAssetProps {
  modelPath: string
  instances: InstanceTransform[]
  castShadow?: boolean
  receiveShadow?: boolean
}

const TMP_MATRIX = new THREE.Matrix4()
const TMP_INSTANCE = new THREE.Matrix4()
const TMP_POSITION = new THREE.Vector3()
const TMP_QUATERNION = new THREE.Quaternion()
const TMP_SCALE = new THREE.Vector3()
const Y_AXIS = new THREE.Vector3(0, 1, 0)

/**
 * Renders many copies of one GLB as InstancedMeshes — a handful of draw calls instead of
 * one object per tile. Used for the road grid, street furniture and planting, which make
 * up the bulk of the estate's object count and need no per-object interaction.
 */
export function InstancedAsset({ modelPath, instances, castShadow = true, receiveShadow = true }: InstancedAssetProps) {
  const { scene } = useGLTF(modelPath)
  const meshRefs = useRef<(THREE.InstancedMesh | null)[]>([])

  const sourceMeshes = useMemo<SourceMesh[]>(() => {
    const collected: SourceMesh[] = []
    scene.updateMatrixWorld(true)
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        collected.push({
          geometry: child.geometry,
          material: child.material,
          localMatrix: child.matrixWorld.clone(),
        })
      }
    })
    return collected
  }, [scene])

  useLayoutEffect(() => {
    sourceMeshes.forEach((source, index) => {
      const mesh = meshRefs.current[index]
      if (!mesh) return

      instances.forEach((instance, i) => {
        const scale = instance.scale ?? 1
        TMP_POSITION.set(instance.position[0], instance.position[1], instance.position[2])
        TMP_QUATERNION.setFromAxisAngle(Y_AXIS, instance.rotationY ?? 0)
        TMP_SCALE.setScalar(scale)
        TMP_INSTANCE.compose(TMP_POSITION, TMP_QUATERNION, TMP_SCALE)
        TMP_MATRIX.multiplyMatrices(TMP_INSTANCE, source.localMatrix)
        mesh.setMatrixAt(i, TMP_MATRIX)
      })

      mesh.instanceMatrix.needsUpdate = true
      mesh.computeBoundingSphere()
    })
  }, [instances, sourceMeshes])

  return (
    <>
      {sourceMeshes.map((source, index) => (
        <instancedMesh
          key={`${modelPath}-${index}`}
          ref={(node) => {
            meshRefs.current[index] = node
          }}
          args={[source.geometry, source.material as THREE.Material, instances.length]}
          castShadow={castShadow}
          receiveShadow={receiveShadow}
          frustumCulled={false}
        />
      ))}
    </>
  )
}
