import type { EconomicLineItem, PlantProfile } from '../types/digitalTwin'

export const SOURCE_PROFILES: PlantProfile[] = [
  {
    id: 'smelter-nikel-sulawesi',
    name: 'PT Smelter Nikel Sulawesi',
    role: 'source',
    subtitle: 'Kawasan Industri Morowali',
    baseTemperatureC: 350,
    heatAvailableMW: 1.6,
    baseFlowRateKgS: 12.5,
    qualityFactor: 0.82,
  },
  {
    id: 'petrokimia-banten',
    name: 'PT Petrokimia Banten',
    role: 'source',
    subtitle: 'Kawasan Industri Cilegon',
    baseTemperatureC: 310,
    heatAvailableMW: 1.35,
    baseFlowRateKgS: 10.8,
    qualityFactor: 0.74,
  },
  {
    id: 'pupuk-gresik-utama',
    name: 'PT Pupuk Gresik Utama',
    role: 'source',
    subtitle: 'Kawasan Industri Gresik',
    baseTemperatureC: 280,
    heatAvailableMW: 1.1,
    baseFlowRateKgS: 9.4,
    qualityFactor: 0.69,
  },
]

export const RECEIVER_PROFILES: PlantProfile[] = [
  {
    id: 'semen-indonesia',
    name: 'PT Semen Indonesia',
    role: 'receiver',
    subtitle: 'Pabrik Penerima Panas Proses',
    baseTemperatureC: 230,
    heatAvailableMW: 0,
    baseFlowRateKgS: 12.5,
    qualityFactor: 0.748,
  },
  {
    id: 'kertas-nusantara',
    name: 'PT Kertas Nusantara',
    role: 'receiver',
    subtitle: 'Pabrik Pulp & Kertas',
    baseTemperatureC: 205,
    heatAvailableMW: 0,
    baseFlowRateKgS: 11.2,
    qualityFactor: 0.7,
  },
  {
    id: 'tekstil-jaya',
    name: 'PT Tekstil Jaya',
    role: 'receiver',
    subtitle: 'Pabrik Tekstil & Pewarnaan',
    baseTemperatureC: 185,
    heatAvailableMW: 0,
    baseFlowRateKgS: 9.8,
    qualityFactor: 0.65,
  },
]

export const DEFAULT_SOURCE_ID = SOURCE_PROFILES[0].id
export const DEFAULT_RECEIVER_ID = RECEIVER_PROFILES[0].id

export const SIMULATION_RUNTIME_MINUTES = 120

export const PIPELINE_SPEC = {
  lengthM: 500,
  diameter: 'DN200',
  material: 'Carbon Steel',
  insulation: 'Rockwool 50 mm',
  operatingHoursPerYear: 8000,
}

export const economicData = {
  investment: {
    items: [
      { label: 'Persiapan & Instalasi', value: 50_000_000 },
      { label: 'Heat Exchanger & Peralatan', value: 60_000_000 },
      { label: 'Instalasi & Konstruksi', value: 50_000_000 },
      { label: 'Instrumentasi & Kontrol', value: 25_000_000 },
      { label: 'Engineering & Studi', value: 15_000_000 },
      { label: 'Cadangan (Contingency)', value: 50_000_000 },
    ] satisfies EconomicLineItem[],
    total: 250_000_000,
  },
  revenue: {
    items: [
      { label: 'Penghematan Energi', value: 1_200_000_000 },
      { label: 'Pendapatan Tambahan', value: 250_000_000 },
    ] satisfies EconomicLineItem[],
    total: 1_450_000_000,
  },
  opex: {
    items: [
      { label: 'Biaya Operasi & Perawatan', value: 30_000_000 },
      { label: 'Biaya Operator', value: 120_000_000 },
      { label: 'Biaya Listrik', value: 50_000_000 },
      { label: 'Suku Cadang', value: 50_000_000 },
    ] satisfies EconomicLineItem[],
    total: 250_000_000,
  },
  grossIncome: 1_250_000_000,
  ebt: 750_000_000,
  tax: 187_500_000,
  netCashFlow: 562_500_000,
  cumulativeCashFlow10yr: 5_625_000_000,
  summary10yr: {
    totalInvestment: 250_000_000,
    totalSavings: 12_000_000_000,
    totalOpex: 2_500_000_000,
    totalProfit: 1_875_000_000,
    netCashFlow: 5_625_000_000,
  },
  outcomes: {
    paybackYears: 3.2,
    roiPct: 168,
    irrPct: 24.7,
    npv: 3_420_000_000,
  },
}
