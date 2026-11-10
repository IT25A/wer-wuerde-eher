// Mögliche Zustände eines Raumes
export type RoomStatus = 'waiting' | 'playing';

// Informationen über einen einzelnen Spieler
export interface RoomPlayer {
    id: string;
    name: string;
    isHost: boolean;
    isConnected: boolean;
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