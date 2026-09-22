import { PAGE_CATALOG } from './pages'
import type { CalculatorState, ComplexityScore, StyleDirection } from '../types'

export const INITIAL_STATE: CalculatorState = {
  selectedPageIds: ['home', 'legal'],
  customPages: [],
  addonQuantities: {},
  customSoftwareHours: 0,
  customSoftwareRate: 40,
  applyComplexitySurcharge: false,
  complexitySurchargePercent: 0,
  complexity: 2,
  style: 'Modern & minimalistisch',
  discountPercent: 0,
}

export type Action =
  | { type: 'TOGGLE_PAGE'; id: string }
  | { type: 'ADD_CUSTOM_PAGE'; name: string }
  | { type: 'REMOVE_CUSTOM_PAGE'; index: number }
  | { type: 'SET_ADDON_QUANTITY'; id: string; value: number }
  | { type: 'TOGGLE_ADDON'; id: string }
  | { type: 'SET_CUSTOM_SOFTWARE_HOURS'; value: number }
  | { type: 'SET_CUSTOM_SOFTWARE_RATE'; value: number }
  | { type: 'SET_APPLY_COMPLEXITY_SURCHARGE'; value: boolean }
  | { type: 'SET_COMPLEXITY_SURCHARGE_PERCENT'; value: number }
  | { type: 'SET_COMPLEXITY'; value: ComplexityScore }
  | { type: 'SET_STYLE'; value: StyleDirection }
  | { type: 'SET_DISCOUNT'; value: number }
  | { type: 'RESET' }

export function calculatorReducer(state: CalculatorState, action: Action): CalculatorState {
  switch (action.type) {
    case 'TOGGLE_PAGE': {
      const page = PAGE_CATALOG.find((p) => p.id === action.id)
      if (!page || page.alwaysIncluded) return state
      return {
        ...state,
        selectedPageIds: state.selectedPageIds.includes(action.id)
          ? state.selectedPageIds.filter((id) => id !== action.id)
          : [...state.selectedPageIds, action.id],
      }
    }
    case 'ADD_CUSTOM_PAGE': {
      const name = action.name.trim()
      if (!name) return state
      return { ...state, customPages: [...state.customPages, name] }
    }
    case 'REMOVE_CUSTOM_PAGE':
      return { ...state, customPages: state.customPages.filter((_, i) => i !== action.index) }
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
      return { ...state, customSoftwareRate: Math.min(45, Math.max(35, action.value)) }
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
    case 'RESET':
      return INITIAL_STATE
    default:
      return state
  }
}

const STORAGE_KEY = 'hwa-kalkulator-state-v3'

export function loadPersistedState(): CalculatorState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return INITIAL_STATE
    const parsed = JSON.parse(raw)
    const merged: CalculatorState = { ...INITIAL_STATE, ...parsed }
    // Aus älteren Sitzungen gespeicherte Stundensätze außerhalb des aktuell
    // gültigen Bereichs (z.B. nach einer Preisanpassung) auf den Rand klemmen.
    merged.customSoftwareRate = Math.min(45, Math.max(35, merged.customSoftwareRate))
    return merged
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
