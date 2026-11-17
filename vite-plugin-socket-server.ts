import type { Plugin } from 'vite';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { registerSocketHandlers } from './server/src/socket';

let io: Server | null = null;

export function socketServerPlugin(): Plugin {
    return {
        name: 'socket-server',
        configureServer(server) {
            // Socket.IO-Server erstellen
            const httpServer = createServer();

            io = new Server(httpServer, {
                cors: {
                    origin: '*', // Erlaubt alle Origins für Entwicklung
                    methods: ['GET', 'POST']
                }
            });

            // Socket-Events registrieren
            registerSocketHandlers(io);

            // Socket.IO-Server auf Port 3001 starten
            const PORT = 3001;
            httpServer.listen(PORT, () => {
                console.log(`\n🎮 Game Server läuft auf Port ${PORT}`);
                console.log(`📱 Zugriff über Handy: http://<deine-IP>:5173\n`);
            });

            // Cleanup beim Beenden
            server.httpServer?.on('close', () => {
                if (io) {
                    io.close();
                    console.log('Game Server gestoppt');
                }
            });
        }
    };
}
