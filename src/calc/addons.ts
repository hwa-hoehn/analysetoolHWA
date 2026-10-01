import type { AddonDef, AddonCategory } from '../types'

// Quelle: HWA_Preis_Kalkulationshilfe.xlsx. Positionen 01 (Grundpaket) und 02
// (Zusatzseite) werden separat über die Seitenauswahl berechnet, siehe pages.ts
// und pricing.ts. Positionen 10–13 wurden ergänzt (siehe README), Position 14
// (Wartungspaket) ist monatlich und läuft außerhalb der Einmalsumme.
// Position 09 (Decap CMS) wurde am 2026-10-01 entfernt, siehe README.
export const ADDON_CATALOG: AddonDef[] = [
  { id: 'booking', position: '03', category: 'standard', label: 'Terminbuchungs-Tool anbinden', price: 75, perUnit: false },
  { id: 'multilang', position: '04', category: 'standard', label: 'Mehrsprachigkeit', price: 100, perUnit: true, unitLabel: 'zusätzliche Sprache' },
  { id: 'content', position: '05', category: 'standard', label: 'Texte/Inhalte selbst formulieren lassen', price: 75, perUnit: false, description: 'statt Kunde liefert' },
  { id: 'images', position: '06', category: 'standard', label: 'Bildbearbeitung / Fotos organisieren & optimieren', price: 50, perUnit: false },
  { id: 'domain', position: '07', category: 'standard', label: 'Domain-Registrierung begleiten', price: 40, perUnit: false, description: 'Kunde hat noch keine' },
  { id: 'express', position: '08', category: 'standard', label: 'Express-Bearbeitung', price: 100, perUnit: false, description: 'Fertigstellung < 1 Woche' },
  { id: 'menuDigital', position: '10', category: 'gastronomie', label: 'Digitale Speisekarte mit Kategorien', price: 60, perUnit: false, description: 'inkl. QR-Code für Tischaufsteller' },
  { id: 'googleBusiness', position: '11', category: 'sichtbarkeit', label: 'Google Business Profil einrichten', price: 40, perUnit: false, description: 'lokale Auffindbarkeit bei Google Maps/Suche' },
  { id: 'reviews', position: '12', category: 'sichtbarkeit', label: 'Google-Bewertungen-Widget einbinden', price: 40, perUnit: false },
  { id: 'dsgvo', position: '13', category: 'recht', label: 'DSGVO-Grundausstattung', price: 50, perUnit: false, description: 'Cookie-Banner & Einbindung der Rechtstexte – Inhalte liefert der Kunde (Generator/Anwalt), keine Rechtsberatung' },
  { id: 'maintenance', position: '14', category: 'betreuung', label: 'Laufendes Wartungspaket', price: 15, perUnit: false, description: 'Updates & kleinere Textänderungen, monatlich kündbar', recurring: true },
]

export const CATEGORY_LABELS: Record<AddonCategory, string> = {
  standard: 'Standard-Zusatzleistungen',
  gastronomie: 'Für Gastronomie-Betriebe',
  sichtbarkeit: 'Sichtbarkeit & Marketing',
  recht: 'Rechtliches',
  betreuung: 'Laufende Betreuung',
}

export function addonById(id: string): AddonDef | undefined {
  return ADDON_CATALOG.find((a) => a.id === id)
}
