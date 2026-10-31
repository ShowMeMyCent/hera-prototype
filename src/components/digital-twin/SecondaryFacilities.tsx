import { Suspense } from 'react'
import { secondaryFacilities } from '../../data/industrialComplex'
import type { SelectionTarget } from '../../types/digitalTwin'
import { HighlightRing } from './HighlightRing'
import { IndustrialModel } from './IndustrialModel'

interface SecondaryFacilitiesProps {
  hovered: SelectionTarget | null
  selected: SelectionTarget | null
  bind: (target: SelectionTarget) => Record<string, unknown>
}

/**
 * Level-3 context: the supporting tenants of the estate. They are clickable (a compact
 * "Industrial Facility" card) but never carry persistent labels, so they stay visually
 * subordinate to the simulated heat-exchange pair.
 */
export function SecondaryFacilities({ hovered, selected, bind }: SecondaryFacilitiesProps) {
  return (
    <Suspense fallback={null}>
      {secondaryFacilities.map((facility) => {
        const active =
          (hovered?.kind === 'secondary' && hovered.id === facility.id) ||
          (selected?.kind === 'secondary' && selected.id === facility.id)

        return (
          <group key={facility.id}>
            <group
              {...bind({ kind: 'secondary', id: facility.id })}
              position={facility.position}
              rotation={[0, facility.rotationY, 0]}
              scale={facility.scale}
            >
              {facility.parts.map((part, i) => (
                <IndustrialModel
                  key={`${part.model}-${i}`}
                  modelPath={part.model}
                  position={part.position}
                  rotation={part.rotationY ? [0, part.rotationY, 0] : undefined}
                  scale={part.scale ?? 1}
                />
              ))}
            </group>
            <HighlightRing
              active={active}
              position={[facility.position[0], 0.03, facility.position[2]]}
              radius={4}
              color="#71838a"
              maxOpacity={0.3}
            />
          </group>
        )
      })}
    </Suspense>
  )
}
