import { X } from 'lucide-react'
import type { CSSProperties } from 'react'
import type { ObjectInspection } from '../../types/digitalTwin'
import { Badge } from '../ui/Badge'
import { cn } from '../../lib/utils'

interface ObjectInspectorProps {
  inspection: ObjectInspection
  variant: 'hover' | 'detail'
  style?: CSSProperties
  className?: string
  onClose?: () => void
}

const statusTone: Record<string, 'green' | 'orange' | 'red' | 'blue' | 'turquoise'> = {
  Stable: 'green',
  Online: 'green',
  Operating: 'turquoise',
  Flowing: 'blue',
  Underperforming: 'orange',
}

/** Hover tooltip and pinned detail card for anything clickable in the complex. */
export function ObjectInspector({ inspection, variant, style, className, onClose }: ObjectInspectorProps) {
  const isDetail = variant === 'detail'
  const tone = statusTone[inspection.status] ?? 'blue'

  return (
    <div
      style={style}
      className={cn(
        'z-30 rounded-xl border border-border bg-white/97 shadow-card-hover backdrop-blur-sm',
        isDetail ? 'pointer-events-auto w-64 p-4' : 'pointer-events-none w-52 p-3',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[10px] font-bold tracking-wide text-primary uppercase">{inspection.title}</p>
          <p className="truncate text-xs text-text-secondary">{inspection.subtitle}</p>
        </div>
        {isDetail && onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-text-secondary hover:bg-black/5 hover:text-text"
            aria-label="Tutup detail"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : (
          <Badge tone={tone}>{inspection.status}</Badge>
        )}
      </div>

      <div className="mt-2.5 flex flex-col gap-1.5 border-t border-border pt-2.5">
        {inspection.stats.map((stat) => (
          <div key={stat.label} className="flex items-center justify-between gap-3 text-[11px]">
            <span className="text-text-secondary">{stat.label}</span>
            <span className="font-semibold text-text">{stat.value}</span>
          </div>
        ))}
      </div>

      {isDetail && (
        <div className="mt-2.5 flex items-center justify-between border-t border-border pt-2.5 text-[11px]">
          <span className="text-text-secondary">Status</span>
          <Badge tone={tone}>{inspection.status}</Badge>
        </div>
      )}
    </div>
  )
}
