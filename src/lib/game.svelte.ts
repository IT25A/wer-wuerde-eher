import { questions } from './questions';

// Ablauf eines Spiels (Hot Seat, ein Gerät wird reihum weitergegeben):
// setup -> pass -> vote -> (pass -> vote)* -> result -> pass ... -> final
export type Phase = 'setup' | 'pass' | 'vote' | 'result' | 'final';

export const MIN_PLAYERS = 2;
export const MAX_PLAYERS = 10;
export const ROUND_OPTIONS = [5, 10, 15];

function shuffle<T>(items: T[]): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

export class Game {
	phase = $state<Phase>('setup');
	players = $state<string[]>([]);
	totalRounds = $state(10);
	round = $state(0);
	// Gemischte Fragen: so wird jede Frage pro Spiel höchstens einmal gestellt.
	deck = $state<string[]>([]);
	// Wer gerade abstimmt (Index in players)
	voterIndex = $state(0);
	// votes[i] = Index des Spielers, den Spieler i in dieser Runde gewählt hat
	votes = $state<number[]>([]);
	// Wie oft ein Spieler in einer Runde am häufigsten gewählt wurde
	roundsWon = $state<number[]>([]);
	// Wie oft ein Spieler insgesamt gewählt wurde (Gleichstand-Entscheid)
	votesReceived = $state<number[]>([]);

	question = $derived(this.deck[this.round - 1] ?? '');
	voter = $derived(this.players[this.voterIndex] ?? '');
	tally = $derived(this.players.map((_, i) => this.votes.filter((v) => v === i).length));
	roundWinners = $derived.by(() => {
		const max = Math.max(0, ...this.tally);
		return max === 0 ? [] : this.players.filter((_, i) => this.tally[i] === max);
	});
	ranking = $derived(
		this.players
			.map((name, i) => ({
				name,
				roundsWon: this.roundsWon[i] ?? 0,
				votesReceived: this.votesReceived[i] ?? 0
			}))
			.sort((a, b) => b.roundsWon - a.roundsWon || b.votesReceived - a.votesReceived)
	);
	canStart = $derived(this.players.length >= MIN_PLAYERS);

	/** Gibt eine Fehlermeldung zurück, oder null bei Erfolg. */
	addPlayer(rawName: string): string | null {
		const name = rawName.trim();
		if (!name) return 'Bitte einen Namen eingeben.';
		if (this.players.length >= MAX_PLAYERS) return `Maximal ${MAX_PLAYERS} Spieler.`;
		if (this.players.some((p) => p.toLowerCase() === name.toLowerCase())) {
			return 'Diesen Namen gibt es schon.';
		}
		this.players.push(name);
		return null;
	}

	removePlayer(index: number) {
		this.players.splice(index, 1);
	}

	start() {
		if (!this.canStart) return;
		this.totalRounds = Math.min(this.totalRounds, questions.length);
		this.deck = shuffle(questions).slice(0, this.totalRounds);
		this.roundsWon = this.players.map(() => 0);
		this.votesReceived = this.players.map(() => 0);
		this.round = 1;
		this.startRound();
	}

	private startRound() {
		this.voterIndex = 0;
		this.votes = [];
		this.phase = 'pass';
	}

	/** Der Spieler am Gerät hat bestätigt, dass er es ist. */
	reveal() {
		this.phase = 'vote';
	}

	vote(target: number) {
		this.votes.push(target);
		if (this.voterIndex + 1 < this.players.length) {
			this.voterIndex++;
			this.phase = 'pass';
			return;
		}
		this.tally.forEach((count, i) => (this.votesReceived[i] += count));
		const max = Math.max(...this.tally);
		this.tally.forEach((count, i) => {
			if (count === max) this.roundsWon[i]++;
		});
		this.phase = 'result';
	}

	next() {
		if (this.round >= this.totalRounds) {
			this.phase = 'final';
			return;
		}
		this.round++;
		this.startRound();
	}

	/** Neue Runde mit denselben Spielern. */
	playAgain() {
		this.start();
	}

	/** Zurück zum Anfang, alles löschen. */
	reset() {
		this.players = [];
		this.phase = 'setup';
	}
}

export const game = new Game();
