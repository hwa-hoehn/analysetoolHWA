import type { PriceBreakdown } from '../calc/pricing'
import { formatCurrency } from '../calc/pricing'
import type { CalculatorState } from '../types'

export function PriceSummary({
  state,
  breakdown,
  onReset,
}: {
  state: CalculatorState
  breakdown: PriceBreakdown
  onReset: () => void
}) {
  return (
    <div className="sticky top-6 rounded-2xl border border-violet-500/30 bg-slate-900/80 backdrop-blur p-6 shadow-xl shadow-violet-950/30">
      <p className="text-sm text-slate-400 mb-1">Geschätzter Projektpreis</p>
      <p className="text-4xl font-bold text-white mb-4">{formatCurrency(breakdown.total)}</p>

      <div className="space-y-1.5 text-sm border-t border-slate-800 pt-4">
        <Row label="Grundpaket (bis 3 Seiten)" value={formatCurrency(breakdown.basePackagePrice)} />
        {breakdown.extraPages > 0 && (
          <Row label={`${breakdown.extraPages} zusätzliche Seite(n)`} value={formatCurrency(breakdown.extraPagesPrice)} />
        )}
        {breakdown.addonLines.map((line) => (
          <Row
            key={line.id}
            label={line.quantity > 1 ? `${line.label} (${line.quantity}×)` : line.label}
            value={formatCurrency(line.price)}
          />
        ))}
        {breakdown.customSoftwarePrice > 0 && (
          <Row label="Individualsoftware/Automatisierung" value={formatCurrency(breakdown.customSoftwarePrice)} />
        )}
        {breakdown.complexitySurchargeAmount > 0 && (
          <Row
            label={`Design-Aufschlag (${state.complexitySurchargePercent}%)`}
            value={formatCurrency(breakdown.complexitySurchargeAmount)}
          />
        )}
        <Row label="Zwischensumme" value={formatCurrency(breakdown.subtotal)} muted />
        {state.discountPercent > 0 && (
          <Row
            label={`Kundenrabatt (${state.discountPercent}%)`}
            value={`− ${formatCurrency(breakdown.discountAmount)}`}
            accent="text-emerald-400"
          />
        )}
      </div>

      <button
        onClick={onReset}
        className="mt-5 w-full text-sm text-slate-500 hover:text-slate-300 transition-colors"
      >
        Zurücksetzen
      </button>
    </div>
  )
}

function Row({ label, value, muted, accent }: { label: string; value: string; muted?: boolean; accent?: string }) {
  return (
    <div className={`flex justify-between gap-4 ${muted ? 'text-slate-400' : 'text-slate-300'}`}>
      <span className="truncate">{label}</span>
      <span className={`whitespace-nowrap font-medium ${accent ?? ''}`}>{value}</span>
    </div>
  )
}
