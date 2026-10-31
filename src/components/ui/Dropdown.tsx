import { Check, ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { cn } from '../../lib/utils'

export interface DropdownOption {
  value: string
  label: string
}

interface DropdownProps {
  label?: string
  options: DropdownOption[]
  value: string
  onChange: (value: string) => void
  className?: string
}

export function Dropdown({ label, options, value, onChange, className }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const selected = options.find((o) => o.value === value)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      {label && (
        <div className="mb-1.5 text-xs font-semibold tracking-wide text-text-secondary uppercase">
          {label}
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-11 w-full items-center justify-between gap-2 rounded-lg border border-border bg-surface px-3.5 text-sm font-medium text-text transition-colors hover:border-text-secondary"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="truncate">{selected?.label ?? 'Pilih...'}</span>
        <ChevronDown className={cn('h-4 w-4 shrink-0 text-text-secondary transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute z-20 mt-1.5 max-h-64 w-full min-w-max overflow-auto rounded-lg border border-border bg-surface p-1 shadow-card-hover"
        >
          {options.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                role="option"
                aria-selected={option.value === value}
                onClick={() => {
                  onChange(option.value)
                  setOpen(false)
                }}
                className={cn(
                  'flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-black/4',
                  option.value === value ? 'font-semibold text-primary' : 'text-text',
                )}
              >
                <span className="truncate">{option.label}</span>
                {option.value === value && <Check className="h-4 w-4 shrink-0" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
