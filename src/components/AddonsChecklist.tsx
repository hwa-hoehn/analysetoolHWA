import { Section } from './Section'
import { ADDON_CATALOG } from '../calc/addons'

export function AddonsChecklist({
  quantities,
  onToggle,
  onQuantityChange,
}: {
  quantities: Record<string, number>
  onToggle: (id: string) => void
  onQuantityChange: (id: string, value: number) => void
}) {
  return (
    <Section title="Zusatzleistungen" hint="Positionen 03–09 der HWA-Preisliste.">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {ADDON_CATALOG.map((addon) => {
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
                <span className="flex items-center justify-between gap-2">
                  <span className="text-sm text-slate-200">
                    <span className="text-slate-600 mr-1.5">{addon.position}</span>
                    {addon.label}
                  </span>
                </span>
                <span className="block text-xs text-slate-500">
                  {addon.description ? `${addon.description} · ` : ''}
                  {addon.perUnit ? `${addon.price} € je ${addon.unitLabel}` : `${addon.price} €`}
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
    </Section>
  )
}
