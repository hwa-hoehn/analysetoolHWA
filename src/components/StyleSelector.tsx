import { Section } from './Section'
import { STYLE_OPTIONS } from '../types'
import type { StyleDirection } from '../types'

export function StyleSelector({
  value,
  onChange,
}: {
  value: StyleDirection
  onChange: (v: StyleDirection) => void
}) {
  return (
    <Section title="Stilrichtung">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {STYLE_OPTIONS.map((option) => (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={`text-left text-sm rounded-lg px-3 py-2 border transition-colors ${
              value === option
                ? 'border-violet-500 bg-violet-500/10 text-violet-300'
                : 'border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </Section>
  )
}
