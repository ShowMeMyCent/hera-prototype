import { useEffect, useState } from 'react'
import { cn } from '../../lib/utils'

interface CircularProgressProps {
  value: number
  size?: number
  strokeWidth?: number
  colorClass: string
  trackClass?: string
  label?: string
}

export function CircularProgress({
  value,
  size = 56,
  strokeWidth = 5,
  colorClass,
  trackClass = 'text-black/8',
  label,
}: CircularProgressProps) {
  const [animated, setAnimated] = useState(0)

  useEffect(() => {
    const frame = requestAnimationFrame(() => setAnimated(value))
    return () => cancelAnimationFrame(frame)
  }, [value])

  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (animated / 100) * circumference

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          className={trackClass}
          stroke="currentColor"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          className={cn(colorClass, 'transition-[stroke-dashoffset] duration-700 ease-out')}
          stroke="currentColor"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-base font-bold text-text">
        {label ?? Math.round(value)}
      </div>
    </div>
  )
}
