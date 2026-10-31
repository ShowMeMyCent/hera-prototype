import { Canvas } from '@react-three/fiber'
import { Loader, PerspectiveCamera, useGLTF } from '@react-three/drei'
import { Component, forwardRef, useEffect, useImperativeHandle, useRef, type ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'
import { CameraControls, type CameraControlsHandle } from './CameraControls'
import { CAMERA_PRESETS } from '../../data/cameraPresets'
import { IndustrialComplex } from './IndustrialComplex'
import { networkNodes } from '../../data/heatNetwork'
import { roadGroups, secondaryFacilities, streetPropGroups } from '../../data/industrialComplex'
import {
  characterGroups,
  forestGroups,
  movingVehicles,
  parkedVehicleGroups,
  railModels,
  trainConsist,
} from '../../data/sceneProps'
import type {
  CameraPresetId,
  NetworkMode,
  RouteMetrics,
  SelectionTarget,
  SimulationMetrics,
} from '../../types/digitalTwin'

// warm the GLTF cache once at module load so every instance of a model is parsed a single time
const ALL_MODELS = new Set<string>([
  ...networkNodes.flatMap((node) => node.parts.map((part) => part.model)),
  ...roadGroups.map((group) => group.model),
  ...streetPropGroups.map((group) => group.model),
  ...secondaryFacilities.flatMap((facility) => facility.parts.map((part) => part.model)),
  ...forestGroups.map((group) => group.model),
  ...parkedVehicleGroups.map((group) => group.model),
  ...movingVehicles.map((vehicle) => vehicle.model),
  ...characterGroups.map((group) => group.model),
  ...trainConsist.map((car) => car.model),
  railModels.straight,
])
ALL_MODELS.forEach((path) => useGLTF.preload(path))

export interface DigitalTwinSceneHandle {
  applyPreset: (id: CameraPresetId) => void
}

interface DigitalTwinSceneProps {
  metrics: SimulationMetrics
  routeMetrics: RouteMetrics[]
  activeRouteIds: Set<string>
  highlightedRouteIds: Set<string> | null
  mode: NetworkMode
  running: boolean
  speedMultiplier: number
  hovered: SelectionTarget | null
  selected: SelectionTarget | null
  onHover: (target: SelectionTarget | null) => void
  onSelect: (target: SelectionTarget | null) => void
}

class ModelErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-bg text-center">
          <AlertTriangle className="h-8 w-8 text-red" />
          <p className="text-sm font-semibold text-text">Unable to load industrial model.</p>
        </div>
      )
    }
    return this.props.children
  }
}

export const DigitalTwinScene = forwardRef<DigitalTwinSceneHandle, DigitalTwinSceneProps>(function DigitalTwinScene(
  props,
  ref,
) {
  const cameraRef = useRef<CameraControlsHandle>(null)

  useImperativeHandle(ref, () => ({
    applyPreset: (id) => cameraRef.current?.applyPreset(id),
  }))

  useEffect(() => {
    document.body.style.cursor = props.hovered ? 'pointer' : 'auto'
    return () => {
      document.body.style.cursor = 'auto'
    }
  }, [props.hovered])

  return (
    <div className="relative h-full w-full">
      <ModelErrorBoundary>
        <Canvas shadows dpr={[1, 1.75]} gl={{ antialias: true }}>
          <PerspectiveCamera makeDefault position={CAMERA_PRESETS.overview.position} fov={38} near={1} far={400} />
          <CameraControls ref={cameraRef} />
          <IndustrialComplex {...props} />
        </Canvas>
      </ModelErrorBoundary>
      <Loader
        containerStyles={{ background: 'rgba(245,248,248,0.92)' }}
        innerStyles={{ width: 200 }}
        barStyles={{ background: '#0875c9' }}
        dataStyles={{ color: '#17212b', fontSize: 12, fontWeight: 600 }}
        dataInterpolation={(p) => `Loading Digital Twin... ${p.toFixed(0)}%`}
      />
    </div>
  )
})
