import { Building2, Gauge, MapPin, Send, Wallet } from 'lucide-react'
import type { Match } from '../../types'
import { cn, formatCompactIdr } from '../../lib/utils'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { CircularProgress } from '../ui/CircularProgress'

interface MatchCardProps {
  match: Match
  selected: boolean
  onSelect: () => void
  onProposeDeal: () => void
}

const gradeTone = { A: 'blue', B: 'orange', C: 'red' } as const

export function MatchCard({ match, selected, onSelect, onProposeDeal }: MatchCardProps) {
  const scoreColorClass = match.score >= 85 ? 'text-turquoise' : match.score >= 70 ? 'text-primary' : 'text-orange'

  return (
    <Card
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onSelect()
      }}
      className={cn(
        'cursor-pointer p-5 transition-all duration-150 hover:shadow-card-hover sm:p-6',
        selected ? 'border-turquoise ring-1 ring-turquoise' : 'hover:border-text-secondary/40',
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <div className="min-w-[140px]">
            <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-primary uppercase">
              <Building2 className="h-3.5 w-3.5" />
              Supplier (Surplus)
            </p>
            <p className="mt-1 text-sm font-bold text-text">{match.supplier}</p>
          </div>

          <div className="hidden text-text-secondary sm:block">
            <svg width="40" height="12" viewBox="0 0 40 12" fill="none">
              <line x1="0" y1="6" x2="34" y2="6" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
              <circle cx="37" cy="6" r="3" fill="currentColor" />
            </svg>
          </div>

          <div className="min-w-[140px]">
            <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-turquoise-dark uppercase">
              <Building2 className="h-3.5 w-3.5" />
              Receiver (Seeker)
            </p>
            <p className="mt-1 text-sm font-bold text-text">{match.receiver}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-1">
          <p className="text-xs font-semibold tracking-wide text-text-secondary uppercase">Skor Kecocokan</p>
          <CircularProgress value={match.score} colorClass={scoreColorClass} size={52} strokeWidth={4.5} />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Badge tone={gradeTone[match.grade]}>{match.gradeLabel}</Badge>
        <Badge tone="neutral">{match.category}</Badge>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <SubScore label="Ekonomi" value={match.economy} colorClass="bg-primary" />
        <SubScore label="Teknis" value={match.technical} colorClass="bg-turquoise" />
        <SubScore label="Lingkungan" value={match.environmental} colorClass="bg-green" />
      </div>

      <div className="mt-4 flex flex-col gap-4 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          <span className="flex items-center gap-1.5 text-text-secondary">
            <Gauge className="h-4 w-4" />
            Kapasitas: <strong className="font-semibold text-text">{match.capacityMW} MW</strong>
          </span>
          <span className="flex items-center gap-1.5 text-text-secondary">
            <Wallet className="h-4 w-4" />
            Harga: <strong className="font-semibold text-text">{formatCompactIdr(match.priceIdrPerMWh)} IDR/MWh</strong>
          </span>
          <span className="flex items-center gap-1.5 text-text-secondary">
            <MapPin className="h-4 w-4" />
            Jarak: <strong className="font-semibold text-text">{match.distanceKm} km</strong>
          </span>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onProposeDeal()
            }}
          >
            <Send className="h-3.5 w-3.5" />
            Ajukan Kesepakatan
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation()
              onSelect()
            }}
          >
            Lihat Detail
          </Button>
        </div>
      </div>
    </Card>
  )
}

function SubScore({ label, value, colorClass }: { label: string; value: number; colorClass: string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold tracking-wide text-text-secondary uppercase">{label}</span>
        <span className="font-bold text-text">{value.toFixed(2)}</span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-black/6">
        <div className={cn('h-full rounded-full', colorClass)} style={{ width: `${value * 100}%` }} />
      </div>
    </div>
  )
}
