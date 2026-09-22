import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { analyzeWebsite } from './analyze.ts'

const app = express()
app.use(cors())
app.use(express.json())

app.post('/api/analyze', async (req, res) => {
  const { url } = req.body ?? {}

  if (typeof url !== 'string' || url.trim().length === 0) {
    return res.status(400).json({ error: 'Bitte eine URL angeben.' })
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({
      error: 'Kein ANTHROPIC_API_KEY konfiguriert. Siehe .env.example.',
    })
  }

  try {
    const result = await analyzeWebsite(url.trim())
    res.json(result)
  } catch (error) {
    console.error('Analyze failed:', error)
    const message = error instanceof Error ? error.message : 'Unbekannter Fehler bei der Analyse.'
    res.status(502).json({ error: message })
  }
})

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, hasApiKey: Boolean(process.env.ANTHROPIC_API_KEY) })
})

const PORT = Number(process.env.PORT) || 8787
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`)
})
