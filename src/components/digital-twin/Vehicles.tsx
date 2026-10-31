import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { movingVehicles, parkedVehicleGroups, VEHICLE_Y, type VehiclePath } from '../../data/sceneProps'
import { IndustrialModel } from './IndustrialModel'
import { InstancedAsset } from './InstancedAssets'

const VEHICLE_SCALE = 0.55

/** One vehicle looping along a straight run of road, facing its direction of travel. */
function MovingVehicle({ vehicle, running, speedMultiplier }: { vehicle: VehiclePath; running: boolean; speedMultiplier: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const progress = useRef(vehicle.phase)

  const [[x1, z1], [x2, z2]] = vehicle.path
  const dx = x2 - x1
  const dz = z2 - z1
  const length = Math.hypot(dx, dz)
  const heading = Math.atan2(dx, dz)
  const scale = vehicle.scale ?? VEHICLE_SCALE

  useFrame((_, delta) => {
    const group = groupRef.current
    if (!group) return

    if (running) {
      progress.current = (progress.current + (vehicle.speed * speedMultiplier * Math.min(delta, 0.1)) / length) % 1
    }

    const t = progress.current
    group.position.set(x1 + dx * t, VEHICLE_Y, z1 + dz * t)
    group.rotation.y = heading
  })

  return (
    <group ref={groupRef}>
      <IndustrialModel modelPath={vehicle.model} scale={scale} />
    </group>
  )
}

interface VehiclesProps {
  running: boolean
  speedMultiplier: number
}

/**
 * Estate traffic: parked fleet in the plant yards (instanced, static) plus a handful of
 * vehicles circulating on the main roads while the simulation runs.
 */
export function Vehicles({ running, speedMultiplier }: VehiclesProps) {
  return (
    <group>
      {parkedVehicleGroups.map((group) => (
        <InstancedAsset key={group.model} modelPath={group.model} instances={group.instances} />
      ))}

      {movingVehicles.map((vehicle) => (
        <MovingVehicle
          key={`${vehicle.model}-${vehicle.phase}`}
          vehicle={vehicle}
          running={running}
          speedMultiplier={speedMultiplier}
        />
      ))}
    </group>
  )
}
