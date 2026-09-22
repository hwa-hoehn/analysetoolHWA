export type ComplexityScore = 1 | 2 | 3 | 4 | 5

export const STYLE_OPTIONS = [
  'Klassisch & seriös',
  'Modern & minimalistisch',
  'Warm & persönlich',
  'Verspielt & kreativ',
  'Technisch & klar',
  'Traditionell & bodenständig',
] as const

export type StyleDirection = (typeof STYLE_OPTIONS)[number]

export type AddonCategory = 'standard' | 'gastronomie' | 'sichtbarkeit' | 'recht' | 'betreuung'

export interface AddonDef {
  id: string
  position: string
  category: AddonCategory
  label: string
  price: number
  perUnit: boolean
  unitLabel?: string
  description?: string
  recurring?: boolean
}

export interface PageOption {
  id: string
  label: string
  alwaysIncluded?: boolean
  countsTowardPrice?: boolean
}

export interface CalculatorState {
  // Seitenauswahl: 'home' ist immer dabei, zählt zum Grundpaket (1–3 Seiten,
  // jede weitere kostet extraPagePrice). 'legal' zählt nicht mit (Pflichtseite).
  selectedPageIds: string[]
  customPages: string[]
  // Positionen 03–09 + Erweiterungen, Menge (0/1 für normale Addons, Anzahl für perUnit-Addons)
  addonQuantities: Record<string, number>
  // Hinweis auf dem Preisblatt: Individualsoftware/Automatisierung läuft nach Zeitaufwand, nicht Pauschale
  customSoftwareHours: number
  customSoftwareRate: number
  // Nicht Teil des offiziellen Preisblatts: optionaler Aufschlag für sehr aufwendige/individuelle Gestaltung
  applyComplexitySurcharge: boolean
  complexitySurchargePercent: number
  complexity: ComplexityScore
  style: StyleDirection
  discountPercent: number
}
