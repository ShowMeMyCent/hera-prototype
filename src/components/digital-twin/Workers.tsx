import { characterGroups } from '../../data/sceneProps'
import { InstancedAsset } from './InstancedAssets'

/** Site personnel standing around the plant gates, the control hub and the verges. */
export function Workers() {
  return (
    <group>
      {characterGroups.map((group) => (
        <InstancedAsset key={group.model} modelPath={group.model} instances={group.instances} />
      ))}
    </group>
  )
}
