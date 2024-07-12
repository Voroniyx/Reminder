# Reminder
Das ist eine wirklich simple Discord App. 

Sie wird auf einem [Discord Account installiert](Dhttps://discord.com/developers/docs/tutorials/developing-a-user-installable-app#choosing-supported-installation-contexts) und alle Befehle sind unsichtbar für andere Benutzer.
Die Befehle werden auf Server, in Privat-Nachrichten und in der Bot-DM unterstützt.

Erinnerungen können im Minuten / Stunden und Tage takt erstellt werden und können sich wiederholen (wenn angegeben).

Als Datenbank wird MongoDb benutzt.

## Warning

Die App mag gegebenfalls vom Discords AntiSpam System in Quarantäne gesetzt werden, wenn sie zu vielen verschieden Usern eine Direkt Nachricht sendet. Ich empfehle deshalb sie nur für Private zwecke zu nutzen und im Developer Portal als Privat zu markieren.
Sofern sie die mindestens eine Direkt Nachricht gesendet hat, kann sie dir auch weiterhin DMs senden nur keinen neuen Personen mehr.

## Setup

1. `.env` erstellen.
```
DISCORD_TOKEN="token-der-discord-app"
APP_ID="id-der-discord-app"
DISCORD_CLIENT_KEY="publik-key-der-discord-app"
MONGO_TOKEN="connectionstring-zur-datenbank"
PORT=3000
```
2. Packages Installieren

Um die Packages zu installieren, muss [node.js](https://nodejs.org/en) installiert sein.
Dann führe `npm install` aus. Alle package sollten nun installier sein.

3. Public Endpoint

Nun brauchen wir noch eine Public Endpoint.
Dafür finde ich den Guide von [Discord](https://discord.com/developers/docs/tutorials/developing-a-user-installable-app#set-up-a-public-endpoint)  ziemlich gut
Arbeite dich dort durch die Punkte "Set up a public endpoint" und "Configuring an interaction endpoint URL". Und dann sollten auch dieser Punkt abgeschlossen sein.

4. Befehl registrieren

Nun müssen wir noch die Befehle mit noch zu Discord Registrieren.
Dazu baue das Projekt mit `npm run build` und registriere die Befehle mit `npm run deploy`.

5. Starten

Wenn nun alle env Variablen gesetzt sind, alle Paket installiert sind, der Public Endpoint erreichbar ist und die Befehle registriert wurden, 
kannst du die App mit  `npm run start` starten. 

Wenn du die App installiert hast, sollten die Befehle nun auftauchen, wenn du `/` eingibst.
Wähle eine dieser Befehle aus und wenn du eine Antwort vom Bot bekommst, hast du alles richtig gemacht.


### Sonstiges
Ich habe das Projekt an einem Abend zusammen gebaut. Weshalb es vielleicht auch danach aussieht im Code. 
Vielleicht werde ich das Projekt beizeiten nochmal aufräumen :)
