import { Section } from './Section'
import { BASE_PACKAGE_PAGES, BASE_PACKAGE_PRICE, EXTRA_PAGE_PRICE } from '../calc/pricing'

export function PageCountAndEffort({
  pageCount,
  onPageCount,
}: {
  pageCount: number
  onPageCount: (v: number) => void
}) {
  const extraPages = Math.max(0, pageCount - BASE_PACKAGE_PAGES)

  return (
    <Section
      title="Seitenzahl"
      hint={`Grundpaket (${BASE_PACKAGE_PRICE} €) deckt bis zu ${BASE_PACKAGE_PAGES} Seiten ab, jede weitere kostet ${EXTRA_PAGE_PRICE} €.`}
    >
      <label className="text-sm text-slate-400 block max-w-[140px]">
        Anzahl Seiten
        <input
          type="number"
          min={1}
          value={pageCount}
          onChange={(e) => onPageCount(Number(e.target.value))}
          className="mt-1 w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </label>
      {extraPages > 0 && (
        <p className="mt-2 text-xs text-slate-500">
          {extraPages} Seite{extraPages > 1 ? 'n' : ''} über dem Grundpaket hinaus → +{extraPages * EXTRA_PAGE_PRICE} €
        </p>
      )}
    </Section>
  )
}
