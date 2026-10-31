import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

type BadgeTone = 'blue' | 'turquoise' | 'green' | 'orange' | 'red' | 'neutral'

const toneClasses: Record<BadgeTone, string> = {
  blue: 'bg-primary/10 text-primary border-primary/20',
  turquoise: 'bg-turquoise/10 text-turquoise-dark border-turquoise/20',
  green: 'bg-green/10 text-green-dark border-green/20',
  orange: 'bg-orange/10 text-orange border-orange/20',
  red: 'bg-red/10 text-red border-red/20',
  neutral: 'bg-black/4 text-text-secondary border-border',
}

interface BadgeProps {
  tone?: BadgeTone
  children: ReactNode
  dot?: boolean
  className?: string
}

export function Badge({ tone = 'neutral', children, dot = false, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold',
        toneClasses[tone],
        className,
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  )
}
