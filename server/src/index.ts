// index.ts startet unseren Server und verwaltet dessen Lebenszyklus.


import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { registerSocketHandlers } from './socket';
import type {
    ClientToServerEvents,
    ServerToClientEvents
} from '../../shared/socket-events';

// HTTP-Server erstellen
const httpServer = createServer();

// Socket.IO-Server erstellen
const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
    cors: {
        origin: process.env.CLIENT_ORIGIN
            ? process.env.CLIENT_ORIGIN.split(',').map((origin) => origin.trim())
            : true,
        methods: ['GET', 'POST']
    }
});

// Socket-Events registrieren
registerSocketHandlers(io);

// Server starten
const PORT = Number(process.env.SOCKET_PORT ?? 3001);
const HOST = process.env.SOCKET_HOST ?? '0.0.0.0';

httpServer.listen(PORT, HOST, () => {
    console.log(`Game Server läuft auf http://${HOST}:${PORT}`);
});
