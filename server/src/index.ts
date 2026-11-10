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
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST']
    }
});

// Socket-Events registrieren
registerSocketHandlers(io);

// Server starten
const PORT = 3001;

httpServer.listen(PORT, () => {
    console.log(`Game Server läuft auf Port ${PORT}`);
});
