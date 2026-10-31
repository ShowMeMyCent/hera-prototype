import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageContainer } from '../components/layout/PageContainer'
import { MatchDetail } from '../components/marketplace/MatchDetail'
import { MatchList } from '../components/marketplace/MatchList'
import { PriorityPanel } from '../components/marketplace/PriorityPanel'
import { useToast } from '../components/ui/Toast'
import { matches as mockMatches } from '../data/mockMatches'
import { useMcdaWeights } from '../hooks/useMcdaWeights'
import type { Match } from '../types'
import { Inbox } from 'lucide-react'
import { EmptyState } from '../components/ui/EmptyState'

export function MarketplacePage() {
  const { matchId } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { weights, setWeight, applyPreset } = useMcdaWeights()

  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategories, setActiveCategories] = useState<string[]>([])
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(matchId ?? null)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 650)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (matchId) setSelectedMatchId(matchId)
  }, [matchId])

  const categories = useMemo(() => [...new Set(mockMatches.map((m) => m.category))], [])

  const scoredMatches = useMemo<Match[]>(() => {
    return mockMatches
      .map((match) => ({
        ...match,
        score: Math.round(
          weights.economy * match.economy + weights.technical * match.technical + weights.environmental * match.environmental,
        ),
      }))
      .sort((a, b) => b.score - a.score)
  }, [weights])

  const filteredMatches = useMemo(() => {
    return scoredMatches.filter((match) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        match.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
        match.receiver.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = activeCategories.length === 0 || activeCategories.includes(match.category)
      return matchesSearch && matchesCategory
    })
  }, [scoredMatches, searchQuery, activeCategories])

  const selectedMatch = scoredMatches.find((m) => m.id === selectedMatchId) ?? null

  function handleSelectMatch(id: string) {
    setSelectedMatchId(id)
    navigate(`/marketplace/${id}`, { replace: true })
  }

  function handleCloseDetail() {
    setSelectedMatchId(null)
    navigate('/marketplace', { replace: true })
  }

  function handleProposeDeal(match: Match) {
    showToast(`Kesepakatan dengan ${match.receiver} berhasil diajukan.`)
  }

  function toggleCategory(category: string) {
    setActiveCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  return (
    <PageContainer>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr] xl:grid-cols-[280px_1fr_360px]">
        <div className="order-1">
          <PriorityPanel weights={weights} onWeightChange={setWeight} onApplyPreset={applyPreset} />
        </div>

        <div className="order-3 xl:order-2">
          <MatchList
            matches={filteredMatches}
            totalCount={mockMatches.length}
            loading={loading}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            categories={categories}
            activeCategories={activeCategories}
            onToggleCategory={toggleCategory}
            onClearCategories={() => setActiveCategories([])}
            selectedMatchId={selectedMatchId}
            onSelectMatch={handleSelectMatch}
            onProposeDeal={handleProposeDeal}
          />
        </div>

        <div className="order-2 xl:order-3">
          {selectedMatch ? (
            <div className="xl:sticky xl:top-[92px]">
              <MatchDetail match={selectedMatch} onClose={handleCloseDetail} />
            </div>
          ) : (
            <div className="xl:sticky xl:top-[92px]">
              <EmptyState
                icon={Inbox}
                title="Belum ada match dipilih"
                description="Pilih salah satu pasangan dari daftar untuk melihat analisis detail kecocokan."
              />
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  )
}
