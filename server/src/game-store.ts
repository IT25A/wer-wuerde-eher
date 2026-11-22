import type { GameState, GamePlayer } from '../../shared/room-types.ts';
import { getRandomQuestions } from '../../src/lib/server/questions.ts';

const games = new Map<string, GameState>();
const decks = new Map<string, string[]>();

// Fragen kommen wie im Hot Seat aus der Datenbank (Kategorien aus /api/categories).
export function initGame(
    roomCode: string,
    playerIds: string[],
    playerNames: string[],
    totalRounds: number,
    categoryIds: number[]
): GameState | null {
    const minPlayers = 2;
    if (playerIds.length < minPlayers) {
        console.log(`Nicht genug Spieler zum Starten: ${playerIds.length}/${minPlayers}`);
        return null;
    }

    const players: GamePlayer[] = playerIds.map((id, index) => ({
        id,
        name: playerNames[index],
        roundsWon: 0,
        votesTotal: 0,
        votes: 0
    }));

    const deck = getRandomQuestions(categoryIds, totalRounds);
    if (deck.length === 0) {
        console.log(`Keine Fragen für die gewählten Kategorien in Room ${roomCode}`);
        return null;
    }
    decks.set(roomCode, deck);

    const gameState: GameState = {
        phase: 'voting',
        round: 1,
        totalRounds: deck.length,
        question: deck[0],
        players,
        voterIndex: 0,
        voterId: '',
        votedPlayerIds: []
    };

    games.set(roomCode, gameState);
    console.log(`Spiel gestartet für Room ${roomCode} mit ${players.length} Spielern`);
    return gameState;
}

export function getGameState(roomCode: string): GameState | undefined {
    return games.get(roomCode);
}

export function processVote(roomCode: string, voterId: string, targetId: string): GameState | null {
    const gameState = games.get(roomCode);

    if (!gameState) {
        return null;
    }

    if (gameState.phase !== 'voting') {
        console.log(`Für Room ${roomCode} läuft gerade keine Abstimmung`);
        return null;
    }

    if (gameState.votedPlayerIds.includes(voterId)) {
        console.log(`Spieler ${voterId} hat bereits gevotet`);
        return null;
    }

    const voterExists = gameState.players.some((p) => p.id === voterId);
    if (!voterExists) {
        console.log(`Ungültiger voterId: ${voterId}`);
        return null;
    }

    const targetPlayer = gameState.players.find((p) => p.id === targetId);
    if (!targetPlayer) {
        console.log(`Ungültiger targetPlayer: ${targetId}`);
        return null;
    }

    targetPlayer.votes++;
    targetPlayer.votesTotal++;
    gameState.votedPlayerIds.push(voterId);

    if (gameState.votedPlayerIds.length >= gameState.players.length) {
        finishVoting(gameState);
    }

    return gameState;
}

export function abortVoting(roomCode: string): GameState | null {
    const gameState = games.get(roomCode);
    if (!gameState || gameState.phase !== 'voting') {
        return null;
    }
    finishVoting(gameState);
    return gameState;
}

// Entfernt einen Spieler aus dem laufenden Spiel (Verlassen, Kick, Verbindungsabbruch).
// Gibt den neuen Spielzustand zurück, oder null, wenn der Spieler in keinem Spiel war.
export function removePlayerFromGame(roomCode: string, playerId: string): GameState | null {
    const gameState = games.get(roomCode);
    if (!gameState || !gameState.players.some((p) => p.id === playerId)) {
        return null;
    }

    gameState.players = gameState.players.filter((p) => p.id !== playerId);
    gameState.votedPlayerIds = gameState.votedPlayerIds.filter((id) => id !== playerId);

    if (gameState.players.length < 2) {
        // Mit nur einer Person kann nicht weitergespielt werden: direkt zum Endergebnis.
        gameState.phase = 'final';
    } else if (
        gameState.phase === 'voting' &&
        gameState.votedPlayerIds.length >= gameState.players.length
    ) {
        finishVoting(gameState);
    }

    return gameState;
}

function finishVoting(gameState: GameState): void {
    const maxVotes = Math.max(0, ...gameState.players.map((p) => p.votes));
    gameState.players.forEach((p) => {
        if (maxVotes > 0 && p.votes === maxVotes) {
            p.roundsWon++;
        }
    });
    gameState.phase = 'result';
}

export function nextRound(roomCode: string): GameState | null {
    const gameState = games.get(roomCode);

    if (!gameState) {
        return null;
    }

    if (gameState.round >= gameState.totalRounds) {
        gameState.phase = 'final';
        return gameState;
    }

    gameState.round++;
    gameState.phase = 'voting';
    gameState.voterIndex = 0;
    gameState.voterId = '';
    gameState.votedPlayerIds = [];

    gameState.players.forEach((p) => {
        p.votes = 0;
    });

    const deck = decks.get(roomCode);
    if (!deck) {
        return null;
    }
    gameState.question = deck[gameState.round - 1];

    console.log(`Nächste Runde gestartet für Room ${roomCode}: Runde ${gameState.round}`);
    return gameState;
}

export function deleteGame(roomCode: string): void {
    games.delete(roomCode);
    decks.delete(roomCode);
    console.log(`Spiel gelöscht für Room ${roomCode}`);
}
