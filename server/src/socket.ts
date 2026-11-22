import type { Server, Socket } from 'socket.io';

import type {
    ClientToServerEvents,
    ServerToClientEvents
} from '../../shared/socket-events.ts';
import type { ChatMessage } from '../../shared/room-types.ts';
import {
    createRoom,
    getRoom,
    addPlayerToRoom,
    removePlayerFromRoom
} from './room-store.ts';
import {
    initGame,
    getGameState,
    deleteGame,
    processVote,
    nextRound,
    abortVoting,
    removePlayerFromGame
} from './game-store.ts';
import { sanitizeCategoryIds } from '../../src/lib/server/questions.ts';

// Unser Socket.IO-Server kennt jetzt unsere Event-Typen.
type GameServer = Server<
    ClientToServerEvents,
    ServerToClientEvents
>;

interface SocketData {
    roomCode?: string;
    playerName?: string;
}

type TypedSocket = Socket<ClientToServerEvents, ServerToClientEvents> & {
    data: SocketData;
};

export function registerSocketHandlers(io: GameServer): void {

    // Entfernt einen Spieler aus Raum und Spiel und informiert die übrigen Spieler.
    // Gilt für Verlassen, Kick und Verbindungsabbruch, in der Lobby wie im laufenden Spiel.
    function exitRoom(roomCode: string, playerId: string): void {
        const room = removePlayerFromRoom(roomCode, playerId);
        if (!room) return;

        io.to(roomCode).emit('room:updated', { room });

        const gameState = removePlayerFromGame(roomCode, playerId);
        if (gameState) {
            io.to(roomCode).emit('game:state-updated', { state: gameState });
        }
    }

    io.on('connection', (socket) => {

        const typedSocket = socket as TypedSocket;

        console.log(`Spieler verbunden: ${socket.id}`);

        socket.emit('server:welcome', {
            message: 'Verbindung zum Game Server erfolgreich!'
        });

        // Raum erstellen
        socket.on('room:create', (data) => {
            console.log(`Raum erstellen angefordert von: ${socket.id}`);

            if (typedSocket.data.roomCode) {
                socket.emit('room:error', { message: 'Du bist bereits in einem Raum' });
                return;
            }

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

        // Raum beitreten
        socket.on('room:join', (data) => {
            // Raum-Codes bestehen nur aus Großbuchstaben und Ziffern
            const roomCode = String(data?.roomCode ?? '').trim().toUpperCase();
            console.log(`Raum beitreten angefordert: ${roomCode} von ${socket.id}`);

            if (typedSocket.data.roomCode) {
                socket.emit('room:error', { message: 'Du bist bereits in einem Raum' });
                return;
            }

            if (getRoom(roomCode)?.status === 'playing') {
                socket.emit('room:error', { message: 'In diesem Raum läuft bereits ein Spiel' });
                return;
            }

            const room = addPlayerToRoom(roomCode, socket.id, data.playerName);

            if (!room) {
                const existingRoom = getRoom(roomCode);
                if (!existingRoom) {
                    socket.emit('room:error', {
                        message: 'Raum nicht gefunden oder ungültiger Code'
                    });
                } else {
                    socket.emit('room:error', {
                        message: 'Raum ist voll oder ungültiger Spielername'
                    });
                }
                return;
            }

            typedSocket.data.roomCode = room.code;
            typedSocket.data.playerName = data.playerName;

            socket.join(room.code);

            // Bestätigung an den beitretenden Spieler senden
            socket.emit('room:joined', { room });
            socket.to(room.code).emit('room:updated', { room });
        });

        // Raum verlassen
        socket.on('room:leave', () => {
            const roomCode = typedSocket.data.roomCode;

            if (!roomCode) {
                console.log(`Spieler ${socket.id} will Raum verlassen, ist aber in keinem Raum`);
                return;
            }

            console.log(`Spieler ${socket.id} verlässt Room ${roomCode}`);

            socket.leave(roomCode);
            typedSocket.data.roomCode = undefined;
            exitRoom(roomCode, socket.id);
        });

        // Spieler entfernen (nur Host)
        socket.on('room:kick', (data) => {
            const roomCode = typedSocket.data.roomCode;
            const room = roomCode ? getRoom(roomCode) : undefined;

            if (!roomCode || !room) {
                socket.emit('room:error', { message: 'Du bist in keinem Raum' });
                return;
            }

            if (room.hostId !== socket.id) {
                socket.emit('room:error', { message: 'Nur der Host darf Spieler entfernen' });
                return;
            }

            const targetId = data?.playerId;
            if (
                typeof targetId !== 'string' ||
                targetId === socket.id ||
                !room.players.some((p) => p.id === targetId)
            ) {
                socket.emit('room:error', { message: 'Spieler nicht gefunden' });
                return;
            }

            console.log(`Spieler ${targetId} wurde aus Room ${roomCode} entfernt`);

            const target = io.sockets.sockets.get(targetId) as TypedSocket | undefined;
            if (target) {
                target.leave(roomCode);
                target.data.roomCode = undefined;
                target.emit('room:kicked');
            }

            exitRoom(roomCode, targetId);
        });

        // Nach dem Endergebnis zurück in die Lobby (nur Host): Spieler und Chat bleiben, neues Spiel möglich
        socket.on('room:back-to-lobby', () => {
            const roomCode = typedSocket.data.roomCode;
            const room = roomCode ? getRoom(roomCode) : undefined;

            if (!roomCode || !room) {
                socket.emit('room:error', { message: 'Du bist in keinem Raum' });
                return;
            }

            if (room.hostId !== socket.id) {
                socket.emit('room:error', { message: 'Nur der Host kann ein neues Spiel vorbereiten' });
                return;
            }

            const gameState = getGameState(roomCode);
            if (gameState && gameState.phase !== 'final') {
                socket.emit('room:error', { message: 'Das Spiel läuft noch' });
                return;
            }

            deleteGame(roomCode);
            room.status = 'waiting';
            io.to(roomCode).emit('room:updated', { room });
        });

        // Chat Nachricht senden
        socket.on('chat:send', (data) => {
            const roomCode = typedSocket.data.roomCode;
            const playerName = typedSocket.data.playerName;

            if (!roomCode) {
                console.log(`Spieler ${socket.id} versucht zu chatten, ist aber in keinem Raum`);
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

            io.to(roomCode).emit('chat:message', { message: chatMessage });
        });

        socket.on('game:start', (data) => {
            const roomCode = typedSocket.data.roomCode;
            if (!roomCode) {
                socket.emit('game:error', { message: 'Du bist in keinem Raum' });
                return;
            }
            const room = getRoom(roomCode);
            if (!room) {
                socket.emit('game:error', { message: 'Raum existiert nicht' });
                return;
            }
            if (room.hostId !== socket.id) {
                socket.emit('game:error', { message: 'Nur der Host darf das Spiel starten' });
                return;
            }
            if (room.players.length < 2) {
                socket.emit('game:error', { message: 'Mindestens 2 Spieler benötigt' });
                return;
            }
            const categoryIds = sanitizeCategoryIds(data?.categoryIds);
            const totalRounds = Number(data?.totalRounds);
            if (categoryIds.length === 0 || !Number.isInteger(totalRounds) || totalRounds < 1 || totalRounds > 100) {
                socket.emit('game:error', { message: 'Bitte wählt Kategorien und eine gültige Rundenzahl aus.' });
                return;
            }
            const playerIds = room.players.map((p) => p.id);
            const playerNames = room.players.map((p) => p.name);
            const gameState = initGame(roomCode, playerIds, playerNames, totalRounds, categoryIds);
            if (!gameState) {
                socket.emit('game:error', { message: 'Für diese Kategorien wurden keine Fragen gefunden.' });
                return;
            }
            room.status = 'playing';
            io.to(roomCode).emit('game:started', { state: gameState });
        });

        socket.on('game:vote', (data) => {
            const roomCode = typedSocket.data.roomCode;
            if (!roomCode) {
                socket.emit('game:error', { message: 'Du bist in keinem Raum' });
                return;
            }
            const gameState = processVote(roomCode, socket.id, data.targetPlayerId);
            if (!gameState) {
                socket.emit('game:error', { message: 'Vote konnte nicht verarbeitet werden' });
                return;
            }
            io.to(roomCode).emit('game:state-updated', { state: gameState });
        });

        socket.on('game:next-round', () => {
            const roomCode = typedSocket.data.roomCode;
            if (!roomCode) {
                socket.emit('game:error', { message: 'Du bist in keinem Raum' });
                return;
            }
            const room = getRoom(roomCode);
            if (!room) {
                socket.emit('game:error', { message: 'Raum existiert nicht' });
                return;
            }
            if (room.hostId !== socket.id) {
                socket.emit('game:error', { message: 'Nur der Host darf die nächste Runde starten' });
                return;
            }
            const gameState = nextRound(roomCode);
            if (!gameState) {
                socket.emit('game:error', { message: 'Nächste Runde konnte nicht gestartet werden' });
                return;
            }
            io.to(roomCode).emit('game:state-updated', { state: gameState });
        });

        socket.on('game:abort-voting', () => {
            const roomCode = typedSocket.data.roomCode;
            if (!roomCode) {
                socket.emit('game:error', { message: 'Du bist in keinem Raum' });
                return;
            }
            const room = getRoom(roomCode);
            if (!room) {
                socket.emit('game:error', { message: 'Raum existiert nicht' });
                return;
            }
            if (room.hostId !== socket.id) {
                socket.emit('game:error', { message: 'Nur der Host darf die Abstimmung beenden' });
                return;
            }
            const gameState = abortVoting(roomCode);
            if (!gameState) {
                socket.emit('game:error', { message: 'Aktuell läuft keine Abstimmung' });
                return;
            }
            io.to(roomCode).emit('game:state-updated', { state: gameState });
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
                exitRoom(roomCode, socket.id);
            }

        });

    });

}