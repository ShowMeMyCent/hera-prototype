import { Dropdown } from '../ui/Dropdown'

interface AnalyticsHeaderProps {
  zoneId: string
  factoryId: string
  sensorId: string
  zoneOptions: { value: string; label: string }[]
  factoryOptions: { value: string; label: string }[]
  sensorOptions: { value: string; label: string }[]
  onZoneChange: (value: string) => void
  onFactoryChange: (value: string) => void
  onSensorChange: (value: string) => void
}

export function AnalyticsHeader({
  zoneId,
  factoryId,
  sensorId,
  zoneOptions,
  factoryOptions,
  sensorOptions,
  onZoneChange,
  onFactoryChange,
  onSensorChange,
}: AnalyticsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:flex lg:gap-3">
        <Dropdown
          label="Kawasan Industri (Zone)"
          options={zoneOptions}
          value={zoneId}
          onChange={onZoneChange}
          className="sm:w-60"
        />
        <Dropdown
          label="Pabrik Sumber (Factory)"
          options={factoryOptions}
          value={factoryId}
          onChange={onFactoryChange}
          className="sm:w-60"
        />
        <Dropdown
          label="Titik Sensor (Sensor Point)"
          options={sensorOptions}
          value={sensorId}
          onChange={onSensorChange}
          className="sm:w-60"
        />
      </div>

      <div className="flex items-center gap-2 self-start rounded-full border border-green/25 bg-green/10 px-4 py-2 text-xs font-bold tracking-wide text-green-dark uppercase lg:self-auto">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-green" />
        </span>
        Live IoT Feed
      </div>
    </div>
  )
}
