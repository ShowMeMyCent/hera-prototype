import { Filter, PackageSearch, Search, X } from 'lucide-react'
import { useState } from 'react'
import type { Match } from '../../types'
import { cn } from '../../lib/utils'
import { Button } from '../ui/Button'
import { EmptyState } from '../ui/EmptyState'
import { Skeleton } from '../ui/Skeleton'
import { MatchCard } from './MatchCard'

interface MatchListProps {
  matches: Match[]
  totalCount: number
  loading: boolean
  searchQuery: string
  onSearchChange: (value: string) => void
  categories: string[]
  activeCategories: string[]
  onToggleCategory: (category: string) => void
  onClearCategories: () => void
  selectedMatchId: string | null
  onSelectMatch: (id: string) => void
  onProposeDeal: (match: Match) => void
}

export function MatchList({
  matches,
  totalCount,
  loading,
  searchQuery,
  onSearchChange,
  categories,
  activeCategories,
  onToggleCategory,
  onClearCategories,
  selectedMatchId,
  onSelectMatch,
  onProposeDeal,
}: MatchListProps) {
  const [filterOpen, setFilterOpen] = useState(false)

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-bold text-text">Pasangan Terbaik</h2>
        <p className="mt-0.5 text-sm text-text-secondary">
          Menampilkan {matches.length} dari {totalCount} pabrik penghasil &amp; penyerap energi panas
        </p>
      </div>

      <div className="flex flex-col gap-2.5 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari nama pabrik..."
            className="h-11 w-full rounded-lg border border-border bg-surface pr-3.5 pl-10 text-sm text-text placeholder:text-text-secondary focus:border-turquoise focus:outline-none"
          />
        </div>
        <div className="relative">
          <Button
            variant="outline"
            onClick={() => setFilterOpen((v) => !v)}
            className={cn(activeCategories.length > 0 && 'border-primary text-primary')}
          >
            <Filter className="h-4 w-4" />
            Filter Kategori
            {activeCategories.length > 0 && (
              <span className="ml-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white">
                {activeCategories.length}
              </span>
            )}
          </Button>
          {filterOpen && (
            <div className="absolute right-0 z-20 mt-1.5 w-64 rounded-lg border border-border bg-surface p-3 shadow-card-hover">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-semibold tracking-wide text-text-secondary uppercase">Kategori</p>
                {activeCategories.length > 0 && (
                  <button
                    type="button"
                    onClick={onClearCategories}
                    className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                  >
                    <X className="h-3 w-3" />
                    Reset
                  </button>
                )}
              </div>
              <div className="flex max-h-56 flex-col gap-1 overflow-auto">
                {categories.map((category) => (
                  <label
                    key={category}
                    className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm text-text hover:bg-black/4"
                  >
                    <input
                      type="checkbox"
                      checked={activeCategories.includes(category)}
                      onChange={() => onToggleCategory(category)}
                      className="h-3.5 w-3.5 accent-primary"
                    />
                    {category}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {loading &&
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-[14px] border border-border bg-surface p-6">
              <div className="flex justify-between">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-13 w-13 rounded-full" />
              </div>
              <Skeleton className="mt-4 h-6 w-40" />
              <Skeleton className="mt-4 h-10 w-full" />
            </div>
          ))}

        {!loading && matches.length === 0 && (
          <EmptyState
            icon={PackageSearch}
            title="Tidak ada pasangan ditemukan"
            description="Coba ubah kata kunci pencarian atau reset filter kategori."
          />
        )}

        {!loading &&
          matches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              selected={match.id === selectedMatchId}
              onSelect={() => onSelectMatch(match.id)}
              onProposeDeal={() => onProposeDeal(match)}
            />
          ))}
      </div>
    </div>
  )
}
