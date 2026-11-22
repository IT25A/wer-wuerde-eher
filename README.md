# Wer würde eher?

Ein Partyspiel für den Browser: Zu jeder Frage („Wer würde eher im Urlaub den Zug verpassen?“) stimmen alle Mitspielenden ab, wer aus der Runde am ehesten gemeint ist. Wer die meisten Stimmen bekommt, „gewinnt“ die Runde. Am Ende zeigt eine Rangliste, wer am häufigsten gewählt wurde.

Das Projekt ist im Modul Software Engineering (HWR Berlin, Semester 3) entstanden.

**Live-Version:** https://werwuerde.apps.it25a.de

> Die App läuft auf der IT25A-Plattform. Solange sie auf „nur Kursmitglieder“ steht, meldet man sich beim ersten Aufruf mit dem Uni-Konto an.

---

## Inhalt

1. [Die Spielmodi](#die-spielmodi)
2. [So wird gespielt](#so-wird-gespielt)
3. [App auf dem eigenen Computer starten](#app-auf-dem-eigenen-computer-starten)
4. [App mit Docker starten](#app-mit-docker-starten)
5. [Deployment (Veröffentlichung)](#deployment-veröffentlichung)
6. [Aufbau des Projekts](#aufbau-des-projekts)
7. [Häufige Probleme](#häufige-probleme)

---

## Die Spielmodi

Auf der Startseite gibt es drei Modi:

| Modus          | Für wen                                   | Kurz erklärt                                                                                                       |
| -------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Online**     | Jeder spielt am eigenen Handy oder Laptop | Eine Person erstellt einen Room und teilt einen sechsstelligen Code, die anderen treten damit bei. Inklusive Chat. |
| **Hot Seat**   | Alle sitzen zusammen an **einem** Gerät   | Das Gerät wird reihum weitergegeben, jeder stimmt geheim ab.                                                       |
| **Nur Fragen** | Ohne Punkte, einfach zum Diskutieren      | Zeigt zufällige Fragen aus den gewählten Kategorien an.                                                            |

Alle drei Modi nutzen dieselben Fragen und Kategorien aus der Datenbank. Über den Link **Fragen verwalten** auf der Startseite (Adresse `/cms`) kann man Fragen und Kategorien anlegen, bearbeiten und löschen. Jede Seite hat einen Link **Zurück zum Hauptmenü**.

---

## So wird gespielt

### Online-Modus

**Als Host (die Person, die den Room erstellt):**

1. Auf der Startseite **Online** wählen.
2. Unter **Room erstellen** den eigenen Namen eingeben und auf **Room erstellen** klicken.
3. Oben erscheint der **Room-Code** (z. B. `8XTS6V`). Diesen Code an die Mitspielenden schicken (Knopf **Code kopieren**).
4. Kategorien ankreuzen und die Anzahl der Runden wählen.
5. Sobald mindestens zwei Personen im Room sind: **Spiel starten**.
6. Während des Spiels kann der Host
   - die Abstimmung vorzeitig beenden (**Abstimmung jetzt beenden**),
   - zur nächsten Runde wechseln (**Nächste Runde**),
   - Mitspielende über das **✕** in der Spielerliste aus dem Room entfernen.

**Als Mitspieler:in:**

1. Auf der Startseite **Online** wählen.
2. Auf **Beitreten** klicken, den Room-Code und den eigenen Namen eingeben, **Room beitreten**.
3. Warten, bis der Host das Spiel startet.
4. Bei jeder Frage auf die Person klicken, die am ehesten passt. Für sich selbst kann man nicht stimmen.

**Für alle:**

- Rechts (auf dem Handy unten) stehen die **Spielerliste** und der **Chat**.
- Mit **Room verlassen** oben rechts kann man jederzeit gehen, auch mitten im Spiel. Verlässt der Host den Room, wird automatisch die nächste Person Host.
- In einen Room, in dem das Spiel schon läuft, kann niemand mehr beitreten.

### Hot Seat

1. Auf der Startseite **Hot Seat** wählen.
2. Alle Namen nacheinander eintragen (**Hinzufügen**), mindestens zwei.
3. Kategorien und Rundenzahl wählen, **Spiel starten**.
4. Die App sagt jeweils an, wem das Gerät gegeben werden soll. Diese Person tippt auf **Weiter** und stimmt ab.
5. Nach jeder Runde gibt es das Ergebnis, am Ende die Rangliste. Danach kann man mit denselben Personen nochmal spielen oder ein neues Spiel beginnen.

---

## App auf dem eigenen Computer starten

So lässt sich die App ohne Vorkenntnisse lokal starten. Die Befehle funktionieren unter Windows, macOS und Linux gleich.

### 1. Voraussetzung: Node.js installieren

- **Node.js 24 oder neuer** von https://nodejs.org herunterladen und installieren (die „LTS“-Version ist richtig).
- Prüfen, ob es geklappt hat: ein **Terminal** öffnen (Windows: „PowerShell“, macOS: „Terminal“) und eingeben:

  ```bash
  node --version
  ```

  Es sollte etwas wie `v24.x.x` oder höher erscheinen.

### 2. Projekt herunterladen

Entweder auf GitHub über **Code → Download ZIP** herunterladen und entpacken, oder mit Git:

```bash
git clone https://github.com/IT25A/wer-wuerde-eher.git
```

### 3. In den Projektordner wechseln

```bash
cd wer-wuerde-eher
```

(Wer die ZIP-Datei genutzt hat: in den entpackten Ordner wechseln, z. B. `cd Downloads/wer-wuerde-eher-main`.)

### 4. Abhängigkeiten installieren (einmalig)

```bash
npm install
```

Das lädt alle benötigten Bibliotheken herunter und dauert beim ersten Mal ein bis zwei Minuten.

### 5. App bauen und starten

```bash
npm run build
npm start
```

Wenn im Terminal `Server läuft auf http://0.0.0.0:3000` steht, im Browser öffnen:

**http://localhost:3000**

Beenden mit `Strg + C` im Terminal.

> **Mit mehreren Geräten im selben WLAN spielen:** Auf den anderen Geräten statt `localhost` die IP-Adresse des Computers eingeben, z. B. `http://192.168.1.42:3000`. Die IP-Adresse findet man unter Windows mit `ipconfig`, unter macOS in den Systemeinstellungen → WLAN → Details.

### Entwicklungsmodus (für Änderungen am Code)

```bash
npm run dev
```

Startet die App unter **http://localhost:5173** und lädt Änderungen am Code sofort neu.

---

## App mit Docker starten

Mit Docker läuft die App genau so wie später auf dem Server, ohne dass Node.js installiert sein muss.

1. **Docker Desktop** installieren und starten: https://www.docker.com/products/docker-desktop/
2. Im Terminal in den Projektordner wechseln (siehe oben, Schritt 3).
3. Image bauen (einmalig bzw. nach Code-Änderungen, dauert ein paar Minuten):

   ```bash
   docker build -t werwuerde .
   ```

4. App starten:

   ```bash
   docker run --rm -p 3000:3000 -v werwuerde-daten:/data werwuerde
   ```

5. Im Browser **http://localhost:3000** öffnen. Beenden mit `Strg + C`.

`-v werwuerde-daten:/data` legt einen Docker-Speicher („Volume“) für die Datenbank an. Fragen, die über `/cms` geändert werden, bleiben dadurch auch nach einem Neustart erhalten. Ohne diese Angabe startet die App jedes Mal mit den mitgelieferten Fragen.

---

## Deployment (Veröffentlichung)

Die App wird über die **IT25A App Deploy**-Plattform der Hochschule veröffentlicht:

**https://werwuerde.apps.it25a.de**

So funktioniert es:

```
Änderung auf main  ──►  GitHub baut ein Docker-Image  ──►  die Plattform startet es  ──►  werwuerde.apps.it25a.de
```

- Jede Änderung auf dem Branch `main` wird automatisch veröffentlicht.
- Jeder Pull Request bekommt eine eigene Testversion unter `https://werwuerde-pr<Nummer>.apps.it25a.de`, die beim Schließen des Pull Requests wieder verschwindet.
- Schlägt ein Update fehl, läuft die vorherige Version einfach weiter.

Beteiligte Dateien:

| Datei                          | Zweck                                                                                                |
| ------------------------------ | ---------------------------------------------------------------------------------------------------- |
| `Dockerfile`                   | Bauanleitung für das Docker-Image (baut die App und startet sie auf Port 3000)                       |
| `.dockerignore`                | Dateien, die nicht ins Image gehören                                                                 |
| `app.it25a.yml`                | Einstellungen für die Plattform: Port, Adresse, Datenbank-Speicher (`/data`)                         |
| `.github/workflows/deploy.yml` | GitHub-Workflow, der bei jedem Push baut und veröffentlicht (Vorlage der Plattform, nicht verändern) |

Die Datenbank liegt auf dem Server in einem dauerhaften Speicher. Beim allerersten Start wird `data/Fragen.db` aus dem Repository als Startbestand übernommen. Spätere Änderungen an dieser Datei im Repository wirken sich daher **nicht** auf die Live-Version aus, dort werden die Fragen über `/cms` gepflegt.

Ausführliche Anleitung der Plattform: https://github.com/IT25A/deploy-workflows/blob/main/docs/getting-started.md

---

## Aufbau des Projekts

**Technik:** SvelteKit (Svelte 5, TypeScript) für die Webseite, Socket.IO für die Echtzeit-Verbindung im Online-Modus, SQLite als Datenbank für Fragen und Kategorien. Webseite und Game-Server laufen zusammen in **einem** Node.js-Prozess auf **einem** Port.

| Ordner / Datei            | Inhalt                                                                                                                                               |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/routes/`             | Die Seiten: Startseite, `online`, `hotseat`, `nurFragen`, `cms` sowie die API unter `api/`                                                           |
| `src/lib/components/`     | Bausteine der Oberfläche (`Online*.svelte` für den Online-Modus, übrige für den Hot Seat)                                                            |
| `src/lib/socket-store.ts` | Verbindung des Browsers zum Game-Server                                                                                                              |
| `src/lib/server/`         | Datenbankzugriff (`database.ts`) und Fragenauswahl (`questions.ts`)                                                                                  |
| `server/src/`             | Game-Server für den Online-Modus: Rooms, Spielablauf, Chat, Kick (`socket.ts`, `room-store.ts`, `game-store.ts`) sowie der Start der App (`prod.ts`) |
| `shared/`                 | Typen und Farben, die Webseite und Server gemeinsam nutzen                                                                                           |
| `data/Fragen.db`          | Die SQLite-Datenbank mit Fragen und Kategorien                                                                                                       |

### Einstellungen (Umgebungsvariablen)

Für den normalen Start muss nichts eingestellt werden.

| Variable             | Bedeutung                                                                  | Standard                                             |
| -------------------- | -------------------------------------------------------------------------- | ---------------------------------------------------- |
| `PORT`               | Port der App                                                               | `3000`                                               |
| `HOST`               | Netzwerk-Adresse                                                           | `0.0.0.0` (alle)                                     |
| `DATABASE_PATH`      | Pfad der Datenbank-Datei                                                   | `data/Fragen.db` (im Docker-Image `/data/Fragen.db`) |
| `DATABASE_SEED_PATH` | Startbestand, der kopiert wird, falls `DATABASE_PATH` noch nicht existiert | im Docker-Image gesetzt                              |

### Prüfbefehle für Entwickler:innen

```bash
npm run check         # Typprüfung der Webseite
npm run server:check  # Typprüfung des Game-Servers
npm run build         # Produktions-Build
```

---

## Häufige Probleme

**`npm` oder `node` wird nicht erkannt**
Node.js ist nicht installiert oder das Terminal wurde vor der Installation geöffnet. Node.js installieren und ein **neues** Terminal öffnen.

**`Port 3000 is already in use` / Adresse wird bereits verwendet**
Eine andere Anwendung nutzt Port 3000. Das andere Programm beenden oder einen anderen Port wählen:
macOS/Linux: `PORT=3001 npm start`, Windows PowerShell: `$env:PORT=3001; npm start`. Danach http://localhost:3001 öffnen.

**Andere Geräte im WLAN können nicht beitreten**
Alle Geräte müssen im selben WLAN sein (kein Gast-WLAN) und die IP-Adresse des Computers verwenden, nicht `localhost`. Unter Windows ggf. in der Firewall Node.js für private Netzwerke erlauben.

**„Nicht mit Server verbunden“ im Online-Modus**
Seite neu laden. Bleibt die Meldung, läuft der Server nicht. Im Terminal prüfen, ob `npm start` noch läuft.

**`docker` wird nicht erkannt oder „Cannot connect to the Docker daemon“**
Docker Desktop ist nicht installiert oder nicht gestartet. Docker Desktop öffnen und warten, bis es läuft.
