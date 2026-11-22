# Wer würde eher?

Lokales Multiplayer-Spiel mit einer SvelteKit-Webseite und einem Socket.IO-Server.

## Voraussetzungen

- Node.js 20 oder neuer
- npm
- Alle Geräte benötigen Zugriff zum gleichen lokalen Netzwerk

## Installation

Im Projektordner ausführen:

```powershell
npm install
```

Das Projekt wird mit `package-lock.json` verwaltet. Deshalb sollte für die gemeinsame Entwicklung npm verwendet werden.

## Spiel starten

Ein Terminal im Projektordner öffnen und ausführen:

```powershell
npm start
```

Dieser Befehl startet beide benötigten Dienste:

- SvelteKit-Client auf `http://localhost:5173`
- Socket.IO-Server auf `http://localhost:3001`

Alternativ können Client und Server auch in zwei Terminals gestartet werden:

```powershell
npm run dev
```

```powershell
npm run server:dev
```

Für Geräte im gleichen WLAN wird die vom Vite-Terminal angezeigte Network-Adresse verwendet, zum Beispiel `http://192.168.1.42:5173`.

## Spiel über mehrere Geräte

1. Der Host startet `npm start`.
2. Der Host öffnet `/online` oder ruft die angezeigte LAN-Adresse auf.
3. Der Host erstellt einen Room und verteilt den sechsstelligen Room-Code.
4. Die anderen Geräte öffnen dieselbe LAN-Adresse und treten über „Beitreten“ bei.
5. Der Host wählt Runden und Kategorien und startet das Spiel.

Alle Geräte müssen den laufenden Webserver und Socket.IO-Server erreichen können. Bei einer getrennten WLAN-Funktion, VPN, Firewall oder Gast-WLAN-Funktion kann die Verbindung blockiert sein.

## Häufige Probleme

### `npm` wird nicht erkannt

- Node.js und npm neu installieren.
- Danach ein neues Terminal öffnen.
- Mit `node --version` und `npm --version` prüfen.

### Port 3001 oder 5173 ist bereits belegt

- Das ältere Programm beziehungsweise Terminal beenden.
- Danach `npm start` erneut ausführen.

Für einen anderen Socket-Port können temporär beide Variablen gesetzt werden:

```powershell
$env:SOCKET_PORT="3002"
$env:VITE_SOCKET_PORT="3002"
npm start
```

### Verbindung zum Server fehlgeschlagen

- Prüfen, ob `npm start` beide Prozesse startet.
- Prüfen, ob in der Konsole `Game Server läuft auf http://0.0.0.0:3001` erscheint.
- Die Seite über die LAN-IP aufrufen, nicht über `localhost`, wenn ein anderes Gerät verwendet wird.
- Die Windows-Firewall für Node.js für private Netzwerke erlauben.

### Socket-Verbindung funktioniert lokal, aber nicht im Netzwerk

Der Socket.IO-Server lauscht standardmäßig auf allen Netzwerkschnittstellen (`0.0.0.0`). Der Client nutzt automatisch den Hostnamen der geöffneten Seite.

Bei getrennten Frontend-/Backend-Adressen kann eine oder mehrere Origins gesetzt werden:

```powershell
$env:CLIENT_ORIGIN="http://192.168.1.42:5173"
npm run server:dev
```

Mehrere erlaubte Origins können komma-getrennt angegeben werden.

## Prüfen und Bauen

```powershell
npm run check
npm run server:check
npm run build
```

Mit `npm run dev:all` werden Client und Server gemeinsam gestartet. `npm start` ist dafür ein kürzerer Alias.
