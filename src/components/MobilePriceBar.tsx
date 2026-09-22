import { formatCurrency } from '../calc/pricing'

export function MobilePriceBar({ total }: { total: number }) {
  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-20 border-t border-violet-500/30 bg-slate-950/95 backdrop-blur px-4 py-3">
      <p className="text-[11px] text-slate-500 leading-tight">Geschätzter Preis</p>
      <p className="text-xl font-bold text-white leading-tight">{formatCurrency(total)}</p>
    </div>
  )
}
