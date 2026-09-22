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

export interface AddonDef {
  id: string
  position: string
  label: string
  price: number
  perUnit: boolean
  unitLabel?: string
  description?: string
}

export interface AnalysisResult {
  complexity: { score: ComplexityScore; reasoning: string }
  style: string
  pages: string[]
  notableFeatures: string[]
  effortFactor: { value: number; reasoning: string }
  sourceUrl: string
  sourceTitle: string
}

export interface CalculatorState {
  // Position 01 + 02: Grundpaket deckt 1–3 Seiten, jede weitere kostet extraPagePrice
  pageCount: number
  // Positionen 03–09, Menge (0/1 für normale Addons, Anzahl für perUnit-Addons wie Mehrsprachigkeit)
  addonQuantities: Record<string, number>
  // Hinweis auf dem Preisblatt: Individualsoftware/Automatisierung läuft nach Zeitaufwand, nicht Pauschale
  customSoftwareHours: number
  customSoftwareRate: number
  // Nicht Teil des offiziellen Preisblatts: optionaler Aufschlag für sehr aufwendige/individuelle Gestaltung,
  // z.B. wenn die Referenz-Analyse eine hohe Design-Komplexität ergibt
  applyComplexitySurcharge: boolean
  complexitySurchargePercent: number
  complexity: ComplexityScore
  style: StyleDirection
  discountPercent: number
  lastImport: AnalysisResult | null
}
