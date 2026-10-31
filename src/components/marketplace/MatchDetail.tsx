import { ArrowLeftRight, Download, FileText, X } from 'lucide-react'
import type { Match } from '../../types'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { useToast } from '../ui/Toast'
import { CostComparison } from './CostComparison'
import { CriteriaMatrix } from './CriteriaMatrix'

interface MatchDetailProps {
  match: Match
  onClose: () => void
}

export function MatchDetail({ match, onClose }: MatchDetailProps) {
  const { showToast } = useToast()
  const bestLabel = match.score >= 90 ? 'Match Terbaik' : match.score >= 75 ? 'Match Kuat' : 'Match Potensial'

  return (
    <Card className="flex flex-col gap-6 p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Badge tone="green">{match.score} Points</Badge>
            <span className="text-xs font-bold tracking-wide text-turquoise-dark uppercase">{bestLabel}</span>
          </div>
          <p className="mt-2 flex items-center gap-2 text-base font-bold text-text">
            {match.supplier}
            <ArrowLeftRight className="h-4 w-4 text-text-secondary" />
            {match.receiver}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-text-secondary hover:bg-black/5 hover:text-text"
          aria-label="Tutup detail"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <CriteriaMatrix criteria={match.criteria} />
      <CostComparison marketplacePrice={match.priceIdrPerMWh} boilerPrice={match.boilerCostIdrPerMWh} />

      <div>
        <p className="mb-2 text-xs font-semibold tracking-wide text-text-secondary uppercase">Rangkuman Rekomendasi</p>
        <p className="text-sm leading-relaxed text-text-secondary">
          Kedua pabrik hanya berjarak {match.distanceKm} km dengan suplai panas {match.gradeLabel.split(':')[0]} stabil.
          Sangat direkomendasikan untuk segera mengajukan Letter of Intent (LoI) guna mengunci kuota kapasitas surplus.
        </p>
      </div>

      <div className="flex flex-col gap-2.5">
        <Button
          variant="secondary"
          onClick={() => showToast('Surat pengajuan resmi berhasil dikirim ke PT ' + match.receiver.replace('PT ', ''))}
        >
          <FileText className="h-4 w-4" />
          Kirim Surat Pengajuan Resmi
        </Button>
        <Button variant="outline" onClick={() => showToast('Proposal teknis (.PDF) sedang diunduh.', 'info')}>
          <Download className="h-4 w-4" />
          Unduh Proposal Teknis (.PDF)
        </Button>
      </div>
    </Card>
  )
}
