import { io, type Socket } from 'socket.io-client';
import type {
    ClientToServerEvents,
    ServerToClientEvents
} from '../../shared/socket-events';
import type { Room, ChatMessage, GameState } from '../../shared/room-types';
import { get, writable } from 'svelte/store';

const socket = writable<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
const currentRoom = writable<Room | null>(null);
const chatMessages = writable<ChatMessage[]>([]);
const errorMessage = writable('');
const isConnected = writable(false);
const gameState = writable<GameState | null>(null);
// Eigene Spieler-ID (= Socket-ID), reaktiv für die Komponenten
const playerId = writable<string | null>(null);

function resetRoom() {
    currentRoom.set(null);
    chatMessages.set([]);
    gameState.set(null);
}

function connect() {
    if (get(socket)) {
        console.log('Socket bereits verbunden');
        return;
    }

    // Der Game-Server läuft auf derselben Adresse wie die Webseite (same-origin).
    const newSocket = io({
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
    });

    newSocket.on('connect', () => {
        isConnected.set(true);
        playerId.set(newSocket.id ?? null);
        errorMessage.set('');
        console.log('✅ Socket verbunden:', newSocket.id);
    });

    newSocket.on('connect_error', (error) => {
        isConnected.set(false);
        errorMessage.set(`Verbindungsfehler: ${error.message}`);
        console.error('❌ Verbindungsfehler:', error.message);
    });

    newSocket.on('disconnect', (reason) => {
        isConnected.set(false);
        playerId.set(null);
        resetRoom();
        console.log('⚠️ Verbindung getrennt:', reason);
    });

    newSocket.on('room:created', (data) => {
        currentRoom.set(data.room);
        errorMessage.set('');
        console.log('✅ Room erstellt:', data.room.code);
    });

    newSocket.on('room:joined', (data) => {
        currentRoom.set(data.room);
        errorMessage.set('');
        console.log('✅ Room beigetreten:', data.room.code);
    });

    newSocket.on('room:updated', (data) => {
        currentRoom.set(data.room);
        // Zurück in der Lobby: altes Spiel verwerfen
        if (data.room.status === 'waiting') gameState.set(null);
    });

    newSocket.on('room:kicked', () => {
        resetRoom();
        errorMessage.set('Du wurdest vom Host aus dem Raum entfernt.');
    });

    newSocket.on('room:error', (data) => {
        errorMessage.set(data.message);
        console.error('❌ Room-Fehler:', data.message);
    });

    newSocket.on('chat:message', (data) => {
        chatMessages.update((msgs) => [...msgs, data.message]);
        console.log('💬 Chat-Nachricht empfangen');
    });

    newSocket.on('game:started', (data) => {
        currentRoom.update((room) => (room ? { ...room, status: 'playing' } : room));
        gameState.set(data.state);
        errorMessage.set('');
        console.log('🎮 Spiel gestartet');
    });

    newSocket.on('game:state-updated', (data) => {
        gameState.set(data.state);
        console.log('🔄 Spielzustand aktualisiert');
    });

    newSocket.on('game:error', (data) => {
        errorMessage.set(data.message);
        console.error('❌ Game-Fehler:', data.message);
    });

    socket.set(newSocket);
}

function disconnect() {
    const currentSocket = get(socket);
    if (currentSocket) {
        currentSocket.disconnect();
        socket.set(null);
        console.log('Socket getrennt');
    }
    isConnected.set(false);
    playerId.set(null);
    resetRoom();
}

function createRoom(playerName: string) {
    const currentSocket = get(socket);
    if (!currentSocket?.connected) {
        errorMessage.set('❌ Nicht mit Server verbunden. Bitte lade die Seite neu.');
        console.error('❌ Nicht verbunden - Room kann nicht erstellt werden');
        return;
    }
    console.log('Sende room:create mit playerName:', playerName);
    currentSocket.emit('room:create', { playerName });
}

function joinRoom(roomCode: string, playerName: string) {
    const currentSocket = get(socket);
    if (!currentSocket?.connected) {
        errorMessage.set('❌ Nicht mit Server verbunden. Bitte lade die Seite neu.');
        console.error('❌ Nicht verbunden - Room kann nicht beigetreten werden');
        return;
    }
    console.log('Sende room:join mit roomCode:', roomCode, 'playerName:', playerName);
    currentSocket.emit('room:join', { roomCode: roomCode.trim().toUpperCase(), playerName });
}

function leaveRoom() {
    const currentSocket = get(socket);
    if (!currentSocket) return;
    console.log('Verlasse Room');
    currentSocket.emit('room:leave');
    resetRoom();
    errorMessage.set('');
}

function kickPlayer(targetPlayerId: string) {
    const currentSocket = get(socket);
    if (!currentSocket?.connected) {
        errorMessage.set('❌ Nicht mit Server verbunden');
        return;
    }
    currentSocket.emit('room:kick', { playerId: targetPlayerId });
}

function backToLobby() {
    const currentSocket = get(socket);
    if (!currentSocket?.connected) {
        errorMessage.set('❌ Nicht mit Server verbunden');
        return;
    }
    currentSocket.emit('room:back-to-lobby');
}

function startGame(totalRounds: number, categoryIds: number[]) {
    const currentSocket = get(socket);
    if (!currentSocket?.connected) {
        errorMessage.set('❌ Nicht mit Server verbunden');
        return;
    }
    currentSocket.emit('game:start', { totalRounds, categoryIds });
}

function sendChatMessage(message: string) {
    const currentSocket = get(socket);
    if (!currentSocket?.connected) {
        errorMessage.set('❌ Nicht mit Server verbunden');
        return;
    }
    currentSocket.emit('chat:send', { message });
}

function vote(targetPlayerId: string) {
    const currentSocket = get(socket);
    if (!currentSocket?.connected) {
        errorMessage.set('❌ Nicht mit Server verbunden');
        return;
    }
    currentSocket.emit('game:vote', { targetPlayerId });
}

function nextRound() {
    const currentSocket = get(socket);
    if (!currentSocket?.connected) {
        errorMessage.set('❌ Nicht mit Server verbunden');
        return;
    }
    currentSocket.emit('game:next-round');
}

function abortVoting() {
    const currentSocket = get(socket);
    if (!currentSocket?.connected) {
        errorMessage.set('❌ Nicht mit Server verbunden');
        return;
    }
    currentSocket.emit('game:abort-voting');
}

export const socketStore = {
    subscribe: socket.subscribe,
    set: socket.set,
    connect,
    disconnect,
    createRoom,
    joinRoom,
    leaveRoom,
    kickPlayer,
    backToLobby,
    startGame,
    sendChatMessage,
    vote,
    nextRound,
    abortVoting
};

export const socketRef = {
    get: () => get(socket)
};

export const currentRoomStore = currentRoom;
export const chatMessagesStore = chatMessages;
export const errorMessageStore = errorMessage;
export const gameStateStore = gameState;
export const playerIdStore = playerId;


