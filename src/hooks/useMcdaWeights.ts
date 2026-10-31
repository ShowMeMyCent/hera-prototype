import { useState } from 'react'

export interface McdaWeights {
  economy: number
  technical: number
  environmental: number
}

export const weightPresets: Record<string, McdaWeights> = {
  equal: { economy: 33, technical: 33, environmental: 34 },
  economy: { economy: 60, technical: 25, environmental: 15 },
  technical: { economy: 25, technical: 60, environmental: 15 },
  environmental: { economy: 20, technical: 20, environmental: 60 },
}

const initialWeights: McdaWeights = { economy: 40, technical: 35, environmental: 25 }

type WeightKey = keyof McdaWeights

export function useMcdaWeights() {
  const [weights, setWeights] = useState<McdaWeights>(initialWeights)

  function setWeight(key: WeightKey, nextValue: number) {
    setWeights((prev) => {
      const clamped = Math.max(0, Math.min(100, nextValue))
      const otherKeys = (Object.keys(prev) as WeightKey[]).filter((k) => k !== key)
      const remaining = 100 - clamped
      const currentOthersTotal = otherKeys.reduce((sum, k) => sum + prev[k], 0)

      const next: McdaWeights = { ...prev, [key]: clamped }

      if (currentOthersTotal === 0) {
        const share = remaining / otherKeys.length
        otherKeys.forEach((k) => {
          next[k] = Math.round(share)
        })
      } else {
        let distributed = 0
        otherKeys.forEach((k, i) => {
          if (i === otherKeys.length - 1) {
            next[k] = remaining - distributed
          } else {
            const share = Math.round((prev[k] / currentOthersTotal) * remaining)
            next[k] = share
            distributed += share
          }
        })
      }

      return next
    })
  }

  function applyPreset(preset: McdaWeights) {
    setWeights(preset)
  }

  return { weights, setWeight, applyPreset }
}
