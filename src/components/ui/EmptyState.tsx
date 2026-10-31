import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
}

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-[14px] border border-dashed border-border px-6 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/4">
        <Icon className="h-6 w-6 text-text-secondary" />
      </div>
      <div>
        <p className="font-semibold text-text">{title}</p>
        <p className="mt-1 text-sm text-text-secondary">{description}</p>
      </div>
    </div>
  )
}
