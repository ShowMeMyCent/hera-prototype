/**
 * Layout for the HYTERA industrial complex.
 *
 * One continuous estate on a single ground plane: a rectangular road grid divides the
 * site into blocks. The central corridor carries the shared thermal backbone (see
 * data/heatNetwork.ts) while every surrounding block is filled with supporting tenants,
 * so the estate reads as a real industrial district rather than a handful of factories.
 */

export interface InstanceTransform {
  position: [number, number, number]
  rotationY?: number
  scale?: number
}

export interface AssetGroup {
  model: string
  instances: InstanceTransform[]
}

export interface FacilityPart {
  model: string
  position: [number, number, number]
  rotationY?: number
  scale?: number
}

export interface SecondaryFacility {
  id: string
  name: string
  kind: string
  position: [number, number, number]
  rotationY: number
  scale: number
  parts: FacilityPart[]
}

const ROAD = (name: string) => `/models/roads/${name}.glb`
const BLD = (name: string) => `/models/${name}.glb`
const DEG = (d: number) => (d * Math.PI) / 180

/** Road tiles are natively 1x1 unit; scaling and spacing both by ROAD_UNIT keeps them edge-to-edge. */
export const ROAD_UNIT = 2

// --- Estate grid -----------------------------------------------------------
export const ESTATE = {
  minX: -34,
  maxX: 34,
  minZ: -30,
  maxZ: 30,
  /** Roads running north-south. */
  verticalRoadsX: [-24, -10, 10, 24],
  /** Roads running east-west. */
  horizontalRoadsZ: [-28, -14, 14, 28],
}

// The thermal network itself — nodes, backbone, branches and routes — lives in
// data/heatNetwork.ts. This file only describes the estate it is built on.

// --- Road network ----------------------------------------------------------
function snap(value: number): number {
  return Math.round(value / ROAD_UNIT) * ROAD_UNIT
}

function buildRoadGroups(): AssetGroup[] {
  const straight: InstanceTransform[] = []
  const crossroad: InstanceTransform[] = []
  const crossings = new Set<string>()

  for (const x of ESTATE.verticalRoadsX) {
    for (const z of ESTATE.horizontalRoadsZ) {
      crossings.add(`${x}|${z}`)
      crossroad.push({ position: [x, 0, z], scale: ROAD_UNIT })
    }
  }

  for (const x of ESTATE.verticalRoadsX) {
    for (let z = snap(ESTATE.minZ); z <= ESTATE.maxZ; z += ROAD_UNIT) {
      if (crossings.has(`${x}|${z}`)) continue
      straight.push({ position: [x, 0, z], rotationY: DEG(90), scale: ROAD_UNIT })
    }
  }

  for (const z of ESTATE.horizontalRoadsZ) {
    for (let x = snap(ESTATE.minX); x <= ESTATE.maxX; x += ROAD_UNIT) {
      if (crossings.has(`${x}|${z}`)) continue
      straight.push({ position: [x, 0, z], scale: ROAD_UNIT })
    }
  }

  return [
    { model: ROAD('road-straight'), instances: straight },
    { model: ROAD('road-crossroad'), instances: crossroad },
  ]
}

export const roadGroups: AssetGroup[] = buildRoadGroups()

// --- Street furniture ------------------------------------------------------
function buildStreetPropGroups(): AssetGroup[] {
  const poles: InstanceTransform[] = []
  const lights: InstanceTransform[] = []
  const trafficLights: InstanceTransform[] = []
  const signs: InstanceTransform[] = []

  // power poles down the two central avenues, alternating sides
  for (const x of [-10, 10]) {
    for (let z = -26; z <= 26; z += 8) {
      const side = z % 16 === 0 ? 1 : -1
      poles.push({ position: [x + side * 1.5, 0, z], rotationY: side > 0 ? 0 : DEG(180) })
    }
  }
  // and along the main east-west avenue
  for (let x = -30; x <= 30; x += 10) {
    poles.push({ position: [x, 0, -14 + 1.5], rotationY: 0 })
  }

  // a street light on every intersection corner
  for (const x of ESTATE.verticalRoadsX) {
    for (const z of ESTATE.horizontalRoadsZ) {
      lights.push({ position: [x - 1.6, 0, z - 1.6], rotationY: DEG(45) })
    }
  }

  // traffic lights only at the four intersections framing the heat-exchange block
  for (const x of [-10, 10]) {
    for (const z of [-14, 14]) {
      trafficLights.push({ position: [x + 1.4, 0, z + 1.4], rotationY: DEG(225) })
    }
  }

  signs.push({ position: [-8.4, 0, -12.4], rotationY: DEG(200) })
  signs.push({ position: [8.4, 0, 12.4], rotationY: DEG(20) })

  return [
    { model: ROAD('electricity-pole'), instances: poles },
    { model: ROAD('light-square'), instances: lights },
    { model: ROAD('traffic-light'), instances: trafficLights },
    { model: ROAD('road-sign-street'), instances: signs },
  ]
}

export const streetPropGroups: AssetGroup[] = buildStreetPropGroups()

// --- Secondary facilities --------------------------------------------------
// One or two buildings per block, aligned to the road grid but with varied rotation,
// scale and supporting detail so the estate does not look procedurally stamped out.
export const secondaryFacilities: SecondaryFacility[] = [
  {
    id: 'nw-outer',
    name: 'Unit Industri A-01',
    kind: 'Pabrik Pengolahan',
    position: [-29, 0, -22],
    rotationY: DEG(8),
    scale: 1.5,
    parts: [
      { model: BLD('building-a'), position: [0, 0, 0] },
      { model: BLD('chimney-basic'), position: [-1.4, 0, -0.9] },
      { model: BLD('detail-tank'), position: [-0.4, 0, 1.6], rotationY: DEG(90) },
    ],
  },
  {
    id: 'n-centre-west',
    name: 'Unit Industri A-03',
    kind: 'Fasilitas Utilitas',
    position: [-7.5, 0, -25],
    rotationY: DEG(90),
    scale: 1.35,
    parts: [
      { model: BLD('building-p'), position: [0, 0, 0] },
      { model: BLD('water-tower'), position: [1.6, 0, 1.2], scale: 0.9 },
    ],
  },
  {
    id: 'ne-inner',
    name: 'Unit Industri B-01',
    kind: 'Pabrik Kimia',
    position: [17, 0, -21],
    rotationY: DEG(10),
    scale: 1.5,
    parts: [
      { model: BLD('building-f'), position: [0, 0, 0] },
      { model: BLD('chimney-medium'), position: [-1.1, 0, 0.9] },
      { model: BLD('detail-tank-large'), position: [1.9, 0, 0.8], rotationY: DEG(30), scale: 0.9 },
    ],
  },
  {
    id: 'ne-outer',
    name: 'Unit Industri B-02',
    kind: 'Pabrik Manufaktur',
    position: [29, 0, -22],
    rotationY: DEG(-12),
    scale: 1.45,
    parts: [
      { model: BLD('building-t'), position: [0, 0, 0] },
      { model: BLD('building-i'), position: [1.9, 0, 1.5], rotationY: DEG(90) },
    ],
  },
  {
    id: 'w-mid',
    name: 'Unit Industri C-01',
    kind: 'Pabrik Tekstil',
    position: [-17, 0, -4],
    rotationY: DEG(90),
    scale: 1.5,
    parts: [
      { model: BLD('building-c'), position: [0, 0, 0] },
      { model: BLD('building-h'), position: [0.2, 0, 2.4] },
    ],
  },
  {
    id: 'w-mid-south',
    name: 'Unit Industri C-02',
    kind: 'Gudang Distribusi',
    position: [-17, 0, 6],
    rotationY: DEG(90),
    scale: 1.45,
    parts: [
      { model: BLD('building-s'), position: [0, 0, 0] },
      { model: BLD('solar-panel-landscape-group'), position: [0, 0, 1.9], scale: 1.1 },
    ],
  },
  {
    id: 'w-outer-mid',
    name: 'Unit Industri C-03',
    kind: 'Fasilitas Energi',
    position: [-29, 0, 0],
    rotationY: DEG(0),
    scale: 1.4,
    parts: [
      { model: BLD('building-n'), position: [0, 0, 0] },
      { model: BLD('solar-panel-landscape-group'), position: [1.6, 0, 1.6], rotationY: DEG(15), scale: 1.2 },
      { model: BLD('solar-panel-landscape-group'), position: [1.6, 0, 3.0], rotationY: DEG(15), scale: 1.2 },
    ],
  },
  {
    id: 'e-outer-mid',
    name: 'Unit Industri D-03',
    kind: 'Fasilitas Penyimpanan',
    position: [29, 0, 2],
    rotationY: DEG(6),
    scale: 1.4,
    parts: [
      { model: BLD('building-j'), position: [0, 0, 0] },
      { model: BLD('shipping-container-b'), position: [1.7, 0, 1.7], rotationY: DEG(20) },
      { model: BLD('windmill-low'), position: [-2.2, 0, 2.6], scale: 1.1 },
    ],
  },
  {
    id: 'sw-outer',
    name: 'Unit Industri E-02',
    kind: 'Bengkel & Perawatan',
    position: [-29, 0, 22],
    rotationY: DEG(14),
    scale: 1.4,
    parts: [
      { model: BLD('building-d'), position: [0, 0, 0] },
      { model: BLD('building-o'), position: [1.8, 0, 1.2], rotationY: DEG(-90) },
    ],
  },
  {
    id: 'se-inner',
    name: 'Unit Industri F-01',
    kind: 'Pabrik Keramik',
    position: [17, 0, 21],
    rotationY: DEG(8),
    scale: 1.5,
    parts: [
      { model: BLD('building-l'), position: [0, 0, 0] },
      { model: BLD('detail-tank-large'), position: [-2.2, 0, 1.2], rotationY: DEG(-20), scale: 0.85 },
    ],
  },
  {
    id: 'se-outer',
    name: 'Unit Industri F-02',
    kind: 'Gudang Material',
    position: [29, 0, 22],
    rotationY: DEG(-10),
    scale: 1.4,
    parts: [
      { model: BLD('building-h'), position: [0, 0, 0] },
      { model: BLD('shipping-container-c'), position: [1.6, 0, 1.8], rotationY: DEG(75) },
    ],
  },
  // --- second row of tenants, filling out the blocks so the estate reads as dense ---
  {
    id: 'nw-outer-2',
    name: 'Unit Industri A-05',
    kind: 'Area Penyimpanan',
    position: [-29, 0, -16.5],
    rotationY: DEG(-4),
    scale: 1.3,
    parts: [
      { model: BLD('building-s'), position: [0, 0, 0] },
      { model: BLD('shipping-container-b'), position: [0, 0, 2.1], rotationY: DEG(90) },
    ],
  },
  {
    id: 'ne-inner-2',
    name: 'Unit Industri B-03',
    kind: 'Pabrik Elektronik',
    position: [17, 0, -26],
    rotationY: DEG(-5),
    scale: 1.45,
    parts: [
      { model: BLD('building-q'), position: [0, 0, 0] },
      { model: BLD('solar-panel-landscape-group'), position: [0.2, 0, 2.0], scale: 1.1 },
    ],
  },
  {
    id: 'ne-outer-2',
    name: 'Unit Industri B-04',
    kind: 'Fasilitas Air',
    position: [29, 0, -16],
    rotationY: DEG(12),
    scale: 1.3,
    parts: [
      { model: BLD('building-p'), position: [0, 0, 0] },
      { model: BLD('water-tower'), position: [1.9, 0, 1.4], scale: 0.95 },
    ],
  },
  {
    id: 'w-mid-2',
    name: 'Unit Industri C-04',
    kind: 'Pabrik Plastik',
    position: [-17, 0, -11.5],
    rotationY: DEG(-90),
    scale: 1.35,
    parts: [
      { model: BLD('building-i'), position: [0, 0, 0] },
      { model: BLD('detail-tank'), position: [1.4, 0, 1.2], rotationY: DEG(60) },
    ],
  },
  {
    id: 'w-mid-3',
    name: 'Unit Industri C-05',
    kind: 'Pabrik Pupuk',
    position: [-17, 0, 12],
    rotationY: DEG(86),
    scale: 1.4,
    parts: [
      { model: BLD('building-f'), position: [0, 0, 0] },
      { model: BLD('chimney-small'), position: [1.4, 0, -0.9] },
    ],
  },
  {
    id: 'e-mid-2',
    name: 'Unit Industri D-04',
    kind: 'Pabrik Otomotif',
    position: [17, 0, -11.5],
    rotationY: DEG(90),
    scale: 1.4,
    parts: [
      { model: BLD('building-a'), position: [0, 0, 0] },
      { model: BLD('shipping-container-a'), position: [-1.8, 0, 1.6], rotationY: DEG(10) },
    ],
  },
  {
    id: 'e-mid-3',
    name: 'Unit Industri D-05',
    kind: 'Pabrik Farmasi',
    position: [17, 0, 12.5],
    rotationY: DEG(-88),
    scale: 1.4,
    parts: [
      { model: BLD('building-n'), position: [0, 0, 0] },
      { model: BLD('building-k'), position: [1.6, 0, 1.6], rotationY: DEG(40) },
    ],
  },
  {
    id: 'sw-outer-2',
    name: 'Unit Industri E-05',
    kind: 'Fasilitas Pengolahan Air',
    position: [-29, 0, 15],
    rotationY: DEG(-6),
    scale: 1.3,
    parts: [
      { model: BLD('building-o'), position: [0, 0, 0] },
      { model: BLD('detail-tank-large'), position: [1.8, 0, 1.6], scale: 0.8 },
    ],
  },
  {
    id: 'se-inner-2',
    name: 'Unit Industri F-03',
    kind: 'Pabrik Kaca',
    position: [17, 0, 26],
    rotationY: DEG(-6),
    scale: 1.45,
    parts: [
      { model: BLD('building-g'), position: [0, 0, 0] },
      { model: BLD('chimney-basic'), position: [-1.5, 0, -0.8] },
    ],
  },
  {
    id: 'se-outer-2',
    name: 'Unit Industri F-04',
    kind: 'Fasilitas Energi Surya',
    position: [29, 0, 14],
    rotationY: DEG(10),
    scale: 1.3,
    parts: [
      { model: BLD('building-j'), position: [0, 0, 0] },
      { model: BLD('solar-panel-landscape-group'), position: [0.3, 0, 2.2], scale: 1.2 },
      { model: BLD('solar-panel-landscape-group'), position: [2.0, 0, 2.2], scale: 1.2 },
    ],
  },
  {
    id: 's-centre-west',
    name: 'Unit Industri E-06',
    kind: 'Gudang Ekspedisi',
    position: [-7.5, 0, 25],
    rotationY: DEG(90),
    scale: 1.35,
    parts: [
      { model: BLD('building-d'), position: [0, 0, 0] },
      { model: BLD('shipping-container-c'), position: [1.7, 0, 1.4], rotationY: DEG(90) },
    ],
  },
]
