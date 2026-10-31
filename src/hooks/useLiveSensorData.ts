import { useEffect, useState } from 'react'
import { initialSensorReading } from '../data/mockSensorData'
import type { SensorReading } from '../types'

function formatWibTimestamp(date: Date): string {
  const formatted = new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date)
  return `${formatted} WIB`
}

function jitter(value: number, spread: number): number {
  return Number((value + (Math.random() - 0.5) * spread * 2).toFixed(1))
}

export function useLiveSensorData() {
  const [reading, setReading] = useState<SensorReading>(initialSensorReading)
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    const interval = setInterval(
      () => {
        setReading((prev) => {
          const nextTemperature = jitter(prev.temperature, 1.2)
          const nextFlow = Number(jitter(prev.flowRate, 0.15).toFixed(1))
          const nextTrendPoint = { t: new Date().toISOString(), value: nextTemperature }
          const nextFlowPoint = { t: new Date().toISOString(), value: nextFlow }

          return {
            ...prev,
            temperature: nextTemperature,
            temperatureTrend: [...prev.temperatureTrend.slice(1), nextTrendPoint],
            flowRate: nextFlow,
            flowRateTrend: [...prev.flowRateTrend.slice(1), nextFlowPoint],
            lastTransmission: formatWibTimestamp(new Date()),
          }
        })
        setPulse(true)
        setTimeout(() => setPulse(false), 700)
      },
      5000 + Math.random() * 5000,
    )

    return () => clearInterval(interval)
  }, [])

  return { reading, pulse }
}
