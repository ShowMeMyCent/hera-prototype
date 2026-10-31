import { useMemo, useState } from 'react'
import { PageContainer } from '../components/layout/PageContainer'
import { AnalyticsHeader } from '../components/analytics/AnalyticsHeader'
import { ContinuityCard } from '../components/analytics/ContinuityCard'
import { FeasibilitySummary } from '../components/analytics/FeasibilitySummary'
import { FlowRateCard } from '../components/analytics/FlowRateCard'
import { GasCompositionCard } from '../components/analytics/GasCompositionCard'
import { StatusBar } from '../components/analytics/StatusBar'
import { TemperatureCard } from '../components/analytics/TemperatureCard'
import { factories, sensorPoints, zones } from '../data/locations'
import { feasibilitySummary } from '../data/mockSensorData'
import { useLiveSensorData } from '../hooks/useLiveSensorData'

export function AnalyticsPage() {
  const [zoneId, setZoneId] = useState(zones[0].id)
  const [factoryId, setFactoryId] = useState(factories[0].id)
  const [sensorId, setSensorId] = useState(sensorPoints[0].id)
  const { reading, pulse } = useLiveSensorData()

  const factoryOptions = useMemo(
    () => factories.filter((f) => f.zoneId === zoneId).map((f) => ({ value: f.id, label: f.name })),
    [zoneId],
  )
  const sensorOptions = useMemo(
    () => sensorPoints.filter((s) => s.factoryId === factoryId).map((s) => ({ value: s.id, label: s.name })),
    [factoryId],
  )

  const activeFactory = factories.find((f) => f.id === factoryId) ?? factories[0]

  function handleZoneChange(nextZoneId: string) {
    setZoneId(nextZoneId)
    const firstFactory = factories.find((f) => f.zoneId === nextZoneId)
    if (firstFactory) {
      setFactoryId(firstFactory.id)
      const firstSensor = sensorPoints.find((s) => s.factoryId === firstFactory.id)
      if (firstSensor) setSensorId(firstSensor.id)
    }
  }

  function handleFactoryChange(nextFactoryId: string) {
    setFactoryId(nextFactoryId)
    const firstSensor = sensorPoints.find((s) => s.factoryId === nextFactoryId)
    if (firstSensor) setSensorId(firstSensor.id)
  }

  return (
    <PageContainer className="flex flex-col gap-6">
      <AnalyticsHeader
        zoneId={zoneId}
        factoryId={factoryId}
        sensorId={sensorId}
        zoneOptions={zones.map((z) => ({ value: z.id, label: z.name }))}
        factoryOptions={factoryOptions}
        sensorOptions={sensorOptions}
        onZoneChange={handleZoneChange}
        onFactoryChange={handleFactoryChange}
        onSensorChange={setSensorId}
      />

      <StatusBar factoryName={activeFactory.name} reading={reading} pulse={pulse} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <TemperatureCard reading={reading} />
        <FlowRateCard reading={reading} />
        <ContinuityCard reading={reading} />
        <GasCompositionCard reading={reading} />
      </div>

      <FeasibilitySummary summary={feasibilitySummary} />
    </PageContainer>
  )
}
