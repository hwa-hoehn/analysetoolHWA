# HWA Website-Kalkulator

Interner Kalkulator für Website-Angebote, aufgebaut auf der echten HWA-Preisliste
(`HWA_Preis_Kalkulationshilfe.xlsx`): Seitenauswahl, Zusatzleistungen nach
Bereich mit Suchleiste, Individualsoftware-Stunden, optionaler Design-Aufschlag
und Kundenrabatt.

## Setup

```bash
npm install
npm run dev
```

Reine Frontend-App (Vite + React), kein Backend, kein API-Key nötig.

## Funktionen

- **Seiten**: Checkliste aus typischen Seitentypen (Startseite, Über uns,
  Speisekarte, Galerie, Kontakt, Blog, FAQ, …) statt einer abstrakten Zahl,
  plus freie Eingabe für weitere Seiten. Impressum/Datenschutz sind immer
  dabei, zählen aber nicht in die Preisberechnung.
- **Zusatzleistungen**: Positionen 03–14 der Preisliste, gruppiert nach
  Bereich (Standard, Gastronomie, Sichtbarkeit & Marketing, Rechtliches,
  laufende Betreuung) mit Suchleiste zum schnellen Filtern.
- **Individualsoftware & Automatisierung**: Stunden × Stundensatz, laut
  Preisliste nicht Teil der Pauschalen.
- **Design-Komplexität**: optionaler manueller Aufschlag für Projekte, die
  deutlich über einen Baukasten-Look hinausgehen — nicht Teil der offiziellen
  Preisliste.
- **Kundenrabatt**: Regler von 0–50 %.

## Preislogik

Siehe [`src/calc/pricing.ts`](src/calc/pricing.ts) — 1:1 die Positionen aus
`HWA_Preis_Kalkulationshilfe.xlsx`, plus Erweiterungen:

```
Grundpaket (380 €, deckt bis zu 3 Seiten)
+ zusätzliche Seiten × 50 €
+ Zusatzleistungen, einmalig (Positionen 03–13, siehe src/calc/addons.ts)
+ Individualsoftware/Automatisierung (Stunden × 35–45 €/h, laut Preisliste
  nicht Teil der Pauschalen)
+ optionaler Design-Aufschlag (nicht Teil der offiziellen Preisliste — nur für
  Projekte mit deutlich überdurchschnittlichem Gestaltungsaufwand)
= Zwischensumme
− Kundenrabatt (%)
= Gesamtpreis (einmalig)

+ Position 14 (Wartungspaket), falls gewählt: separat als €/Monat ausgewiesen,
  nicht Teil der Einmalsumme
```

Alle Beträge sind in [`src/calc/pricing.ts`](src/calc/pricing.ts),
[`src/calc/addons.ts`](src/calc/addons.ts) und [`src/calc/pages.ts`](src/calc/pages.ts)
frei anpassbar, falls sich die offizielle Preisliste ändert.

### Preisanpassung 2026-09-22

Grundpaket (300 € → 380 €) und Individualsoftware-Stundensatz (25–35 €/h →
35–45 €/h) wurden angehoben. Begründung: beide lagen unter dem, was
vergleichbare handgecodete Websites bzw. Automatisierungsarbeit selbst im
Einstiegssegment realistisch kosten — besonders der Stundensatz lag nahe am
Niveau eines studentischen Nebenjobs, obwohl die gelieferte Automatisierung
(siehe Portfolio-Beispiel "Auftragsabgleich-Tool") konkrete Zeitersparnis im
Betrieb schafft, für die Kunden deutlich mehr zu zahlen bereit sind. Die
übrigen Positionen (03–09) blieben unverändert, da sie im Marktvergleich schon
fair lagen. Beide neuen Werte bleiben bewusst moderat, um für die Zielgruppe
(kleine Betriebe wie Gastronomie/Ferienwohnungen in der Region) zugänglich zu
bleiben — kein Sprung auf Agentur-Niveau.

### Neue Positionen 2026-09-22 (10–14)

Ergänzt, weil sie für die auf hwa-hoehn.de genannte Zielgruppe ("Websites und
Automatisierung für Gastronomen") und lokale Kleinbetriebe (siehe
fiedelmayers.de) besonders relevant sind, in der ursprünglichen Preisliste
aber fehlten:

- **10 Digitale Speisekarte mit Kategorien** (60 €) — Gastronomie-spezifisch,
  inkl. QR-Code für Tischaufsteller.
- **11 Google Business Profil einrichten** (40 €) — günstiger Hebel für
  lokale Auffindbarkeit, für praktisch jeden Kleinbetrieb relevant.
- **12 Google-Bewertungen-Widget einbinden** (40 €) — Vertrauen für neue
  Kunden, ergänzt Position 11.
- **13 DSGVO-Grundausstattung** (50 €) — Cookie-Banner & Muster-Texte,
  in Deutschland für praktisch jede gewerbliche Website relevant.
- **14 Laufendes Wartungspaket** (15 €/Monat) — erste wiederkehrende
  Einnahmequelle statt nur einmaliger Projektpreise; läuft wie
  Individualsoftware außerhalb der Einmalsumme.

Die AI-gestützte Referenz-Website-Analyse (Backend + Anthropic API) wurde
wieder entfernt, da sie einen laufenden API-Key/Guthaben vorausgesetzt hätte.
Die App ist jetzt reines Frontend ohne externe Abhängigkeiten.
