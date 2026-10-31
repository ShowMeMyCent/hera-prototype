/**
 * Living detail layered over the estate: planting, parked and moving vehicles, workers
 * and the rail siding. Everything here is scattered deterministically (a sin-based hash,
 * never Math.random) so the estate looks identical on every load, and every placement is
 * checked against the roads, facility aprons and pipeline corridor before being kept.
 */

import { networkConnections, networkNodes } from './heatNetwork'
import { ESTATE, secondaryFacilities, type InstanceTransform } from './industrialComplex'

const FOREST = (name: string) => `/models/forest/${name}.glb`
const CAR = (name: string) => `/models/cars/${name}.glb`
const PERSON = (name: string) => `/models/people/${name}.glb`
const TRAIN = (name: string) => `/models/train/${name}.glb`

/**
 * Every Kenney kit models its props standing on y=0, so vehicles and people need no lift.
 * The rolling stock is the exception: it rides on the railhead.
 */
export const VEHICLE_Y = 0

/** The siding runs north-south just inside the eastern boundary, clear of the road grid. */
export const RAIL_X = 34
export const RAIL_START_Z = -36
export const RAIL_END_Z = 36
const RAIL_SEGMENT = 4
/** The track GLB is authored one unit below its origin, so every tie is lifted back up. */
const RAIL_LIFT = 1
/** Top of the railhead, where the rolling stock's wheels sit. */
export const TRAIN_Y = 0.1

// --- deterministic scatter helpers -----------------------------------------

function hash(x: number, z: number, salt = 0): number {
  const v = Math.sin(x * 127.1 + z * 311.7 + salt * 74.7) * 43758.5453
  return v - Math.floor(v)
}

function distanceToSegment(px: number, pz: number, x1: number, z1: number, x2: number, z2: number): number {
  const dx = x2 - x1
  const dz = z2 - z1
  const lengthSq = dx * dx + dz * dz
  if (lengthSq === 0) return Math.hypot(px - x1, pz - z1)
  const t = Math.max(0, Math.min(1, ((px - x1) * dx + (pz - z1) * dz) / lengthSq))
  return Math.hypot(px - (x1 + t * dx), pz - (z1 + t * dz))
}

function onRoad(x: number, z: number, margin: number): boolean {
  return (
    ESTATE.verticalRoadsX.some((rx) => Math.abs(x - rx) < 1.2 + margin) ||
    ESTATE.horizontalRoadsZ.some((rz) => Math.abs(z - rz) < 1.2 + margin)
  )
}

function onFacility(x: number, z: number, margin: number): boolean {
  for (const node of networkNodes) {
    const halfW = (node.pad?.width ?? 4) / 2 + margin
    const halfD = (node.pad?.depth ?? 4) / 2 + margin
    if (Math.abs(x - node.position[0]) < halfW && Math.abs(z - node.position[2]) < halfD) return true
  }
  for (const facility of secondaryFacilities) {
    const radius = 3.4 * facility.scale * 0.8 + margin
    if (Math.hypot(x - facility.position[0], z - facility.position[2]) < radius) return true
  }
  return false
}

function onPipeline(x: number, z: number, margin: number): boolean {
  return networkConnections.some((connection) =>
    connection.points.some((point, i) => {
      if (i === connection.points.length - 1) return false
      const next = connection.points[i + 1]
      return distanceToSegment(x, z, point[0], point[2], next[0], next[2]) < 1.4 + margin
    }),
  )
}

function onRail(x: number, z: number, margin: number): boolean {
  return Math.abs(x - RAIL_X) < 1.6 + margin && z > RAIL_START_Z - 2 && z < RAIL_END_Z + 2
}

/** True when a prop can stand at this spot without fouling infrastructure. */
export function isOpenGround(x: number, z: number, margin = 0): boolean {
  return !onRoad(x, z, margin) && !onFacility(x, z, margin) && !onPipeline(x, z, margin) && !onRail(x, z, margin)
}

interface ScatterOptions {
  step: number
  jitter: number
  density: number
  margin: number
  salt: number
  minScale: number
  maxScale: number
  bounds?: { minX: number; maxX: number; minZ: number; maxZ: number }
}

function scatter({ step, jitter, density, margin, salt, minScale, maxScale, bounds }: ScatterOptions): InstanceTransform[] {
  // planting runs well past the estate boundary so the green fades into the fog
  // rather than ending on a visible line
  const area = bounds ?? { minX: ESTATE.minX - 18, maxX: ESTATE.maxX + 18, minZ: ESTATE.minZ - 18, maxZ: ESTATE.maxZ + 18 }
  const out: InstanceTransform[] = []

  for (let x = area.minX; x <= area.maxX; x += step) {
    for (let z = area.minZ; z <= area.maxZ; z += step) {
      const h = hash(x, z, salt)
      if (h > density) continue

      const px = x + (hash(x, z, salt + 1) - 0.5) * jitter
      const pz = z + (hash(x, z, salt + 2) - 0.5) * jitter
      if (!isOpenGround(px, pz, margin)) continue

      out.push({
        position: [px, 0, pz],
        rotationY: hash(px, pz, salt + 3) * Math.PI * 2,
        scale: minScale + hash(px, pz, salt + 4) * (maxScale - minScale),
      })
    }
  }

  return out
}

// --- planting ---------------------------------------------------------------

export const trees: InstanceTransform[] = scatter({
  step: 5,
  jitter: 3.2,
  density: 0.42,
  margin: 1.1,
  salt: 7,
  minScale: 0.9,
  maxScale: 1.35,
})

export const tallTrees: InstanceTransform[] = scatter({
  step: 7.5,
  jitter: 3.6,
  density: 0.3,
  margin: 1.3,
  salt: 13,
  minScale: 0.85,
  maxScale: 1.2,
})

export const plants: InstanceTransform[] = scatter({
  step: 4.2,
  jitter: 2.4,
  density: 0.3,
  margin: 0.5,
  salt: 21,
  minScale: 1,
  maxScale: 1.8,
})

export const stones: InstanceTransform[] = scatter({
  step: 11,
  jitter: 4,
  density: 0.3,
  margin: 1,
  salt: 29,
  minScale: 0.5,
  maxScale: 0.9,
})

export const forestGroups = [
  { model: FOREST('tree'), instances: trees, castShadow: true },
  { model: FOREST('tree-high'), instances: tallTrees, castShadow: true },
  { model: FOREST('plant'), instances: plants, castShadow: false },
  { model: FOREST('stones'), instances: stones, castShadow: true },
]

// --- parked vehicles --------------------------------------------------------

const V = (x: number, z: number, rotationY: number, scale = 0.55): InstanceTransform => ({
  position: [x, VEHICLE_Y, z],
  rotationY,
  scale,
})

const DEG = (d: number) => (d * Math.PI) / 180

export const parkedVehicleGroups = [
  {
    model: CAR('truck'),
    instances: [V(8.5, -18.5, DEG(90)), V(-13.5, -18, DEG(0)), V(20.5, -2.5, DEG(90))],
  },
  {
    model: CAR('delivery'),
    instances: [V(8.5, 18.5, DEG(-90)), V(-13.5, 18.5, DEG(180))],
  },
  {
    model: CAR('van'),
    instances: [V(12.5, 8.5, DEG(0)), V(-20.5, 2.5, DEG(90)), V(5.5, 12.5, DEG(180))],
  },
  {
    model: CAR('sedan'),
    instances: [V(-6.5, -11.5, DEG(0)), V(12.5, -11.5, DEG(180)), V(-20.5, -11, DEG(0))],
  },
  {
    model: CAR('suv'),
    instances: [V(6.5, 7.5, DEG(90)), V(-20.5, 25, DEG(0))],
  },
  {
    model: CAR('tractor'),
    instances: [V(26.5, 18.5, DEG(45), 0.6)],
  },
  {
    model: CAR('cone'),
    instances: [
      { position: [-5.2, 0, -12.5], scale: 0.5 },
      { position: [-5.2, 0, -11.6], scale: 0.5 },
      { position: [-2.8, 0, 11.6], scale: 0.5 },
      { position: [-2.8, 0, 12.5], scale: 0.5 },
    ] as InstanceTransform[],
  },
]

// --- moving vehicles --------------------------------------------------------

export interface VehiclePath {
  model: string
  /** Straight run the vehicle loops along, in world XZ. */
  path: [[number, number], [number, number]]
  /** World units per simulated second. */
  speed: number
  /** 0-1 starting offset so traffic is spread out. */
  phase: number
  scale?: number
}

export const movingVehicles: VehiclePath[] = [
  { model: CAR('sedan'), path: [[-36, -14.6], [36, -14.6]], speed: 2.6, phase: 0 },
  { model: CAR('truck'), path: [[36, -13.4], [-36, -13.4]], speed: 1.9, phase: 0.35 },
  { model: CAR('taxi'), path: [[36, 14.6], [-36, 14.6]], speed: 2.8, phase: 0.6 },
  { model: CAR('van'), path: [[-36, 13.4], [36, 13.4]], speed: 2.2, phase: 0.15 },
  { model: CAR('suv'), path: [[-10.6, -32], [-10.6, 32]], speed: 2.4, phase: 0.5 },
  { model: CAR('delivery'), path: [[10.6, 32], [10.6, -32]], speed: 2.0, phase: 0.8 },
  { model: CAR('garbage-truck'), path: [[24.6, 32], [24.6, -32]], speed: 1.7, phase: 0.25 },
  { model: CAR('firetruck'), path: [[-24.6, -32], [-24.6, 32]], speed: 2.1, phase: 0.7 },
]

// --- workers ----------------------------------------------------------------

const PEOPLE_MODELS = [
  'character-male-a',
  'character-male-b',
  'character-male-c',
  'character-male-d',
  'character-female-a',
  'character-female-b',
  'character-female-c',
  'character-female-d',
]

/** Small knots of workers at the plant gates, the hub and along the verges. */
const WORKER_SPOTS: [number, number][] = [
  [8.6, -18.4],
  [9.4, -17.6],
  [-12.6, -18.2],
  [8.8, 18.2],
  [9.6, 19],
  [-12.8, 18.6],
  [5.6, 11.6],
  [6.4, 12.2],
  [-6.4, -8.6],
  [-6.4, 12.6],
  [20.4, -3.4],
  [20.8, 6.6],
  [-20.6, 3.4],
  [-2.6, -12.4],
  [-5.4, 12.4],
  [12.6, -11.4],
]

export const characterGroups = PEOPLE_MODELS.map((model, index) => ({
  model: PERSON(model),
  instances: WORKER_SPOTS.filter((_, i) => i % PEOPLE_MODELS.length === index).map(([x, z]) => ({
    position: [x, 0, z] as [number, number, number],
    rotationY: hash(x, z, 40) * Math.PI * 2,
    scale: 0.95,
  })),
})).filter((group) => group.instances.length > 0)

// --- rail siding ------------------------------------------------------------

export const railTrack: InstanceTransform[] = (() => {
  const pieces: InstanceTransform[] = []
  // each track piece runs from its pivot along local +Z, so they chain with no rotation
  for (let z = RAIL_START_Z; z < RAIL_END_Z; z += RAIL_SEGMENT) {
    pieces.push({ position: [RAIL_X, RAIL_LIFT, z] })
  }
  return pieces
})()

export interface TrainCar {
  model: string
  /** Distance behind the locomotive, in world units. */
  offset: number
}

export const trainConsist: TrainCar[] = [
  { model: TRAIN('train-locomotive-a'), offset: 0 },
  { model: TRAIN('train-carriage-tank'), offset: 3 },
  { model: TRAIN('train-carriage-container-red'), offset: 6 },
  { model: TRAIN('train-carriage-container-blue'), offset: 9 },
  { model: TRAIN('train-carriage-coal'), offset: 12 },
]

export const TRAIN_SPEED = 3.2

export const railModels = {
  straight: TRAIN('railroad-straight'),
}
