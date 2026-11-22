# Wer würde eher?

Multiplayer-Spiel mit einer SvelteKit-Webseite und einem Socket.IO-Game-Server. Beide laufen in **einem** Node-Prozess auf **einem** Port.

Live: https://werwuerde.apps.it25a.de (IT25A App Deploy)

## Voraussetzungen

- Node.js 26 (der Game-Server wird von Node direkt als TypeScript ausgeführt)
- npm

## Installation

Im Projektordner ausführen:

```powershell
npm install
```

Das Projekt wird mit `package-lock.json` verwaltet. Deshalb sollte für die gemeinsame Entwicklung npm verwendet werden.

## Entwickeln

```powershell
npm run dev
```

Startet Webseite und Game-Server zusammen auf `http://localhost:5173`. Für Geräte im gleichen WLAN wird die vom Vite-Terminal angezeigte Network-Adresse verwendet, zum Beispiel `http://192.168.1.42:5173`.

## Produktionsversion lokal starten

```powershell
npm run build
npm start
```

Die App läuft dann auf `http://localhost:3000`. Port und Host können mit `PORT` und `HOST` geändert werden.

## Spiel über mehrere Geräte

1. Der Host öffnet `/online`.
2. Der Host erstellt einen Room und verteilt den sechsstelligen Room-Code.
3. Die anderen Geräte öffnen dieselbe Adresse und treten über „Beitreten“ bei.
4. Der Host wählt Runden und Kategorien und startet das Spiel.

## Datenbank

Die Fragen liegen in der SQLite-Datei `data/Fragen.db`.

| Variable | Bedeutung | Standard |
|---|---|---|
| `DATABASE_PATH` | Pfad der Datenbank-Datei | `data/Fragen.db` |
| `DATABASE_SEED_PATH` | Wenn `DATABASE_PATH` noch nicht existiert, wird diese Datei als Startbestand kopiert | – |

## Deployment (IT25A App Deploy)

Jeder Push auf `main` wird automatisch unter `https://werwuerde.apps.it25a.de` veröffentlicht, jeder Pull Request bekommt eine Preview unter `https://werwuerde-pr<nummer>.apps.it25a.de`.

| Datei | Zweck |
|---|---|
| `Dockerfile` | Baut die App und startet `node server/src/prod.ts` auf Port 3000 |
| `.dockerignore` | Hält unnötige Dateien aus dem Image (nur `data/Fragen.db` kommt als Startbestand mit) |
| `app.it25a.yml` | Port, Adresse, `ORIGIN`, Datenbank-Pfad und das Volume `app-data` unter `/data` |
| `.github/workflows/deploy.yml` | Workflow von `IT25A/deploy-workflows`, nicht verändern |

Auf dem Server liegt die Datenbank im Volume (`/data/Fragen.db`) und übersteht Updates. Beim allerersten Start (und in jeder Preview) wird `data/Fragen.db` aus dem Repository als Startbestand kopiert. Spätere Änderungen an `data/Fragen.db` im Repository wirken sich deshalb **nicht** auf die Live-Datenbank aus; dort werden Fragen über `/cms` gepflegt.

Anleitung: https://github.com/IT25A/deploy-workflows/blob/main/docs/getting-started.md

## Prüfen und Bauen

```powershell
npm run check
npm run server:check
npm run build
```
