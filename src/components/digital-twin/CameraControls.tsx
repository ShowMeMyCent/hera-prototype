import { OrbitControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import * as THREE from 'three'
import { CAMERA_PRESETS } from '../../data/cameraPresets'
import type { CameraPresetId } from '../../types/digitalTwin'

export interface CameraControlsHandle {
  applyPreset: (id: CameraPresetId) => void
}

/** OrbitControls plus animated transitions between the camera presets. */
export const CameraControls = forwardRef<CameraControlsHandle>(function CameraControls(_props, ref) {
  const controlsRef = useRef<OrbitControlsImpl | null>(null)
  const { camera } = useThree()
  const goal = useRef<{ position: THREE.Vector3; target: THREE.Vector3 } | null>(null)

  useImperativeHandle(ref, () => ({
    applyPreset(id) {
      const preset = CAMERA_PRESETS[id]
      goal.current = {
        position: new THREE.Vector3(...preset.position),
        target: new THREE.Vector3(...preset.target),
      }
    },
  }))

  // grabbing the scene cancels an in-flight transition so the user always keeps control
  useEffect(() => {
    const controls = controlsRef.current
    if (!controls) return
    const cancel = () => {
      goal.current = null
    }
    controls.addEventListener('start', cancel)
    return () => controls.removeEventListener('start', cancel)
  }, [])

  useFrame(() => {
    const controls = controlsRef.current
    const target = goal.current
    if (!controls || !target) return

    camera.position.lerp(target.position, 0.09)
    controls.target.lerp(target.target, 0.09)
    controls.update()

    if (camera.position.distanceTo(target.position) < 0.3 && controls.target.distanceTo(target.target) < 0.3) {
      goal.current = null
    }
  })

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      target={CAMERA_PRESETS.overview.target}
      enableDamping
      dampingFactor={0.08}
      minDistance={18}
      maxDistance={170}
      minPolarAngle={0.25}
      maxPolarAngle={1.32}
    />
  )
})
