import Anthropic from '@anthropic-ai/sdk'
import * as cheerio from 'cheerio'

export interface AnalysisResult {
  complexity: {
    score: 1 | 2 | 3 | 4 | 5
    reasoning: string
  }
  style: string
  pages: string[]
  notableFeatures: string[]
  effortFactor: {
    value: number
    reasoning: string
  }
  sourceUrl: string
  sourceTitle: string
}

const STYLE_OPTIONS = [
  'Klassisch & seriös',
  'Modern & minimalistisch',
  'Warm & persönlich',
  'Verspielt & kreativ',
  'Technisch & klar',
  'Traditionell & bodenständig',
] as const

const SYSTEM_PROMPT = `Du bist ein erfahrener Webdesign-Kalkulator-Assistent. Du bekommst den extrahierten Text- und Struktur-Inhalt einer Referenz-Website und schätzt für eine interne Projektkalkulation ein, wie aufwendig eine Website in diesem Stil nachzubauen wäre. Antworte AUSSCHLIESSLICH mit einem JSON-Objekt, ohne Markdown-Codeblock, exakt in diesem Schema:

{
  "complexity": { "score": 1-5, "reasoning": "kurzer deutscher Satz" },
  "style": "eine der folgenden Optionen exakt: ${STYLE_OPTIONS.join(' | ')}",
  "pages": ["Startseite", "..."],
  "notableFeatures": ["..."],
  "effortFactor": { "value": Zahl z.B. 1.3, "reasoning": "kurzer deutscher Satz" }
}

Bewertungsskala complexity.score:
1 = Sehr einfach (Standard-Layout, keine Animationen, Baukasten-Look)
2 = Einfach (sauberes Layout, kaum Custom-Elemente)
3 = Mittel (eigenes Design, ein paar Animationen/Interaktionen)
4 = Aufwendig (viele Custom-Komponenten, Scroll-Animationen, durchdachtes Interaktionsdesign)
5 = Sehr aufwendig (komplexe Animationen, custom Illustrationen/3D-Elemente, aufwendige Mikrointeraktionen)

effortFactor.value ist der geschätzte Gesamtaufwand als Faktor im Vergleich zu einer Standard-Website (1.0 = Standardaufwand).`

function extractPageSignal(html: string, url: string) {
  const $ = cheerio.load(html)
  $('script, style, noscript, svg').remove()

  const title = $('title').first().text().trim() || url
  const metaDescription = $('meta[name="description"]').attr('content') ?? ''

  const navLinks = new Set<string>()
  $('nav a, header a, [role="navigation"] a').each((_, el) => {
    const text = $(el).text().trim()
    if (text && text.length < 60) navLinks.add(text)
  })

  const headings: string[] = []
  $('h1, h2, h3').each((_, el) => {
    const text = $(el).text().trim()
    if (text) headings.push(text)
  })

  const bodyText = $('body').text().replace(/\s+/g, ' ').trim().slice(0, 4000)

  const hasVideo = $('video, iframe[src*="youtube"], iframe[src*="vimeo"]').length > 0
  const hasForm = $('form').length > 0
  const hasGallery = $('[class*="gallery" i], [class*="lightbox" i], [id*="gallery" i]').length > 0
  const hasSlider = $('[class*="slider" i], [class*="carousel" i], [class*="swiper" i]').length > 0
  const langAttr = $('html').attr('lang') ?? ''
  const hasLangSwitch = $('[class*="lang" i], [href*="/en/"], [href*="/de/"]').length > 0

  return {
    title,
    metaDescription,
    navLinks: Array.from(navLinks).slice(0, 30),
    headings: headings.slice(0, 40),
    bodyText,
    signals: { hasVideo, hasForm, hasGallery, hasSlider, langAttr, hasLangSwitch },
  }
}

export async function analyzeWebsite(url: string): Promise<AnalysisResult> {
  const parsed = new URL(url)
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error('Nur http/https URLs werden unterstützt.')
  }

  const response = await fetch(parsed.toString(), {
    redirect: 'follow',
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36 HWA-Kalkulator-Bot',
    },
    signal: AbortSignal.timeout(15000),
  })

  if (!response.ok) {
    throw new Error(`Seite konnte nicht geladen werden (HTTP ${response.status}).`)
  }

  const html = await response.text()
  const signal = extractPageSignal(html, parsed.toString())

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const userContent = `Referenz-URL: ${parsed.toString()}
Seitentitel: ${signal.title}
Meta-Beschreibung: ${signal.metaDescription}

Navigation (vermutliche Unterseiten):
${signal.navLinks.join(', ') || '(keine erkannt)'}

Überschriften auf der Seite:
${signal.headings.join(' | ') || '(keine erkannt)'}

Technische Signale: ${JSON.stringify(signal.signals)}

Sichtbarer Seitentext (gekürzt):
${signal.bodyText}`

  const message = await anthropic.messages
    .create({
      model: 'claude-sonnet-5',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userContent }],
    })
    .catch((err) => {
      if (err instanceof Anthropic.APIError) {
        const apiMessage = (err.error as { error?: { message?: string } } | undefined)?.error?.message
        throw new Error(apiMessage ?? err.message)
      }
      throw err
    })

  const textBlock = message.content.find((block) => block.type === 'text')
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('Keine verwertbare Antwort vom Modell erhalten.')
  }

  const jsonMatch = textBlock.text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error('Antwort des Modells enthielt kein JSON.')
  }

  const parsedResult = JSON.parse(jsonMatch[0]) as Omit<AnalysisResult, 'sourceUrl' | 'sourceTitle'>

  return {
    ...parsedResult,
    sourceUrl: parsed.toString(),
    sourceTitle: signal.title,
  }
}
