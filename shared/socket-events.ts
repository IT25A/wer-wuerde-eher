import type { Room, RoomPlayer, ChatMessage } from './room-types';

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

    // Chat
    'chat:send': (data: {
        message: string;
    }) => void;

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

    'room:player-joined': (data: {
        player: RoomPlayer;
    }) => void;

    'room:player-left': (data: {
        playerId: string;
    }) => void;

    'room:error': (data: {
        message: string;
    }) => void;

    'chat:message': (data: {
        message: ChatMessage;
    }) => void;

}