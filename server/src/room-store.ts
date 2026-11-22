import type { Room, RoomPlayer } from '../../shared/room-types.ts';
import { MAX_PLAYERS_PER_ROOM } from '../../shared/room-types.ts';
import { deleteGame } from './game-store.ts';

const rooms = new Map<string, Room>();

// Hilfsfunktion: Generiert einen zufälligen 6-stelligen Code
function generateRoomCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// Prüft, ob ein Code bereits existiert. Falls ja, generiert einen neuen.
function getUniqueRoomCode(): string {
    let code = generateRoomCode();
    while (rooms.has(code)) {
        code = generateRoomCode();
    }
    return code;
}

// Erstellt einen neuen Room und gibt ihn zurück
export function createRoom(hostId: string, hostName: string): Room | null {
    if (!hostName || hostName.trim().length === 0) {
        console.log('Room erstellen fehlgeschlagen: Host-Name ist leer');
        return null;
    }

    const code = getUniqueRoomCode();

    const hostPlayer: RoomPlayer = {
        id: hostId,
        name: hostName.trim(),
        isHost: true,
        isConnected: true
    };

    const newRoom: Room = {
        id: crypto.randomUUID(),
        code,
        hostId,
        players: [hostPlayer],
        status: 'waiting',
        createdAt: Date.now()
    };

    rooms.set(code, newRoom);
    console.log(`Room erstellt: ${code} mit Host ${hostName}`);
    return newRoom;
}

// Gibt einen Room anhand seines Codes zurück 
export function getRoom(code: string): Room | undefined {
    return rooms.get(code);
}

// Fügt einen Spieler einem Room hinzu
export function addPlayerToRoom(
    code: string,
    playerId: string,
    playerName: string
): Room | null {
    if (!playerName || playerName.trim().length === 0) {
        console.log('Room beitreten fehlgeschlagen: Spieler-Name ist leer');
        return null;
    }

    const room = rooms.get(code);

    if (!room) {
        return null; 
    }

    if (room.players.length >= MAX_PLAYERS_PER_ROOM) {
        console.log(`Room ${code} ist voll (${room.players.length}/${MAX_PLAYERS_PER_ROOM})`);
        return null;
    }

    // Prüfen, ob Spieler bereits im Room ist
    if (room.players.some((p) => p.id === playerId)) {
        return room; 
    }

    const newPlayer: RoomPlayer = {
        id: playerId,
        name: playerName.trim(),
        isHost: false,
        isConnected: true
    };

    room.players.push(newPlayer);
    console.log(`Spieler ${playerName} ist Room ${code} beigetreten`);
    return room;
}

export function removePlayerFromRoom(code: string, playerId: string): Room | null {
    const room = rooms.get(code);

    if (!room) {
        return null;
    }

    room.players = room.players.filter((p) => p.id !== playerId);
    console.log(`Spieler ${playerId} hat Room ${code} verlassen`);

    // Wenn der Host den Room verlässt, neuen Host bestimmen
    if (room.hostId === playerId && room.players.length > 0) {
        room.hostId = room.players[0].id;
        room.players[0].isHost = true;
        console.log(`Neuer Host für Room ${code}: ${room.players[0].name}`);
    }

    if (room.players.length === 0) {
        rooms.delete(code);
        deleteGame(code);
        console.log(`Room ${code} wurde gelöscht (keine Spieler mehr)`);
        return null;
    }

    return room;
}

export function setPlayerConnectionStatus(
    code: string,
    playerId: string,
    isConnected: boolean
): Room | null {
    const room = rooms.get(code);

    if (!room) {
        return null;
    }

    const player = room.players.find((p) => p.id === playerId);
    if (player) {
        player.isConnected = isConnected;
    }

    return room;
}

export function getAllRooms(): Room[] {
    return Array.from(rooms.values());
}
