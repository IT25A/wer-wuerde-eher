import type { Room, ChatMessage, GameState } from './room-types.ts';

// Daten, die der Client an den Server senden darf
export interface ClientToServerEvents {

    'client:ping': () => void;

    // Room Management
    'room:create': (data: {
        playerName: string;
    }) => void;

    'room:join': (data: {
        roomCode: string;
        playerName: string;
    }) => void;

    'room:leave': () => void;

    // Nur der Host: einen Spieler aus dem Room entfernen
    'room:kick': (data: {
        playerId: string;
    }) => void;

    // Chat
    'chat:send': (data: {
        message: string;
    }) => void;

    // Game
    'game:start': (data: {
        totalRounds: number;
        // IDs aus der Tabelle categories (wie im Hot Seat)
        categoryIds: number[];
    }) => void;

    'game:vote': (data: {
        targetPlayerId: string;
    }) => void;

    'game:next-round': () => void;
    'game:abort-voting': () => void;

}

// Daten, die der Server an den Client senden darf
export interface ServerToClientEvents {

    'server:welcome': (data: {
        message: string;
    }) => void;
    'server:pong': (data: {
        message: string;
    }) => void;

    // Room Management - Antworten
    'room:created': (data: {
        room: Room;
    }) => void;

    'room:joined': (data: {
        room: Room;
    }) => void;

    // Aktueller Stand des Rooms (Spieler, Host), nach jedem Beitritt, Verlassen oder Kick
    'room:updated': (data: {
        room: Room;
    }) => void;

    // Der Empfänger wurde vom Host aus dem Room entfernt
    'room:kicked': () => void;

    'room:error': (data: {
        message: string;
    }) => void;

    'chat:message': (data: {
        message: ChatMessage;
    }) => void;

    // Game
    'game:started': (data: {
        state: GameState;
    }) => void;

    'game:state-updated': (data: {
        state: GameState;
    }) => void;

    'game:error': (data: {
        message: string;
    }) => void;

}