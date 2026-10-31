import { Html } from '@react-three/drei'
import { cn } from '../../lib/utils'

interface FloatingDataLabelProps {
  position: [number, number, number]
  title: string
  value?: string
  subtitle?: string
  tone?: 'default' | 'hot' | 'cold' | 'neutral'
}

const toneClasses: Record<NonNullable<FloatingDataLabelProps['tone']>, string> = {
  default: 'border-border',
  hot: 'border-orange/40',
  cold: 'border-turquoise/40',
  neutral: 'border-border',
}

const valueToneClasses: Record<NonNullable<FloatingDataLabelProps['tone']>, string> = {
  default: 'text-text',
  hot: 'text-orange',
  cold: 'text-turquoise-dark',
  neutral: 'text-text-secondary',
}

export function FloatingDataLabel({ position, title, value, subtitle, tone = 'default' }: FloatingDataLabelProps) {
  return (
    <Html position={position} center zIndexRange={[20, 0]} sprite style={{ pointerEvents: 'none' }}>
      <div
        className={cn(
          'pointer-events-none w-max -translate-y-full rounded-lg border bg-white/95 px-2 py-1 text-center shadow-card backdrop-blur-sm',
          toneClasses[tone],
        )}
      >
        <p className="whitespace-nowrap text-[8px] leading-tight font-bold tracking-wide text-text-secondary uppercase">
          {title}
        </p>
        {value && <p className={cn('text-[11px] leading-tight font-bold', valueToneClasses[tone])}>{value}</p>}
        {subtitle && <p className="text-[8px] leading-tight whitespace-nowrap text-text-secondary">{subtitle}</p>}
      </div>
    </Html>
  )
}
