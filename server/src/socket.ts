import type { Server } from 'socket.io';

import type {
    ClientToServerEvents,
    ServerToClientEvents
} from '../../shared/socket-events';

// Unser Socket.IO-Server kennt jetzt unsere Event-Typen.
type GameServer = Server<
    ClientToServerEvents,
    ServerToClientEvents
>;

export function registerSocketHandlers(io: GameServer): void {

    io.on('connection', (socket) => {

        console.log(`Spieler verbunden: ${socket.id}`);

        socket.emit('server:welcome', {
            message: 'Verbindung zum Game Server erfolgreich!'
        });

        socket.on('client:ping', () => {

            console.log(`Ping empfangen von: ${socket.id}`);

            socket.emit('server:pong', {
                message: 'Pong vom Game Server!'
            });

        });

        socket.on('disconnect', (reason) => {

            console.log(`Spieler getrennt: ${socket.id}`);
            console.log(`Grund: ${reason}`);

        });

    });

}