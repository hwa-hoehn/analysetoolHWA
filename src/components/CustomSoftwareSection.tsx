import { Section } from './Section'

export function CustomSoftwareSection({
  hours,
  onHours,
  rate,
  onRate,
}: {
  hours: number
  onHours: (v: number) => void
  rate: number
  onRate: (v: number) => void
}) {
  return (
    <Section
      title="Individualsoftware & Automatisierung"
      hint="Läuft laut Preisliste nicht über die Pauschalen, sondern nach Zeitaufwand (Richtwert 35–45 €/h)."
    >
      <div className="grid grid-cols-2 gap-4">
        <label className="text-sm text-slate-400">
          Stunden
          <input
            type="number"
            min={0}
            step={0.5}
            value={hours}
            onChange={(e) => onHours(Number(e.target.value))}
            className="mt-1 w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </label>
        <label className="text-sm text-slate-400">
          Stundensatz (€) <span className="text-slate-600">35–45</span>
          <input
            type="number"
            min={35}
            max={45}
            value={rate}
            onChange={(e) => onRate(Number(e.target.value))}
            className="mt-1 w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </label>
      </div>
    </Section>
  )
}
