import { CheckCircle2, Info } from 'lucide-react'
import { weightPresets, type McdaWeights } from '../../hooks/useMcdaWeights'
import { cn } from '../../lib/utils'
import { Card } from '../ui/Card'
import { WeightSlider } from './WeightSlider'

interface PriorityPanelProps {
  weights: McdaWeights
  onWeightChange: (key: keyof McdaWeights, value: number) => void
  onApplyPreset: (preset: McdaWeights) => void
}

const presetButtons: { key: keyof typeof weightPresets; label: string }[] = [
  { key: 'equal', label: 'Setara (33%)' },
  { key: 'economy', label: 'Fokus Ekonomi' },
  { key: 'technical', label: 'Fokus Teknis' },
  { key: 'environmental', label: 'Fokus Lingkungan' },
]

export function PriorityPanel({ weights, onWeightChange, onApplyPreset }: PriorityPanelProps) {
  const total = Math.round(weights.economy + weights.technical + weights.environmental)
  const activePreset = (Object.entries(weightPresets) as [string, McdaWeights][]).find(
    ([, preset]) =>
      preset.economy === weights.economy &&
      preset.technical === weights.technical &&
      preset.environmental === weights.environmental,
  )?.[0]

  return (
    <div className="flex flex-col gap-4">
      <Card className="p-5 sm:p-6">
        <h2 className="text-lg font-bold text-text">Bobot Prioritas</h2>
        <p className="mt-0.5 text-sm text-text-secondary">Sesuaikan parameter MCDA Weighted Sum</p>

        <div className="mt-6 flex flex-col gap-6">
          <WeightSlider
            label="Ekonomi"
            value={weights.economy}
            onChange={(v) => onWeightChange('economy', v)}
            dotClass="bg-primary"
            colorClass="bg-primary"
            trackColorClass="bg-primary/15"
            textColorClass="text-primary"
          />
          <WeightSlider
            label="Teknis"
            value={weights.technical}
            onChange={(v) => onWeightChange('technical', v)}
            dotClass="bg-turquoise"
            colorClass="bg-turquoise"
            trackColorClass="bg-turquoise/15"
            textColorClass="text-turquoise"
          />
          <WeightSlider
            label="Lingkungan"
            value={weights.environmental}
            onChange={(v) => onWeightChange('environmental', v)}
            dotClass="bg-green"
            colorClass="bg-green"
            trackColorClass="bg-green/15"
            textColorClass="text-green"
          />
        </div>

        <div className="mt-6 flex items-center justify-between rounded-lg bg-black/3 px-4 py-3">
          <span className="text-sm font-semibold text-text">Total Bobot</span>
          <span className="flex items-center gap-1.5 text-sm font-bold text-green-dark">
            {total}%
            <CheckCircle2 className="h-4 w-4" />
          </span>
        </div>

        <div className="mt-6">
          <p className="mb-2.5 text-xs font-semibold tracking-wide text-text-secondary uppercase">Preset Cepat</p>
          <div className="grid grid-cols-2 gap-2">
            {presetButtons.map((preset) => (
              <button
                key={preset.key}
                type="button"
                onClick={() => onApplyPreset(weightPresets[preset.key])}
                className={cn(
                  'rounded-lg border px-3 py-2 text-xs font-semibold transition-colors',
                  activePreset === preset.key
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-surface text-text-secondary hover:border-text-secondary hover:text-text',
                )}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card className="flex gap-3 border-turquoise/25 bg-turquoise/5 p-5">
        <Info className="h-4.5 w-4.5 shrink-0 text-turquoise-dark" />
        <div>
          <p className="text-sm font-bold text-text">Metodologi MCDA</p>
          <p className="mt-1 text-xs leading-relaxed text-text-secondary">
            Weighted Sum Model menormalisasi data sub-kriteria (0–1), kemudian mengalikannya dengan bobot
            prioritas Anda untuk menghasilkan skor kecocokan final.
          </p>
        </div>
      </Card>
    </div>
  )
}
