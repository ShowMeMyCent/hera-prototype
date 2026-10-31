/**
 * Data-driven description of the HYTERA thermal network.
 *
 * The estate carries one shared thermal backbone running down the central utility
 * corridor. Every heat source feeds into it and every receiver draws from it, so adding
 * a plant, a pump or a branch is a matter of adding entries here — the 3D components
 * render whatever this file describes.
 */

import type { FacilityPart } from './industrialComplex'

export type NetworkNodeKind = 'source' | 'receiver' | 'pump' | 'hub' | 'exchanger'
export type ConnectionKind = 'hot' | 'cold'

/** Thermal characteristics used by the deterministic simulation. */
export interface NodeThermalProfile {
  baseTemperatureC: number
  heatAvailableMW: number
  baseFlowRateKgS: number
  qualityFactor: number
}

export interface NetworkNode {
  id: string
  kind: NetworkNodeKind
  name: string
  subtitle: string
  position: [number, number, number]
  rotationY?: number
  scale?: number
  /** Footprint of the site apron, omitted for nodes that do not get one. */
  pad?: { width: number; depth: number }
  /** GLB composition rendered at this node. */
  parts: FacilityPart[]
  profile?: NodeThermalProfile
}

export interface NetworkConnection {
  id: string
  kind: ConnectionKind
  from: string
  to: string
  points: [number, number, number][]
}

export interface NetworkRoute {
  id: string
  label: string
  sourceId: string
  receiverId: string
  connectionIds: string[]
  /** The pair the rest of the dashboard (KPI, Sankey, economics) is built around. */
  primary?: boolean
}

const BLD = (name: string) => `/models/${name}.glb`

/** Height of the corridor pipework above the ground plane. */
export const PIPE_Y = 0.85
/** X of the shared backbone running down the central utility corridor. */
export const BACKBONE_X = -4

export const EXCHANGER_ANCHOR: [number, number, number] = [BACKBONE_X, 0, 0]

// --- Nodes -----------------------------------------------------------------

export const networkNodes: NetworkNode[] = [
  // ---- heat sources ----
  {
    id: 'src-smelter-nikel',
    kind: 'source',
    name: 'PT Smelter Nikel Sulawesi',
    subtitle: 'Surplus Waste Heat',
    position: [4, 0, -22],
    rotationY: Math.PI / 2,
    scale: 2,
    pad: { width: 11, depth: 9 },
    profile: { baseTemperatureC: 350, heatAvailableMW: 1.6, baseFlowRateKgS: 12.5, qualityFactor: 0.82 },
    parts: [
      { model: BLD('building-l'), position: [0, 0, 0] },
      { model: BLD('chimney-large'), position: [-1.4, 0, -1.5] },
      { model: BLD('chimney-medium'), position: [-0.2, 0, -1.6] },
      { model: BLD('building-e'), position: [-2.7, 0, 1.4], rotationY: Math.PI / 2 },
      { model: BLD('detail-tank-large'), position: [1.9, 0, 1.1], rotationY: -0.4 },
      { model: BLD('shipping-container-a'), position: [1.7, 0, -1.7], rotationY: Math.PI / 2, scale: 0.8 },
    ],
  },
  {
    id: 'src-baja-morowali',
    kind: 'source',
    name: 'PT Baja Morowali',
    subtitle: 'Flue Gas Recovery',
    position: [-17, 0, -22],
    rotationY: -0.1,
    scale: 1.7,
    pad: { width: 9, depth: 7.5 },
    profile: { baseTemperatureC: 320, heatAvailableMW: 1.25, baseFlowRateKgS: 10.4, qualityFactor: 0.78 },
    parts: [
      { model: BLD('building-f'), position: [0, 0, 0] },
      { model: BLD('chimney-medium'), position: [-1.7, 0, -0.9] },
      { model: BLD('detail-tank-large'), position: [1.9, 0, 0.9], rotationY: 0.4, scale: 0.9 },
    ],
  },
  {
    id: 'src-petrokimia',
    kind: 'source',
    name: 'PT Petrokimia Timur',
    subtitle: 'Reactor Vent Heat',
    position: [17, 0, -5],
    rotationY: -Math.PI / 2,
    scale: 1.7,
    pad: { width: 9, depth: 7.5 },
    profile: { baseTemperatureC: 295, heatAvailableMW: 0.95, baseFlowRateKgS: 8.6, qualityFactor: 0.74 },
    parts: [
      { model: BLD('building-r'), position: [0, 0, 0] },
      { model: BLD('chimney-small'), position: [-1.9, 0, -0.9] },
      { model: BLD('detail-tank'), position: [1.6, 0, 1.2], rotationY: Math.PI / 2 },
    ],
  },

  // ---- heat receivers ----
  {
    id: 'rcv-semen-indonesia',
    kind: 'receiver',
    name: 'PT Semen Indonesia',
    subtitle: 'Heat for Process Use',
    position: [4, 0, 22],
    rotationY: -Math.PI / 2,
    scale: 2,
    pad: { width: 11, depth: 9 },
    profile: { baseTemperatureC: 230, heatAvailableMW: 0, baseFlowRateKgS: 12.5, qualityFactor: 0.748 },
    parts: [
      { model: BLD('building-r'), position: [0, 0, 0] },
      { model: BLD('chimney-small'), position: [-1.9, 0, -1.1] },
      { model: BLD('building-c'), position: [0.2, 0, 2.6], rotationY: Math.PI },
      { model: BLD('water-tower'), position: [-2.3, 0, 0.6] },
      { model: BLD('detail-tank-large'), position: [2.3, 0, 1.3], rotationY: 0.5 },
    ],
  },
  {
    id: 'rcv-kertas-nusantara',
    kind: 'receiver',
    name: 'PT Kertas Nusantara',
    subtitle: 'Pengeringan Pulp',
    position: [-17, 0, 22],
    rotationY: 0.1,
    scale: 1.7,
    pad: { width: 9, depth: 7.5 },
    profile: { baseTemperatureC: 205, heatAvailableMW: 0, baseFlowRateKgS: 10.4, qualityFactor: 0.7 },
    parts: [
      { model: BLD('building-g'), position: [0, 0, 0] },
      { model: BLD('chimney-basic'), position: [-1.6, 0, -0.9] },
      { model: BLD('detail-tank'), position: [1.8, 0, 1.1], rotationY: Math.PI / 2 },
    ],
  },
  {
    id: 'rcv-tekstil-jaya',
    kind: 'receiver',
    name: 'PT Tekstil Jaya',
    subtitle: 'Pemanas Pewarnaan',
    position: [17, 0, 5],
    rotationY: -Math.PI / 2,
    scale: 1.7,
    pad: { width: 9, depth: 7.5 },
    profile: { baseTemperatureC: 185, heatAvailableMW: 0, baseFlowRateKgS: 8.6, qualityFactor: 0.66 },
    parts: [
      { model: BLD('building-m'), position: [0, 0, 0] },
      { model: BLD('building-k'), position: [1.9, 0, 1.4], rotationY: 0.5 },
      { model: BLD('solar-panel-landscape-group'), position: [-1.9, 0, 1.3], scale: 1.1 },
    ],
  },

  // ---- pump / control stations along the backbone ----
  {
    id: 'pump-north',
    kind: 'pump',
    name: 'Pump Station P-01',
    subtitle: 'Backbone Utara',
    position: [-7.2, 0, -18],
    rotationY: Math.PI / 2,
    scale: 1.2,
    pad: { width: 3.6, depth: 3.2 },
    parts: [{ model: BLD('building-k'), position: [0, 0, 0] }],
  },
  {
    id: 'pump-mid',
    kind: 'pump',
    name: 'Pump Station P-02',
    subtitle: 'Booster Jalur Panas',
    position: [-7.2, 0, -8],
    rotationY: Math.PI / 2,
    scale: 1.2,
    pad: { width: 3.6, depth: 3.2 },
    parts: [{ model: BLD('building-p'), position: [0, 0, 0] }],
  },
  {
    id: 'pump-south',
    kind: 'pump',
    name: 'Pump Station P-03',
    subtitle: 'Distribusi Selatan',
    position: [-7.2, 0, 12],
    rotationY: Math.PI / 2,
    scale: 1.2,
    pad: { width: 3.6, depth: 3.2 },
    parts: [{ model: BLD('building-k'), position: [0, 0, 0] }],
  },

  // ---- control hub ----
  {
    id: 'hytera-hub',
    kind: 'hub',
    name: 'HYTERA Control Hub',
    subtitle: 'Digital Twin Control Center',
    position: [8, 0, 10],
    scale: 1.6,
    pad: { width: 6, depth: 5 },
    parts: [
      { model: BLD('building-m'), position: [0, 0, 0] },
      { model: BLD('solar-panel-landscape-group'), position: [1.5, 0, 1.1], rotationY: 0.25, scale: 0.9 },
    ],
  },
]

export const nodeById = new Map(networkNodes.map((node) => [node.id, node]))

// --- Connections -----------------------------------------------------------

const P = (x: number, z: number): [number, number, number] => [x, PIPE_Y, z]

export const networkConnections: NetworkConnection[] = [
  // source branches feeding the backbone
  {
    id: 'conn-s1',
    kind: 'hot',
    from: 'src-smelter-nikel',
    to: 'junction-north',
    points: [P(0.6, -22), P(BACKBONE_X, -22)],
  },
  {
    id: 'conn-s2',
    kind: 'hot',
    from: 'src-baja-morowali',
    to: 'junction-north',
    points: [P(-13.4, -22), P(BACKBONE_X, -22)],
  },
  {
    id: 'conn-s3',
    kind: 'hot',
    from: 'src-petrokimia',
    to: 'junction-hot-mid',
    points: [P(13.4, -5), P(BACKBONE_X, -5)],
  },

  // shared backbone — hot side
  {
    id: 'conn-backbone-hot-north',
    kind: 'hot',
    from: 'junction-north',
    to: 'junction-hot-mid',
    points: [P(BACKBONE_X, -22), P(BACKBONE_X, -5)],
  },
  {
    id: 'conn-backbone-hot-south',
    kind: 'hot',
    from: 'junction-hot-mid',
    to: 'exchanger',
    points: [P(BACKBONE_X, -5), P(BACKBONE_X, -2.2)],
  },

  // shared backbone — recovered side
  {
    id: 'conn-backbone-cold-north',
    kind: 'cold',
    from: 'exchanger',
    to: 'junction-cold-mid',
    points: [P(BACKBONE_X, 2.2), P(BACKBONE_X, 5)],
  },
  {
    id: 'conn-backbone-cold-south',
    kind: 'cold',
    from: 'junction-cold-mid',
    to: 'junction-south',
    points: [P(BACKBONE_X, 5), P(BACKBONE_X, 22)],
  },

  // receiver branches drawing from the backbone
  {
    id: 'conn-r1',
    kind: 'cold',
    from: 'junction-south',
    to: 'rcv-semen-indonesia',
    points: [P(BACKBONE_X, 22), P(0.6, 22)],
  },
  {
    id: 'conn-r2',
    kind: 'cold',
    from: 'junction-south',
    to: 'rcv-kertas-nusantara',
    points: [P(BACKBONE_X, 22), P(-13.4, 22)],
  },
  {
    id: 'conn-r3',
    kind: 'cold',
    from: 'junction-cold-mid',
    to: 'rcv-tekstil-jaya',
    points: [P(BACKBONE_X, 5), P(13.4, 5)],
  },
]

export const connectionById = new Map(networkConnections.map((c) => [c.id, c]))

// --- Routes ----------------------------------------------------------------

const BACKBONE_FULL = [
  'conn-backbone-hot-north',
  'conn-backbone-hot-south',
  'conn-backbone-cold-north',
  'conn-backbone-cold-south',
]

export const networkRoutes: NetworkRoute[] = [
  {
    id: 'route-primary',
    label: 'Smelter Nikel → Semen Indonesia',
    sourceId: 'src-smelter-nikel',
    receiverId: 'rcv-semen-indonesia',
    connectionIds: ['conn-s1', ...BACKBONE_FULL, 'conn-r1'],
    primary: true,
  },
  {
    id: 'route-baja-kertas',
    label: 'Baja Morowali → Kertas Nusantara',
    sourceId: 'src-baja-morowali',
    receiverId: 'rcv-kertas-nusantara',
    connectionIds: ['conn-s2', ...BACKBONE_FULL, 'conn-r2'],
  },
  {
    id: 'route-petro-tekstil',
    label: 'Petrokimia Timur → Tekstil Jaya',
    sourceId: 'src-petrokimia',
    receiverId: 'rcv-tekstil-jaya',
    connectionIds: ['conn-s3', 'conn-backbone-hot-south', 'conn-backbone-cold-north', 'conn-r3'],
  },
]

export const PRIMARY_ROUTE_ID = 'route-primary'

/** Routes that touch a given node, used for highlighting on hover/click. */
export function routesForNode(nodeId: string): NetworkRoute[] {
  return networkRoutes.filter((route) => route.sourceId === nodeId || route.receiverId === nodeId)
}

/** Pipe support posts, sampled along every connection so the pipework reads as built. */
export const pipeSupports: [number, number][] = (() => {
  const supports: [number, number][] = []
  const STEP = 4

  for (const connection of networkConnections) {
    for (let i = 0; i < connection.points.length - 1; i++) {
      const [x1, , z1] = connection.points[i]
      const [x2, , z2] = connection.points[i + 1]
      const length = Math.hypot(x2 - x1, z2 - z1)
      const count = Math.floor(length / STEP)
      for (let s = 1; s <= count; s++) {
        const t = (s * STEP) / length
        supports.push([x1 + (x2 - x1) * t, z1 + (z2 - z1) * t])
      }
    }
  }

  return supports
})()
