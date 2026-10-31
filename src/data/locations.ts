import type { Factory, IndustrialZone, SensorPoint } from '../types'

export const zones: IndustrialZone[] = [
  { id: 'zone-morowali', name: 'Kawasan Industri Morowali' },
  { id: 'zone-cilegon', name: 'Kawasan Industri Cilegon' },
  { id: 'zone-gresik', name: 'Kawasan Industri Gresik' },
]

export const factories: Factory[] = [
  { id: 'factory-smelter-nikel', zoneId: 'zone-morowali', name: 'PT Smelter Nikel Sulawesi' },
  { id: 'factory-semen-nusantara', zoneId: 'zone-morowali', name: 'PT Semen Nusantara' },
  { id: 'factory-petrokimia', zoneId: 'zone-cilegon', name: 'PT Petrokimia Banten' },
  { id: 'factory-pupuk', zoneId: 'zone-gresik', name: 'PT Pupuk Gresik Utama' },
]

export const sensorPoints: SensorPoint[] = [
  { id: 'sensor-a01', factoryId: 'factory-smelter-nikel', name: 'Exhaust Stack A-01' },
  { id: 'sensor-a02', factoryId: 'factory-smelter-nikel', name: 'Exhaust Stack A-02' },
  { id: 'sensor-b01', factoryId: 'factory-semen-nusantara', name: 'Kiln Outlet B-01' },
  { id: 'sensor-c01', factoryId: 'factory-petrokimia', name: 'Reactor Vent C-01' },
  { id: 'sensor-d01', factoryId: 'factory-pupuk', name: 'Furnace Stack D-01' },
]
