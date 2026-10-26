# Wer würde eher?

Digitale Umsetzung des klassischen Partyspiels **„Wer würde eher?“**, entwickelt von **Gruppe G** im Modul **Software Engineering** an der **HWR Berlin**.

Das Spiel läuft als Web-App im Browser und ist für lokale Mehrspieler-Runden (Hot Seat) sowie zum einfachen Durchblättern von Fragen konzipiert. Ein Online-Mehrspielermodus ist für spätere Versionen geplant.

---

## Spielidee

„Wer würde eher?“ ist ein Partyspiel, bei dem eine Frage gestellt wird und die Mitspieler sich gegenseitig oder selbst zuordnen. Beispiel:

> „Wer würde eher einen Monat ohne Handy überleben?“

Alle Spieler zeigen auf die Person, die am besten passt. Das Spiel wertet die Antworten aus, vergibt Punkte und zeigt am Ende eine Rangliste an.

Die App bietet vorgefertigte Fragen, erlaubt aber auch das Hinzufügen eigener Fragen für persönlichere Runden.

---

## Tech-Stack

| Bereich      | Technik                                 |
| ------------ | --------------------------------------- |
| Framework    | SvelteKit 5 mit Svelte-Runes            |
| Sprache      | TypeScript                              |
| Styling      | Tailwind CSS 4 + Komponenten-scoped CSS |
| Icons/Bilder | Eigene Assets im `static/`-Ordner       |
| Build-Tool   | Vite                                    |
| Linting      | ESLint + Prettier                       |

---

## Design-Entscheidungen

Das visuelle Konzept orientiert sich an einem **Casino-/Roulette-Tisch**. Dies passt zum vorhandenen Logo und verleiht der App eine einladende, erwachsene Spielatmosphäre, ohne kindisch zu wirken.

### Farbschema

Die Farben lehnen sich an einen klassischen Roulette-Tisch an:

- **Bordeaux/Dunkelrot** (`#5c0a1e`) für den Haupt-Call-to-Action
- **Filz-Grün** (`#0f3d2e`) für das Spielfeld-Panel
- **Gold** (`#c9a227`) für Rahmen, Schrift-Highlights und Glow-Effekte
- **Dunkles Schwarz/Anthrazit** als Hintergrund

### Warum dieser Look?

- **Nicht KI-generisch:** Echte, eigene Assets (Logo, Moderator mit verschiedenen Mimiken) statt Stock-Illustrationen.
- **Einladend und spieltypisch:** Das Casino-Thema transportiert das Gefühl eines Show-Moderators, der die Runden moderiert.
- **Funktional:** Große, gut klickbare Buttons, klare Hierarchie und ein responsives Layout für Smartphones, Tablets und Desktop.
- **Wiederverwendbarer Moderator:** Der Moderator (`/politician/...`) kann je nach Spielphase unterschiedliche Mimiken annehmen (normal, happy, challenging, thinking, celebrating, no_clue).

### Hintergrund

Der Hintergrund ist bewusst subtil gehalten, damit er nicht vom Inhalt ablenkt, aber trotzdem nicht trist wirkt:

- Weiches, zentrales Filz-Grün-Spotlight
- Dezente Gold- und Bordeaux-Ambientlichter an den Seiten
- Feine, zweilagige Filz-Textur aus winzigen goldenen Punkten
- Leichte Vignette an den Rändern für Tiefe

---

## Projektstruktur

```
.
├── src/
│   ├── app.html                  # HTML-Template, Sprache: de
│   ├── routes/
│   │   ├── +page.svelte          # Landing Page
│   │   ├── +layout.svelte        # Globales Layout
│   │   ├── layout.css            # Tailwind-Import
│   │   ├── hot-seat/+page.svelte # Platzhalter: Hot-Seat-Modus
│   │   ├── questions/+page.svelte# Platzhalter: Nur-Fragen-Modus
│   │   └── custom-questions/     # Platzhalter: eigene Fragen
│   └── lib/
│       └── assets/favicon.svg
├── static/
│   └── politician/               # Logo und Moderator-Mimiken
├── package.json
├── vite.config.ts
├── tsconfig.json
├── eslint.config.js
├── prettier.config.js
└── README.md
```

---

## Installation & Start

### Voraussetzungen

- [Node.js](https://nodejs.org/) (mind. Version 20 empfohlen)
- npm (im Projekt verwendet)

### Abhängigkeiten installieren

```bash
npm install
```

### Entwicklungs-Server starten

```bash
npm run dev
```

Die App ist dann unter `http://localhost:5173` erreichbar.

### Produktions-Build

```bash
npm run build
```

Das Ergebnis liegt im `.svelte-kit/output/`-Ordner bzw. wird vom Adapter an die Zielumgebung angepasst.

### Produktions-Build lokal testen

```bash
npm run build
npm run preview
```

### Code-Qualität prüfen

```bash
npm run lint      # Prettier + ESLint
npm run check     # TypeScript- und Svelte-Diagnosen
npm run format    # Prettier über alle Dateien laufen lassen
```

---

## Aktueller Stand

Diese Version beinhaltet die **Landing Page** mit den drei geplanten Einstiegspunkten:

- **Online** (ausgegraut, „Bald verfügbar“)
- **Hot Seat** (verlinkt auf `/hot-seat`)
- **Nur Fragen** (verlinkt auf `/questions`)
- **Eigene Fragen einreichen** (verlinkt auf `/custom-questions`)

Die verlinkten Unterseiten existieren bereits als Platzhalter und werden in den nächsten Entwicklungsschritten mit Inhalt befüllt.

---

## Hinweise zum Mitentwickeln

- Farbvariablen und Hintergrund-Ebenen sind in `src/routes/+page.svelte` gut kommentiert.
- Der Moderator auf der Landing Page lässt sich über die Konstante `MASKOT` anpassen (z. B. `normal`, `happy`, `challenging`).
- Die Routen sind in der Konstante `ROUTES` zentral gepflegt.
- Eigene Fragen und Fragesätze werden in den nächsten Meilensteinen hinzugefügt.
