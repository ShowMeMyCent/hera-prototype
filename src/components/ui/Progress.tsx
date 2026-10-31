import { cn } from '../../lib/utils'

interface ProgressProps {
  value: number
  max?: number
  className?: string
  barClassName?: string
  onScrub?: (ratio: number) => void
}

export function Progress({ value, max = 100, className, barClassName, onScrub }: ProgressProps) {
  const ratio = max === 0 ? 0 : Math.min(1, Math.max(0, value / max))

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!onScrub) return
    const rect = e.currentTarget.getBoundingClientRect()
    const nextRatio = (e.clientX - rect.left) / rect.width
    onScrub(Math.min(1, Math.max(0, nextRatio)))
  }

  return (
    <div
      className={cn(
        'relative h-1.5 w-full overflow-hidden rounded-full bg-black/8',
        onScrub && 'cursor-pointer',
        className,
      )}
      onClick={handleClick}
      role={onScrub ? 'slider' : undefined}
      aria-valuenow={onScrub ? Math.round(ratio * 100) : undefined}
      aria-valuemin={onScrub ? 0 : undefined}
      aria-valuemax={onScrub ? 100 : undefined}
    >
      <div
        className={cn('h-full rounded-full bg-primary transition-[width]', barClassName)}
        style={{ width: `${ratio * 100}%` }}
      />
    </div>
  )
}
