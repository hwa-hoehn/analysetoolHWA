# HWA Website-Kalkulator

Interner Kalkulator für Website-Angebote, aufgebaut auf der echten HWA-Preisliste
(`HWA_Preis_Kalkulationshilfe.xlsx`): Grundpaket + Positionsliste + Kundenrabatt,
erweitert um einen KI-gestützten Import, der eine Referenz-Website analysiert und
die Felder automatisch vorbefüllt.

## Setup

```bash
npm install
cp .env.example .env   # ANTHROPIC_API_KEY eintragen
npm run dev
```

`npm run dev` startet Frontend (Vite, Port 5173) und Backend (Express, Port
8787) gleichzeitig. Das Frontend proxied `/api/*`-Anfragen an das Backend.

Ohne gültigen `ANTHROPIC_API_KEY` funktioniert der Kalkulator weiterhin voll
manuell — nur der "Referenz-Website importieren"-Button liefert dann einen
Fehler.

## Wie der Import funktioniert

1. Du fügst den Link einer Referenz-Website ein und klickst "Analysieren".
2. Das Backend lädt die Seite serverseitig, extrahiert Navigation,
   Überschriften, Text und technische Signale (Video, Formulare, Galerie,
   Slider, Mehrsprachigkeit).
3. Diese Signale gehen an Claude (Sonnet) mit einem Prompt, der Design-
   Komplexität (1–5), Stilrichtung, Seitenstruktur, auffällige Funktionen und
   einen Aufwandsfaktor abfragt.
4. Das Ergebnis füllt automatisch Seitenzahl, passende Zusatzleistungen (per
   Keyword-Abgleich, z.B. "Terminbuchung" → Position 03) und einen
   vorgeschlagenen Design-Aufschlag aus. Alles bleibt danach frei manuell
   nachjustierbar.

Läuft identisch am Desktop und am Handy, da alles im Browser passiert — kein
Wechsel in eine separate App nötig.

## Preislogik

Siehe [`src/calc/pricing.ts`](src/calc/pricing.ts) — 1:1 die Positionen aus
`HWA_Preis_Kalkulationshilfe.xlsx`, plus zwei Erweiterungen:

```
Grundpaket (300 €, deckt bis zu 3 Seiten)
+ zusätzliche Seiten × 50 €
+ Zusatzleistungen (Positionen 03–09, siehe src/calc/addons.ts)
+ Individualsoftware/Automatisierung (Stunden × 25–35 €/h, laut Preisliste
  nicht Teil der Pauschalen)
+ optionaler Design-Aufschlag (nicht Teil der offiziellen Preisliste — nur für
  Referenzseiten mit deutlich überdurchschnittlichem Gestaltungsaufwand,
  vom KI-Import vorgeschlagen)
= Zwischensumme
− Kundenrabatt (%)
= Gesamtpreis
```

Alle Beträge sind in [`src/calc/pricing.ts`](src/calc/pricing.ts) und
[`src/calc/addons.ts`](src/calc/addons.ts) frei anpassbar, falls sich die
offizielle Preisliste ändert.
