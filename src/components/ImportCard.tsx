import { useState } from 'react'
import type { AnalysisResult } from '../types'

interface ImportCardProps {
  onApply: (result: AnalysisResult) => void
}

type Status = 'idle' | 'loading' | 'error' | 'success'

export function ImportCard({ onApply }: ImportCardProps) {
  const [url, setUrl] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')
  const [lastResult, setLastResult] = useState<AnalysisResult | null>(null)

  async function handleAnalyze() {
    if (!url.trim()) return
    setStatus('loading')
    setError('')
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Analyse fehlgeschlagen.')
      setLastResult(data as AnalysisResult)
      onApply(data as AnalysisResult)
      setStatus('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler.')
      setStatus('error')
    }
  }

  return (
    <div className="rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-950/40 to-slate-900/40 p-5 shadow-lg shadow-violet-950/20">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">✨</span>
        <h2 className="font-semibold text-slate-100">Referenz-Website importieren</h2>
      </div>
      <p className="text-sm text-slate-400 mb-4">
        Link zu einer Referenzseite einfügen — Claude analysiert Design-Komplexität, Stil, Seitenstruktur
        und Funktionen und füllt die Regler unten automatisch aus.
      </p>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="url"
          inputMode="url"
          placeholder="https://beispiel-kunde.de"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
          className="flex-1 rounded-xl bg-slate-900/70 border border-slate-700 px-4 py-2.5 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        <button
          onClick={handleAnalyze}
          disabled={status === 'loading' || !url.trim()}
          className="rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed px-5 py-2.5 font-medium text-white transition-colors whitespace-nowrap"
        >
          {status === 'loading' ? 'Analysiere…' : 'Analysieren'}
        </button>
      </div>

      {status === 'error' && (
        <p className="mt-3 text-sm text-red-400 bg-red-950/40 border border-red-900 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {status === 'success' && lastResult && (
        <div className="mt-4 rounded-xl border border-emerald-800/50 bg-emerald-950/30 p-4 text-sm space-y-2">
          <p className="text-emerald-400 font-medium">
            Übernommen von "{lastResult.sourceTitle}"
          </p>
          <p className="text-slate-300">
            <span className="text-slate-500">Komplexität:</span> {lastResult.complexity.score}/5 —{' '}
            {lastResult.complexity.reasoning}
          </p>
          <p className="text-slate-300">
            <span className="text-slate-500">Stil:</span> {lastResult.style}
          </p>
          <p className="text-slate-300">
            <span className="text-slate-500">Seiten:</span> {lastResult.pages.join(', ')}
          </p>
          <p className="text-slate-300">
            <span className="text-slate-500">Auffällige Funktionen:</span>{' '}
            {lastResult.notableFeatures.join(', ') || 'keine besonderen'}
          </p>
          <p className="text-slate-300">
            <span className="text-slate-500">Aufwandsfaktor:</span> {lastResult.effortFactor.value}x —{' '}
            {lastResult.effortFactor.reasoning}
          </p>
        </div>
      )}
    </div>
  )
}
