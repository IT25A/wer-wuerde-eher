import type { GameState, GamePlayer } from '../../shared/room-types';
import { questions } from '../../src/lib/questions';

const games = new Map<string, GameState>();

function shuffle<T>(items: T[]): T[] {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

export function initGame(roomCode: string, playerIds: string[], playerNames: string[], totalRoundsParam?: number): GameState | null {
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

    const deck = shuffle(questions);
    const totalRounds = totalRoundsParam ? Math.min(totalRoundsParam, deck.length) : Math.min(10, deck.length);

    const gameState: GameState = {
        phase: 'voting',
        round: 1,
        totalRounds,
        question: deck[0],
        players,
        voterIndex: 0,
        voterId: players[0].id
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

    if (gameState.voterId !== voterId) {
        console.log(`Spieler ${voterId} ist nicht dran, zu voten`);
        return null;
    }

    const targetPlayer = gameState.players.find((p) => p.id === targetId);
    if (!targetPlayer) {
        console.log(`Ungültiger targetPlayer: ${targetId}`);
        return null;
    }

    targetPlayer.votes++;
    targetPlayer.votesTotal++;

    if (gameState.voterIndex + 1 < gameState.players.length) {
        gameState.voterIndex++;
        gameState.voterId = gameState.players[gameState.voterIndex].id;
    } else {
        const maxVotes = Math.max(...gameState.players.map((p) => p.votes));
        gameState.players.forEach((p) => {
            if (p.votes === maxVotes) {
                p.roundsWon++;
            }
        });
        gameState.phase = 'result';
    }

    return gameState;
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
    gameState.voterId = gameState.players[0].id;

    gameState.players.forEach((p) => {
        p.votes = 0;
    });

    const deck = shuffle(questions);
    gameState.question = deck[gameState.round - 1];

    console.log(`Nächste Runde gestartet für Room ${roomCode}: Runde ${gameState.round}`);
    return gameState;
}

export function deleteGame(roomCode: string): void {
    games.delete(roomCode);
    console.log(`Spiel gelöscht für Room ${roomCode}`);
}
