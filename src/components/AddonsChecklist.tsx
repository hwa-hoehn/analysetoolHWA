import { useMemo, useState } from 'react'
import { Section } from './Section'
import { ADDON_CATALOG, CATEGORY_LABELS } from '../calc/addons'
import type { AddonCategory } from '../types'

export function AddonsChecklist({
  quantities,
  onToggle,
  onQuantityChange,
}: {
  quantities: Record<string, number>
  onToggle: (id: string) => void
  onQuantityChange: (id: string, value: number) => void
}) {
  const [query, setQuery] = useState('')

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = q
      ? ADDON_CATALOG.filter(
          (addon) =>
            addon.label.toLowerCase().includes(q) || addon.description?.toLowerCase().includes(q),
        )
      : ADDON_CATALOG

    const byCategory = new Map<AddonCategory, typeof ADDON_CATALOG>()
    for (const addon of filtered) {
      const list = byCategory.get(addon.category) ?? []
      list.push(addon)
      byCategory.set(addon.category, list)
    }
    return byCategory
  }, [query])

  return (
    <Section title="Zusatzleistungen" hint="Positionen 03–14 der HWA-Preisliste, gruppiert nach Bereich.">
      <input
        type="text"
        placeholder="Zusatzleistung suchen …"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full mb-4 rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
      />

      {grouped.size === 0 && <p className="text-sm text-slate-500">Keine Treffer.</p>}

      <div className="space-y-5">
        {Array.from(grouped.entries()).map(([category, addons]) => (
          <div key={category}>
            <h4 className="text-xs uppercase tracking-wide text-slate-500 mb-2">{CATEGORY_LABELS[category]}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {addons.map((addon) => {
                const quantity = quantities[addon.id] ?? 0
                const checked = quantity > 0
                return (
                  <label
                    key={addon.id}
                    className={`flex items-start gap-2.5 rounded-lg border px-3 py-2 transition-colors ${
                      checked ? 'border-violet-500 bg-violet-500/10' : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => onToggle(addon.id)}
                      className="mt-0.5 accent-violet-500 cursor-pointer"
                    />
                    <span className="flex-1">
                      <span className="text-sm text-slate-200">
                        <span className="text-slate-600 mr-1.5">{addon.position}</span>
                        {addon.label}
                      </span>
                      <span className="block text-xs text-slate-500">
                        {addon.description ? `${addon.description} · ` : ''}
                        {addon.perUnit ? `${addon.price} € je ${addon.unitLabel}` : `${addon.price} €`}
                        {addon.recurring ? '/Monat' : ''}
                      </span>
                      {checked && addon.perUnit && (
                        <span className="mt-1.5 flex items-center gap-2 text-xs text-slate-400">
                          Anzahl
                          <input
                            type="number"
                            min={1}
                            value={quantity}
                            onClick={(e) => e.preventDefault()}
                            onChange={(e) => onQuantityChange(addon.id, Number(e.target.value))}
                            className="w-16 rounded bg-slate-950 border border-slate-800 px-2 py-0.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
                          />
                        </span>
                      )}
                    </span>
                  </label>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}
