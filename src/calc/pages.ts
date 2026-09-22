import type { PageOption } from '../types'

export const PAGE_CATALOG: PageOption[] = [
  { id: 'home', label: 'Startseite', alwaysIncluded: true },
  { id: 'about', label: 'Über uns / Team' },
  { id: 'services', label: 'Leistungen / Angebot' },
  { id: 'menu', label: 'Speisekarte / Produkte' },
  { id: 'gallery', label: 'Galerie / Impressionen' },
  { id: 'testimonials', label: 'Bewertungen / Referenzen' },
  { id: 'contact', label: 'Kontakt' },
  { id: 'blog', label: 'Blog / News' },
  { id: 'faq', label: 'FAQ' },
  { id: 'legal', label: 'Impressum & Datenschutz', alwaysIncluded: true, countsTowardPrice: false },
]

export function pageById(id: string): PageOption | undefined {
  return PAGE_CATALOG.find((p) => p.id === id)
}
