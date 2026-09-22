import { useState } from 'react'
import { Section } from './Section'
import { PAGE_CATALOG } from '../calc/pages'
import { BASE_PACKAGE_PAGES, BASE_PACKAGE_PRICE, EXTRA_PAGE_PRICE } from '../calc/pricing'

export function PageSelection({
  selectedPageIds,
  onTogglePage,
  customPages,
  onAddCustomPage,
  onRemoveCustomPage,
  pageCount,
}: {
  selectedPageIds: string[]
  onTogglePage: (id: string) => void
  customPages: string[]
  onAddCustomPage: (name: string) => void
  onRemoveCustomPage: (index: number) => void
  pageCount: number
}) {
  const [customName, setCustomName] = useState('')
  const extraPages = Math.max(0, pageCount - BASE_PACKAGE_PAGES)

  function handleAdd() {
    if (!customName.trim()) return
    onAddCustomPage(customName)
    setCustomName('')
  }

  return (
    <Section
      title="Seiten"
      hint={`Grundpaket (${BASE_PACKAGE_PRICE} €) deckt bis zu ${BASE_PACKAGE_PAGES} Seiten ab, jede weitere kostet ${EXTRA_PAGE_PRICE} €. Impressum & Datenschutz zählen nicht mit.`}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {PAGE_CATALOG.map((page) => {
          const checked = selectedPageIds.includes(page.id)
          return (
            <label
              key={page.id}
              className={`flex items-center gap-2.5 rounded-lg border px-3 py-2 transition-colors ${
                page.alwaysIncluded ? 'opacity-60 cursor-default' : 'cursor-pointer'
              } ${checked ? 'border-violet-500 bg-violet-500/10' : 'border-slate-800 hover:border-slate-700'}`}
            >
              <input
                type="checkbox"
                checked={checked}
                disabled={page.alwaysIncluded}
                onChange={() => onTogglePage(page.id)}
                className="accent-violet-500"
              />
              <span className="text-sm text-slate-200">
                {page.label}
                {page.alwaysIncluded && <span className="text-slate-600"> · immer dabei</span>}
              </span>
            </label>
          )
        })}
      </div>

      {customPages.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {customPages.map((name, index) => (
            <li
              key={`${name}-${index}`}
              className="flex items-center justify-between gap-2 rounded-lg border border-violet-500 bg-violet-500/10 px-3 py-2 text-sm text-slate-200"
            >
              {name}
              <button
                onClick={() => onRemoveCustomPage(index)}
                className="text-slate-500 hover:text-red-400 transition-colors"
                aria-label={`${name} entfernen`}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3 flex gap-2">
        <input
          type="text"
          placeholder="Weitere Seite hinzufügen …"
          value={customName}
          onChange={(e) => setCustomName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          className="flex-1 rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        <button
          onClick={handleAdd}
          disabled={!customName.trim()}
          className="rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed px-4 py-2 text-sm text-slate-200 transition-colors"
        >
          Hinzufügen
        </button>
      </div>

      <p className="mt-3 text-xs text-slate-500">
        {pageCount} Seite{pageCount !== 1 ? 'n' : ''} gesamt
        {extraPages > 0 && ` · ${extraPages} über dem Grundpaket → +${extraPages * EXTRA_PAGE_PRICE} €`}
      </p>
    </Section>
  )
}
