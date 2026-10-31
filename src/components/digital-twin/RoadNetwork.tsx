import { roadGroups } from '../../data/industrialComplex'
import { InstancedAsset } from './InstancedAssets'

/** The estate's road grid: straight runs plus crossroad tiles at every intersection. */
export function RoadNetwork() {
  return (
    <group>
      {roadGroups.map((group) => (
        <InstancedAsset
          key={group.model}
          modelPath={group.model}
          instances={group.instances}
          castShadow={false}
          receiveShadow
        />
      ))}
    </group>
  )
}
