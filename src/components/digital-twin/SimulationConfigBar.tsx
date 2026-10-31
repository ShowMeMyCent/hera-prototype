import { CheckCircle2, Clock, XCircle } from 'lucide-react'
import { Dropdown, type DropdownOption } from '../ui/Dropdown'
import { Badge } from '../ui/Badge'
import { Card } from '../ui/Card'

interface SimulationConfigBarProps {
  sourceOptions: DropdownOption[]
  receiverOptions: DropdownOption[]
  sourceId: string
  receiverId: string
  onSourceChange: (id: string) => void
  onReceiverChange: (id: string) => void
  runtimeOptions: DropdownOption[]
  runtimeMinutes: string
  onRuntimeChange: (minutes: string) => void
  feasible: boolean
}

export function SimulationConfigBar({
  sourceOptions,
  receiverOptions,
  sourceId,
  receiverId,
  onSourceChange,
  onReceiverChange,
  runtimeOptions,
  runtimeMinutes,
  onRuntimeChange,
  feasible,
}: SimulationConfigBarProps) {
  return (
    <Card className="flex flex-col gap-4 p-4 sm:p-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:flex lg:items-end lg:gap-4">
        <Dropdown label="Source Plant" options={sourceOptions} value={sourceId} onChange={onSourceChange} className="lg:w-60" />
        <Dropdown label="Recipient Plant" options={receiverOptions} value={receiverId} onChange={onReceiverChange} className="lg:w-60" />

        <div>
          <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold tracking-wide text-text-secondary uppercase">
            <Clock className="h-3.5 w-3.5" />
            Simulation Runtime
          </div>
          <Dropdown options={runtimeOptions} value={runtimeMinutes} onChange={onRuntimeChange} className="lg:w-40" />
        </div>
      </div>

      <div className="flex flex-col items-start gap-1.5 lg:items-end">
        <p className="text-xs font-semibold tracking-wide text-text-secondary uppercase">Overall Feasibility Status</p>
        {feasible ? (
          <Badge tone="turquoise" dot>
            <CheckCircle2 className="h-3.5 w-3.5" />
            Layak Dicocokkan (Feasible)
          </Badge>
        ) : (
          <Badge tone="red" dot>
            <XCircle className="h-3.5 w-3.5" />
            Belum Layak (Not Feasible)
          </Badge>
        )}
      </div>
    </Card>
  )
}
