import { Pause, Play, RotateCcw } from 'lucide-react'
import { formatClock } from '../../hooks/useDigitalTwinSimulation'
import { Button } from '../ui/Button'
import { Progress } from '../ui/Progress'
import { cn } from '../../lib/utils'

const SPEED_OPTIONS = [0.5, 1, 2, 5]

interface SimulationControlsProps {
  running: boolean
  elapsedSec: number
  runtimeSec: number
  speed: number
  onStart: () => void
  onPause: () => void
  onReset: () => void
  onSeek: (sec: number) => void
  onSpeedChange: (speed: number) => void
  className?: string
}

export function SimulationControls({
  running,
  elapsedSec,
  runtimeSec,
  speed,
  onStart,
  onPause,
  onReset,
  onSeek,
  onSpeedChange,
  className,
}: SimulationControlsProps) {
  return (
    <div
      className={cn(
        'pointer-events-auto w-[calc(100%-1.5rem)] rounded-[14px] border border-border bg-white/95 p-3.5 shadow-card-hover backdrop-blur-sm sm:w-72',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-bold tracking-wide text-text-secondary uppercase">Simulation</p>
        <span className="text-[11px] font-semibold text-text-secondary tabular-nums">
          {formatClock(elapsedSec)} / {formatClock(runtimeSec)}
        </span>
      </div>

      <div className="mt-2.5 flex items-center gap-2">
        {running ? (
          <Button size="sm" variant="outline" onClick={onPause} className="flex-1">
            <Pause className="h-3.5 w-3.5" />
            Pause
          </Button>
        ) : (
          <Button size="sm" variant="primary" onClick={onStart} className="flex-1">
            <Play className="h-3.5 w-3.5" />
            Start
          </Button>
        )}
        <Button size="sm" variant="ghost" onClick={onReset} className="flex-1">
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </Button>
      </div>

      <Progress
        value={elapsedSec}
        max={runtimeSec}
        className="mt-3"
        onScrub={(ratio) => onSeek(ratio * runtimeSec)}
      />

      <div className="mt-3 flex items-center gap-1.5">
        <span className="mr-1 text-[10px] font-semibold tracking-wide text-text-secondary uppercase">Speed</span>
        {SPEED_OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onSpeedChange(option)}
            className={cn(
              'flex-1 rounded-md border px-1.5 py-1 text-[11px] font-semibold transition-colors',
              speed === option
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border text-text-secondary hover:border-text-secondary',
            )}
          >
            {option}x
          </button>
        ))}
      </div>
    </div>
  )
}
