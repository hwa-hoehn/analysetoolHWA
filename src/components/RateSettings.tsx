import { Section } from './Section'

export function RateSettings({
  discountPercent,
  onDiscountPercent,
}: {
  discountPercent: number
  onDiscountPercent: (v: number) => void
}) {
  return (
    <Section title="Kundenrabatt">
      <label className="text-sm text-slate-400 block">
        Rabatt: <span className="text-violet-400 font-medium">{discountPercent}%</span>
        <input
          type="range"
          min={0}
          max={50}
          step={1}
          value={discountPercent}
          onChange={(e) => onDiscountPercent(Number(e.target.value))}
          className="mt-2 w-full accent-violet-500"
        />
      </label>
    </Section>
  )
}
