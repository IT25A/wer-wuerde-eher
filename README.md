# Wer würde eher?

Dieses Software Projekt setzt das altbekannte Partyspiel _"Wer würde eher"_ als Website um.
Es gibt 3 Spielmodi:

- Hotseat: Mehrere Leute spielen an einem Gerät
- Online: Spieler können einem Raum per Code beitreten und parallel für einander stimmen
- Nur Fragen: Es werden einem nur Fragen angezeit, eine alternative zum Hotseat, sollte man lieber analog Abstimmen wollen

Darüber hinaus gibt es ein einfaches _Content Management System_, welches einem erlaubt, die Datenbank einfach zu aktualisieren. Dieses erreicht man unter /cms

# Technologien und Voraussetzungen

## Tech Stack

- Framework: SvelteKit
- Datenbank: SQLite

## Benötigte Software:

- [NodeJS](https://nodejs.org/en/download) + node package manager (npm)
- [C++ Build Tools](https://learn.microsoft.com/de-de/cpp/build/vscpp-step-0-installation?view=msvc-170) (für betterSqlite 3)

# Quickstart

Nachdem die benötigte Software installiert wurde, kann das Projekt folgendermaßen gestartet werden:

```sh
# Zum installieren der Pakete:
npm install

#Zum starten des Entwicklungsservers:
npm run dev
```
