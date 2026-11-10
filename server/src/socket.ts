import type { Server, Socket } from 'socket.io';

import type {
    ClientToServerEvents,
    ServerToClientEvents
} from '../../shared/socket-events';
import type { ChatMessage } from '../../shared/room-types';
import {
    createRoom,
    getRoom,
    addPlayerToRoom,
    removePlayerFromRoom,
    setPlayerConnectionStatus
} from './room-store';

// Unser Socket.IO-Server kennt jetzt unsere Event-Typen.
type GameServer = Server<
    ClientToServerEvents,
    ServerToClientEvents
>;

interface SocketData {
    roomCode?: string;
    playerName?: string;
}

type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents> & {
    data: SocketData;
};

export function registerSocketHandlers(io: GameServer): void {

    io.on('connection', (socket) => {

        const typedSocket = socket as TypedSocket;

        console.log(`Spieler verbunden: ${socket.id}`);

        socket.emit('server:welcome', {
            message: 'Verbindung zum Game Server erfolgreich!'
        });

        // Room erstellen
        socket.on('room:create', (data) => {
            console.log(`Room erstellen angefordert von: ${socket.id}, Name: ${data.playerName}`);

            const room = createRoom(socket.id, data.playerName);

            if (!room) {
                socket.emit('room:error', {
                    message: 'Ungültiger Spielername'
                });
                return;
            }

            typedSocket.data.roomCode = room.code;
            typedSocket.data.playerName = data.playerName;

            socket.join(room.code);

            socket.emit('room:created', { room });
        });

        // Room beitreten
        socket.on('room:join', (data) => {
            console.log(`Room beitreten angefordert: ${data.roomCode} von ${socket.id}, Name: ${data.playerName}`);

            const room = addPlayerToRoom(data.roomCode, socket.id, data.playerName);

            if (!room) {
                const existingRoom = getRoom(data.roomCode);
                if (!existingRoom) {
                    socket.emit('room:error', {
                        message: 'Room nicht gefunden oder ungültiger Code'
                    });
                } else {
                    socket.emit('room:error', {
                        message: 'Room ist voll oder ungültiger Spielername'
                    });
                }
                return;
            }

            typedSocket.data.roomCode = room.code;
            typedSocket.data.playerName = data.playerName;

            socket.join(room.code);

            // Bestätigung an den beitretenden Spieler senden
            socket.emit('room:joined', { room });

            const newPlayer = room.players.find((p) => p.id === socket.id);
            if (newPlayer) {
                socket.to(room.code).emit('room:player-joined', { player: newPlayer });
            }
        });

        // Room verlassen
        socket.on('room:leave', () => {
            const roomCode = typedSocket.data.roomCode;

            if (!roomCode) {
                console.log(`Spieler ${socket.id} will Room verlassen, ist aber in keinem Room`);
                return;
            }

            console.log(`Spieler ${socket.id} verlässt Room ${roomCode}`);

            const room = removePlayerFromRoom(roomCode, socket.id);

            if (room) {
                socket.leave(roomCode);
                socket.to(roomCode).emit('room:player-left', { playerId: socket.id });
            }

            typedSocket.data.roomCode = undefined;
        });

        // Chat Nachricht senden
        socket.on('chat:send', (data) => {
            const roomCode = typedSocket.data.roomCode;
            const playerName = typedSocket.data.playerName;

            if (!roomCode) {
                console.log(`Spieler ${socket.id} versucht zu chatten, ist aber in keinem Room`);
                return;
            }

            if (!playerName) {
                console.log(`Spieler ${socket.id} hat keinen Namen`);
                return;
            }

            const message = data.message.trim();
            if (!message) {
                console.log(`Spieler ${socket.id} hat leere Nachricht gesendet`);
                return;
            }

            if (message.length > 500) {
                console.log(`Spieler ${socket.id} hat zu lange Nachricht gesendet`);
                return;
            }

            const room = getRoom(roomCode);
            if (!room) {
                console.log(`Room ${roomCode} existiert nicht mehr`);
                return;
            }

            // Chat-Nachricht erstellen
            const chatMessage: ChatMessage = {
                id: crypto.randomUUID(),
                playerId: socket.id,
                playerName,
                message,
                timestamp: Date.now()
            };

            console.log(`Chat-Nachricht von ${playerName} in Room ${roomCode}: ${message}`);

            io.to(roomCode).emit('chat:message', { message: chatMessage });
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

            const roomCode = typedSocket.data.roomCode;
            if (roomCode) {
                const room = removePlayerFromRoom(roomCode, socket.id);
                if (room) {
                    io.to(roomCode).emit('room:player-left', { playerId: socket.id });
                }
            }

        });

    });

}