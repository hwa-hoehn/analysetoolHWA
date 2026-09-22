import { Section } from './Section'
import type { ComplexityScore } from '../types'

const LABELS: Record<ComplexityScore, string> = {
  1: 'Sehr einfach — Baukasten-Look',
  2: 'Einfach — sauberes Standard-Layout',
  3: 'Mittel — eigenes Design, ein paar Animationen',
  4: 'Aufwendig — viele Custom-Komponenten',
  5: 'Sehr aufwendig — komplexe Animationen/3D',
}

export function DesignComplexity({
  complexity,
  onComplexity,
  applySurcharge,
  onApplySurcharge,
  surchargePercent,
  onSurchargePercent,
}: {
  complexity: ComplexityScore
  onComplexity: (v: ComplexityScore) => void
  applySurcharge: boolean
  onApplySurcharge: (v: boolean) => void
  surchargePercent: number
  onSurchargePercent: (v: number) => void
}) {
  return (
    <Section
      title="Design-Komplexität"
      hint="Nicht Teil der Standard-Preisliste — nur relevant, wenn das Design deutlich über einen Baukasten-Look hinausgeht."
    >
      <input
        type="range"
        min={1}
        max={5}
        step={1}
        value={complexity}
        onChange={(e) => onComplexity(Number(e.target.value) as ComplexityScore)}
        className="w-full accent-violet-500"
      />
      <div className="flex justify-between text-xs text-slate-500 mt-1 px-0.5 mb-3">
        {[1, 2, 3, 4, 5].map((n) => (
          <span key={n} className={n === complexity ? 'text-violet-400 font-semibold' : ''}>
            {n}
          </span>
        ))}
      </div>
      <p className="text-xs text-slate-500 mb-3">{LABELS[complexity]}</p>

      <label className="flex items-center gap-2.5 rounded-lg border border-slate-800 px-3 py-2 cursor-pointer">
        <input
          type="checkbox"
          checked={applySurcharge}
          onChange={(e) => onApplySurcharge(e.target.checked)}
          className="accent-violet-500"
        />
        <span className="text-sm text-slate-300 flex-1">Aufwands-Zuschlag für individuelles Design anwenden</span>
        <input
          type="number"
          min={0}
          disabled={!applySurcharge}
          value={surchargePercent}
          onChange={(e) => onSurchargePercent(Number(e.target.value))}
          className="w-16 rounded bg-slate-950 border border-slate-800 px-2 py-1 text-slate-100 text-sm disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        <span className="text-sm text-slate-500">%</span>
      </label>
    </Section>
  )
}
