import { ContactShadows, Grid } from '@react-three/drei'
import { ESTATE, ROAD_UNIT, streetPropGroups } from '../../data/industrialComplex'
import { forestGroups } from '../../data/sceneProps'
import { InstancedAsset } from './InstancedAssets'

/**
 * Ground, planting, lighting and street furniture for the estate.
 *
 * The site sits on a soft green ground plane dressed with grass patches and trees from
 * the forest kit, so the industrial blocks read as buildings standing in landscaped
 * grounds rather than on a bare slab.
 */
export function Environment() {
  const width = ESTATE.maxX - ESTATE.minX + 28
  const depth = ESTATE.maxZ - ESTATE.minZ + 28

  return (
    <>
      <color attach="background" args={['#eaf0ea']} />
      {/* fades the ground out well before its edge, so the estate never looks like a floating slab */}
      <fog attach="fog" args={['#eaf0ea', 125, 215]} />

      <ambientLight intensity={0.75} />
      <directionalLight
        position={[42, 54, 30]}
        intensity={1.1}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-58}
        shadow-camera-right={58}
        shadow-camera-top={58}
        shadow-camera-bottom={-58}
        shadow-camera-near={1}
        shadow-camera-far={150}
        shadow-bias={-0.0005}
      />
      <directionalLight position={[-30, 22, -24]} intensity={0.28} />
      <hemisphereLight args={['#ffffff', '#c9d6c4', 0.5]} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[460, 460]} />
        <meshStandardMaterial color="#bfd6ab" roughness={1} />
      </mesh>

      <Grid
        position={[0, 0.002, 0]}
        args={[width, depth]}
        cellSize={ROAD_UNIT}
        cellThickness={0.3}
        cellColor="#b4cc9f"
        sectionSize={ROAD_UNIT * 7}
        sectionThickness={0.6}
        sectionColor="#a3bd8d"
        fadeDistance={150}
        fadeStrength={1.2}
        infiniteGrid
      />

      <ContactShadows
        position={[0, 0.012, 0]}
        opacity={0.26}
        scale={Math.max(width, depth) + 20}
        blur={2.2}
        far={9}
        resolution={1024}
        color="#1c2b33"
      />

      {forestGroups.map((group) => (
        <InstancedAsset
          key={group.model}
          modelPath={group.model}
          instances={group.instances}
          castShadow={group.castShadow}
        />
      ))}

      {streetPropGroups.map((group) => (
        <InstancedAsset key={group.model} modelPath={group.model} instances={group.instances} />
      ))}
    </>
  )
}
