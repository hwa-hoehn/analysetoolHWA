import type { ReactNode } from 'react'

export function Section({ title, children, hint }: { title: string; children: ReactNode; hint?: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      <h3 className="font-semibold text-slate-100 mb-1">{title}</h3>
      {hint && <p className="text-xs text-slate-500 mb-3">{hint}</p>}
      {!hint && <div className="mb-3" />}
      {children}
    </div>
  )
}
