import { ADDON_CATALOG } from './addons'
import { STYLE_OPTIONS } from '../types'
import type { AnalysisResult, CalculatorState, ComplexityScore, StyleDirection } from '../types'

export const INITIAL_STATE: CalculatorState = {
  pageCount: 3,
  addonQuantities: {},
  customSoftwareHours: 0,
  customSoftwareRate: 30,
  applyComplexitySurcharge: false,
  complexitySurchargePercent: 0,
  complexity: 2,
  style: 'Modern & minimalistisch',
  discountPercent: 0,
  lastImport: null,
}

const ADDON_KEYWORDS: Record<string, string[]> = {
  booking: ['terminbuchung', 'buchung', 'booking', 'termin'],
  multilang: ['mehrsprach', 'sprache', 'language'],
  cms: ['cms', 'blog', 'news', 'redaktion'],
}

function matchAddonsFromText(notableFeatures: string[]): Record<string, number> {
  const haystack = notableFeatures.join(' ').toLowerCase()
  const matches: Record<string, number> = {}
  for (const addon of ADDON_CATALOG) {
    const keywords = ADDON_KEYWORDS[addon.id]
    if (keywords?.some((kw) => haystack.includes(kw))) {
      matches[addon.id] = addon.perUnit ? 1 : 1
    }
  }
  return matches
}

function isValidStyle(style: string): style is StyleDirection {
  return (STYLE_OPTIONS as readonly string[]).includes(style)
}

// Aufwandsfaktor 1.0 = Standardaufwand -> 0% Aufschlag. Alles darüber wird
// als vorgeschlagener (nicht automatisch aktivierter) Zuschlag übernommen.
function effortFactorToSurchargePercent(effortFactor: number): number {
  return Math.max(0, Math.round((effortFactor - 1) * 100))
}

export type Action =
  | { type: 'SET_PAGE_COUNT'; value: number }
  | { type: 'SET_ADDON_QUANTITY'; id: string; value: number }
  | { type: 'TOGGLE_ADDON'; id: string }
  | { type: 'SET_CUSTOM_SOFTWARE_HOURS'; value: number }
  | { type: 'SET_CUSTOM_SOFTWARE_RATE'; value: number }
  | { type: 'SET_APPLY_COMPLEXITY_SURCHARGE'; value: boolean }
  | { type: 'SET_COMPLEXITY_SURCHARGE_PERCENT'; value: number }
  | { type: 'SET_COMPLEXITY'; value: ComplexityScore }
  | { type: 'SET_STYLE'; value: StyleDirection }
  | { type: 'SET_DISCOUNT'; value: number }
  | { type: 'APPLY_IMPORT'; result: AnalysisResult }
  | { type: 'RESET' }

export function calculatorReducer(state: CalculatorState, action: Action): CalculatorState {
  switch (action.type) {
    case 'SET_PAGE_COUNT':
      return { ...state, pageCount: Math.max(1, Math.round(action.value)) }
    case 'SET_ADDON_QUANTITY':
      return {
        ...state,
        addonQuantities: { ...state.addonQuantities, [action.id]: Math.max(0, Math.round(action.value)) },
      }
    case 'TOGGLE_ADDON': {
      const current = state.addonQuantities[action.id] ?? 0
      return {
        ...state,
        addonQuantities: { ...state.addonQuantities, [action.id]: current > 0 ? 0 : 1 },
      }
    }
    case 'SET_CUSTOM_SOFTWARE_HOURS':
      return { ...state, customSoftwareHours: Math.max(0, action.value) }
    case 'SET_CUSTOM_SOFTWARE_RATE':
      return { ...state, customSoftwareRate: Math.min(35, Math.max(25, action.value)) }
    case 'SET_APPLY_COMPLEXITY_SURCHARGE':
      return { ...state, applyComplexitySurcharge: action.value }
    case 'SET_COMPLEXITY_SURCHARGE_PERCENT':
      return { ...state, complexitySurchargePercent: Math.max(0, action.value) }
    case 'SET_COMPLEXITY':
      return { ...state, complexity: action.value }
    case 'SET_STYLE':
      return { ...state, style: action.value }
    case 'SET_DISCOUNT':
      return { ...state, discountPercent: Math.min(100, Math.max(0, action.value)) }
    case 'APPLY_IMPORT': {
      const { result } = action
      const suggestedSurcharge = effortFactorToSurchargePercent(result.effortFactor.value)
      return {
        ...state,
        complexity: result.complexity.score,
        style: isValidStyle(result.style) ? result.style : state.style,
        pageCount: result.pages.length > 0 ? result.pages.length : state.pageCount,
        complexitySurchargePercent: suggestedSurcharge,
        applyComplexitySurcharge: suggestedSurcharge > 0,
        addonQuantities: { ...state.addonQuantities, ...matchAddonsFromText(result.notableFeatures) },
        lastImport: result,
      }
    }
    case 'RESET':
      return INITIAL_STATE
    default:
      return state
  }
}

const STORAGE_KEY = 'hwa-kalkulator-state-v2'

export function loadPersistedState(): CalculatorState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return INITIAL_STATE
    const parsed = JSON.parse(raw)
    return { ...INITIAL_STATE, ...parsed }
  } catch {
    return INITIAL_STATE
  }
}

export function persistState(state: CalculatorState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ignore persistence failures (private mode, storage full, etc.)
  }
}
