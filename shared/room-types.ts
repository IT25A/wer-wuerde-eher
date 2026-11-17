// Maximale Anzahl Spieler pro Room
export const MAX_PLAYERS_PER_ROOM = 20;

// Mögliche Zustände eines Raumes
export type RoomStatus = 'waiting' | 'playing';

// Game-Phasen für Online-Spiel
export type GamePhase = 'voting' | 'result' | 'final';

// Informationen über einen einzelnen Spieler
export interface RoomPlayer {
    id: string;
    name: string;
    isHost: boolean;
    isConnected: boolean;
}

// Spieler im Spiel (mit Game-Daten)
export interface GamePlayer {
    id: string;
    name: string;
    roundsWon: number;
    votesTotal: number;
    votes: number;
}

// Eine Chat-Nachricht
export interface ChatMessage {
    id: string;
    playerId: string;
    playerName: string;
    message: string;
    timestamp: number;
}

// Spielzustand
export interface GameState {
    phase: GamePhase;
    round: number;
    totalRounds: number;
    question: string;
    players: GamePlayer[];
    voterIndex: number;
    voterId: string;
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