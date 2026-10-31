import type { CriteriaScores } from '../../types'

interface CriteriaMatrixProps {
  criteria: CriteriaScores
}

const groups: { title: string; colorClass: string; items: { label: string; key: keyof CriteriaScores }[] }[] = [
  {
    title: 'Ekonomi',
    colorClass: 'bg-primary/8 text-primary',
    items: [
      { label: 'ROI', key: 'roi' },
      { label: 'CAPEX', key: 'capex' },
    ],
  },
  {
    title: 'Teknis',
    colorClass: 'bg-turquoise/8 text-turquoise-dark',
    items: [
      { label: 'Suhu', key: 'temperature' },
      { label: 'Fluctu', key: 'fluctuation' },
    ],
  },
  {
    title: 'Lingkungan',
    colorClass: 'bg-green/8 text-green-dark',
    items: [
      { label: 'CO2', key: 'co2' },
      { label: 'Efis', key: 'efficiency' },
    ],
  },
]

export function CriteriaMatrix({ criteria }: CriteriaMatrixProps) {
  return (
    <div>
      <p className="mb-3 text-xs font-semibold tracking-wide text-text-secondary uppercase">
        Matriks Intensitas Sub-Kriteria
      </p>
      <div className="flex flex-col gap-2">
        {groups.map((group) => (
          <div key={group.title} className="grid grid-cols-[72px_1fr_1fr] items-center gap-2">
            <span className="text-sm font-semibold text-text">{group.title}</span>
            {group.items.map((item) => (
              <div key={item.key} className={`rounded-md px-2.5 py-2 text-center text-xs font-bold ${group.colorClass}`}>
                {item.label}: {criteria[item.key].toFixed(2)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
