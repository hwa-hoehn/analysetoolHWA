import { ADDON_CATALOG } from './addons'
import { PAGE_CATALOG } from './pages'
import type { CalculatorState } from '../types'

// Position 01 (HWA_Preis_Kalkulationshilfe.xlsx): Grundpaket deckt 1–3 Unterseiten.
// Angepasst von 300 € auf 380 € (2026-09-22): 300 € lag unter dem Niveau
// vergleichbarer handgecodeter Websites selbst im Studenten-/Einstiegssegment.
// 380 € bleibt bewusst unter der 400-€-Schwelle, um für die Zielgruppe
// (kleine Betriebe wie Ferienwohnungen/Gastronomie) zugänglich zu bleiben.
export const BASE_PACKAGE_PRICE = 380
export const BASE_PACKAGE_PAGES = 3
// Position 02: jede weitere Seite über das Grundpaket hinaus.
export const EXTRA_PAGE_PRICE = 50

export function computePageCount(state: CalculatorState): number {
  const standardCounted = PAGE_CATALOG.filter(
    (p) => state.selectedPageIds.includes(p.id) && p.countsTowardPrice !== false,
  ).length
  return standardCounted + state.customPages.length
}

export interface AddonLine {
  id: string
  label: string
  quantity: number
  price: number
  recurring: boolean
}

export interface PriceBreakdown {
  pageCount: number
  basePackagePrice: number
  extraPages: number
  extraPagesPrice: number
  addonLines: AddonLine[]
  addonsPrice: number
  recurringAddonLines: AddonLine[]
  recurringMonthlyPrice: number
  customSoftwarePrice: number
  subtotalBeforeSurcharge: number
  complexitySurchargeAmount: number
  subtotal: number
  discountAmount: number
  total: number
}

export function calculatePrice(state: CalculatorState): PriceBreakdown {
  const pageCount = computePageCount(state)
  const extraPages = Math.max(0, pageCount - BASE_PACKAGE_PAGES)
  const extraPagesPrice = extraPages * EXTRA_PAGE_PRICE

  const allLines: AddonLine[] = ADDON_CATALOG.filter(
    (addon) => (state.addonQuantities[addon.id] ?? 0) > 0,
  ).map((addon) => {
    const quantity = state.addonQuantities[addon.id] ?? 0
    return {
      id: addon.id,
      label: addon.label,
      quantity,
      price: addon.perUnit ? addon.price * quantity : addon.price,
      recurring: addon.recurring ?? false,
    }
  })
  const addonLines = allLines.filter((line) => !line.recurring)
  const recurringAddonLines = allLines.filter((line) => line.recurring)
  const addonsPrice = addonLines.reduce((sum, line) => sum + line.price, 0)
  const recurringMonthlyPrice = recurringAddonLines.reduce((sum, line) => sum + line.price, 0)

  const customSoftwarePrice = state.customSoftwareHours * state.customSoftwareRate

  const subtotalBeforeSurcharge = BASE_PACKAGE_PRICE + extraPagesPrice + addonsPrice + customSoftwarePrice

  const complexitySurchargeAmount = state.applyComplexitySurcharge
    ? subtotalBeforeSurcharge * (state.complexitySurchargePercent / 100)
    : 0

  const subtotal = subtotalBeforeSurcharge + complexitySurchargeAmount
  const discountAmount = subtotal * (state.discountPercent / 100)
  const total = subtotal - discountAmount

  return {
    pageCount,
    basePackagePrice: BASE_PACKAGE_PRICE,
    extraPages,
    extraPagesPrice,
    addonLines,
    addonsPrice,
    recurringAddonLines,
    recurringMonthlyPrice,
    customSoftwarePrice,
    subtotalBeforeSurcharge,
    complexitySurchargeAmount,
    subtotal,
    discountAmount,
    total,
  }
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value)
}
