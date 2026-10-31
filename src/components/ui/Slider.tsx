import { cn } from '../../lib/utils'

interface SliderProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  colorClass: string
  trackColorClass: string
  ariaLabel: string
}

export function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  colorClass,
  trackColorClass,
  ariaLabel,
}: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100

  return (
    <div className="relative flex h-4 items-center">
      <div className={cn('h-1.5 w-full overflow-hidden rounded-full', trackColorClass)}>
        <div className={cn('h-full rounded-full', colorClass)} style={{ width: `${pct}%` }} />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={ariaLabel}
        className="absolute inset-0 h-4 w-full cursor-pointer appearance-none bg-transparent
          [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-current
          [&::-webkit-slider-thumb]:bg-surface [&::-webkit-slider-thumb]:shadow-card
          [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:appearance-none
          [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-current
          [&::-moz-range-thumb]:bg-surface [&::-moz-range-thumb]:shadow-card"
        style={{ color: 'inherit' }}
      />
    </div>
  )
}
