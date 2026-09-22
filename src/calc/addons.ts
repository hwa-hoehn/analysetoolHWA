import type { AddonDef } from '../types'

// Quelle: HWA_Preis_Kalkulationshilfe.xlsx (Positionen 03–09).
// Positionen 01 (Grundpaket) und 02 (Zusatzseite) werden separat über
// die Seitenzahl berechnet, siehe pricing.ts.
export const ADDON_CATALOG: AddonDef[] = [
  { id: 'booking', position: '03', label: 'Terminbuchungs-Tool anbinden', price: 75, perUnit: false },
  { id: 'multilang', position: '04', label: 'Mehrsprachigkeit', price: 100, perUnit: true, unitLabel: 'zusätzliche Sprache' },
  { id: 'content', position: '05', label: 'Texte/Inhalte selbst formulieren lassen', price: 75, perUnit: false, description: 'statt Kunde liefert' },
  { id: 'images', position: '06', label: 'Bildbearbeitung / Fotos organisieren & optimieren', price: 50, perUnit: false },
  { id: 'domain', position: '07', label: 'Domain-Registrierung begleiten', price: 40, perUnit: false, description: 'Kunde hat noch keine' },
  { id: 'express', position: '08', label: 'Express-Bearbeitung', price: 100, perUnit: false, description: 'Fertigstellung < 1 Woche' },
  { id: 'cms', position: '09', label: 'Einbau eigener Aktualisierungsmöglichkeiten (Decap CMS)', price: 100, perUnit: false },
]

export function addonById(id: string): AddonDef | undefined {
  return ADDON_CATALOG.find((a) => a.id === id)
}
