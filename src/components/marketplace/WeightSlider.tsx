import { Slider } from '../ui/Slider'

interface WeightSliderProps {
  label: string
  value: number
  onChange: (value: number) => void
  dotClass: string
  colorClass: string
  trackColorClass: string
  textColorClass: string
}

export function WeightSlider({
  label,
  value,
  onChange,
  dotClass,
  colorClass,
  trackColorClass,
  textColorClass,
}: WeightSliderProps) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-text">
          <span className={`h-2 w-2 rounded-full ${dotClass}`} />
          {label}
        </div>
        <span className="text-base font-bold text-text">{Math.round(value)}%</span>
      </div>
      <div className={textColorClass}>
        <Slider
          value={value}
          onChange={onChange}
          colorClass={colorClass}
          trackColorClass={trackColorClass}
          ariaLabel={`Bobot ${label}`}
        />
      </div>
    </div>
  )
}
