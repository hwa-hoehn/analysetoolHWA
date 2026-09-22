import { ADDON_CATALOG } from './addons'
import type { CalculatorState } from '../types'

// Position 01 (HWA_Preis_Kalkulationshilfe.xlsx): Grundpaket deckt 1–3 Unterseiten.
export const BASE_PACKAGE_PRICE = 300
export const BASE_PACKAGE_PAGES = 3
// Position 02: jede weitere Seite über das Grundpaket hinaus.
export const EXTRA_PAGE_PRICE = 50

export interface AddonLine {
  id: string
  label: string
  quantity: number
  price: number
}

export interface PriceBreakdown {
  basePackagePrice: number
  extraPages: number
  extraPagesPrice: number
  addonLines: AddonLine[]
  addonsPrice: number
  customSoftwarePrice: number
  subtotalBeforeSurcharge: number
  complexitySurchargeAmount: number
  subtotal: number
  discountAmount: number
  total: number
}

export function calculatePrice(state: CalculatorState): PriceBreakdown {
  const extraPages = Math.max(0, state.pageCount - BASE_PACKAGE_PAGES)
  const extraPagesPrice = extraPages * EXTRA_PAGE_PRICE

  const addonLines: AddonLine[] = ADDON_CATALOG.filter(
    (addon) => (state.addonQuantities[addon.id] ?? 0) > 0,
  ).map((addon) => {
    const quantity = state.addonQuantities[addon.id] ?? 0
    return {
      id: addon.id,
      label: addon.label,
      quantity,
      price: addon.perUnit ? addon.price * quantity : addon.price,
    }
  })
  const addonsPrice = addonLines.reduce((sum, line) => sum + line.price, 0)

  const customSoftwarePrice = state.customSoftwareHours * state.customSoftwareRate

  const subtotalBeforeSurcharge = BASE_PACKAGE_PRICE + extraPagesPrice + addonsPrice + customSoftwarePrice

  const complexitySurchargeAmount = state.applyComplexitySurcharge
    ? subtotalBeforeSurcharge * (state.complexitySurchargePercent / 100)
    : 0

  const subtotal = subtotalBeforeSurcharge + complexitySurchargeAmount
  const discountAmount = subtotal * (state.discountPercent / 100)
  const total = subtotal - discountAmount

  return {
    basePackagePrice: BASE_PACKAGE_PRICE,
    extraPages,
    extraPagesPrice,
    addonLines,
    addonsPrice,
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
