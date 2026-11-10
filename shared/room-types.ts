// Maximale Anzahl Spieler pro Room
export const MAX_PLAYERS_PER_ROOM = 20;

// Mögliche Zustände eines Raumes
export type RoomStatus = 'waiting' | 'playing';

// Informationen über einen einzelnen Spieler
export interface RoomPlayer {
    id: string;
    name: string;
    isHost: boolean;
    isConnected: boolean;
}

// Eine Chat-Nachricht
export interface ChatMessage {
    id: string;
    playerId: string;
    playerName: string;
    message: string;
    timestamp: number;
}

// Informationen über einen gesamten Raum
export interface Room {
    id: string;
    code: string;
    hostId: string;
    players: RoomPlayer[];
    status: RoomStatus;
    createdAt: number;
}