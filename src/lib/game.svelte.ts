import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
import { assignRandomColor } from './playerColors';
export type Phase = 'setup' | 'pass' | 'vote' | 'result' | 'final';

export const MIN_PLAYERS = 2;
export const MAX_PLAYERS = 20;
export const ROUND_OPTIONS = [5, 10, 15, 20];

function shuffle<T>(items: T[]): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

export type Player = {
	name: string;
	roundsWon: number;
	votesTotal: number;
	votes: number;
	voted: Player | null;
	color?: string;
}

export class Game {
	phase = $state<Phase>('setup');
	players = $state<Player[]>([]);
	totalRounds = $state(10);
	round = $state(0);
	deck = $state<string[]>([]);
	selectedCategoryIds = $state<number[]>([1, 2]);
	voterIndex = $state(0);
	question = $derived(this.deck[this.round - 1] ?? '');
	voter = $derived(this.players[this.voterIndex] ?? '');
	tally = $derived(this.players.map((p) => p.votes));
	roundWinners = $derived.by(() => {
		const max = Math.max(0, ...this.tally);
		return max === 0 ? [] : this.players.filter((_, i) => this.tally[i] === max);
	});
	ranking = $derived(
		this.players
			.map((p) => ({
				name: p.name,
				roundsWon: p.roundsWon ?? 0,
				votesReceived: p.votesTotal ?? 0
			}))
			.sort((a, b) => b.roundsWon - a.roundsWon || b.votesReceived - a.votesReceived)
	);
	canStart = $derived(this.players.length >= MIN_PLAYERS);

	toggleCategory(categoryId: number) {
		if (this.selectedCategoryIds.includes(categoryId)) {
			this.selectedCategoryIds = this.selectedCategoryIds.filter((id) => id !== categoryId);
		} else {
			this.selectedCategoryIds = [...this.selectedCategoryIds, categoryId];
		}
	}

	addPlayer(rawName: string): string | null {
		const name = rawName.trim();
		if (!name) return 'Bitte einen Namen eingeben.';
		if (this.players.length >= MAX_PLAYERS) return `Maximal ${MAX_PLAYERS} Spieler.`;
		if (this.players.some((p) => p.name.toLowerCase() === name.toLowerCase())) {
			return 'Diesen Namen gibt es schon.';
		}
		const player: Player = { name, roundsWon: 0, votesTotal: 0, votes: 0, voted: null };
		assignRandomColor(player);
		this.players.push(player);
		return null;
	}

	removePlayer(index: number | Player) {
		const i = typeof index === "number"
			? index
			: this.players.indexOf(index);

		if (i !== -1) {
			this.players.splice(i, 1);
		}
	}

	async start(): Promise<string | null> {
		if (!this.canStart) return 'Mindestens zwei Spieler werden benötigt.';
		try {
			const response = await fetch('/api/game/questions', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					categoryIds: this.selectedCategoryIds,
					count: this.totalRounds
				})
			});
			const result: { questions?: { questionText: string }[]; error?: string } =
				await response.json();
			if (!response.ok || !result.questions?.length) {
				return result.error ?? 'Fragen konnten nicht geladen werden.';
			}
			this.deck = result.questions.map((question) => question.questionText);
			this.totalRounds = this.deck.length;
		} catch {
			return 'Fragen konnten nicht geladen werden. Bitte prüft die Verbindung.';
		}
		this.round = 1;
		this.startRound();
		return null;
	}

	private startRound() {
		this.voterIndex = 0;
		this.phase = 'pass';
	}

	reveal() {
		this.phase = 'vote';
	}

	vote(target: Player) {
		this.players[this.voterIndex].voted = target;
		target.votes++;
		target.votesTotal++;
		if (this.voterIndex + 1 < this.players.length) {
			this.voterIndex++;
			this.phase = 'pass';
			return;
		}
		const max = Math.max(...this.tally);
		this.players.forEach((p) => {
			if (p.votes === max) {
				p.roundsWon++;
			}
		});
		this.phase = 'result';
	}

	next() {
		if (this.round >= this.totalRounds) {
			this.phase = 'final';
			return;
		}
		this.round++;
		this.players.forEach((p) => {
			p.votes = 0;
			p.voted = null;
		});
		this.startRound();
	}

	async playAgain(): Promise<string | null> {
		this.players.forEach((p) => {
			p.votes = 0;
			p.roundsWon = 0;
			p.votesTotal = 0;
		});
		return this.start();
	}

	/** Zurück zur Einrichtung mit denselben Spielern, z. B. um Kategorien oder Runden zu ändern. */
	backToSetup() {
		this.players.forEach((p) => {
			p.votes = 0;
			p.roundsWon = 0;
			p.votesTotal = 0;
			p.voted = null;
		});
		this.round = 0;
		this.phase = 'setup';
	}

	/** Zurück zur Startseite; der Spielstand wird dabei gelöscht. */
	reset() {
		this.players = [];
		this.phase = 'setup';
		goto(resolve('/'));
	}
}

export const game = new Game();
