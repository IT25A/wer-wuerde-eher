<script lang="ts">
	import { onMount } from 'svelte';
	import { currentRoomStore, playerIdStore, socketStore } from '$lib/socket-store';
	import { MIN_PLAYERS, ROUND_OPTIONS } from '$lib/game.svelte';

	// Kategorien wie im Hot Seat aus der Datenbank
	type Category = { id: number; name: string; description: string | null; questionCount: number };
	let categories = $state.raw<Category[]>([]);
	let categoriesError = $state('');
	let selectedCategoryIds = $state<number[]>([1, 2]);
	let totalRounds = $state(10);
	let copied = $state(false);

	const room = $derived($currentRoomStore);
	const isHost = $derived(room !== null && room.hostId === $playerIdStore);
	const questionCount = $derived(
		categories
			.filter((category) => selectedCategoryIds.includes(category.id))
			.reduce((total, category) => total + category.questionCount, 0)
	);
	const roundOptions = $derived(ROUND_OPTIONS.filter((n) => n <= questionCount));
	const enoughPlayers = $derived((room?.players.length ?? 0) >= MIN_PLAYERS);
	const canStart = $derived(
		enoughPlayers && selectedCategoryIds.length > 0 && roundOptions.length > 0
	);

	onMount(async () => {
		try {
			const response = await fetch('/api/categories');
			if (!response.ok) throw new Error();
			categories = (await response.json()) as Category[];
			selectedCategoryIds = selectedCategoryIds.filter((id) =>
				categories.some((category) => category.id === id)
			);
		} catch {
			categoriesError = 'Kategorien konnten nicht geladen werden.';
		}
	});

	async function copyCode() {
		if (!room) return;
		await navigator.clipboard.writeText(room.code);
		copied = true;
		setTimeout(() => (copied = false), 1500);
	}

	function start() {
		// Falls weniger Fragen verfügbar sind als gewählt, die größte mögliche Rundenzahl nehmen.
		const rounds = roundOptions.includes(totalRounds) ? totalRounds : roundOptions.at(-1);
		if (rounds) socketStore.startGame(rounds, selectedCategoryIds);
	}
</script>

{#if room}
	<section class="online-panel lobby">
		<p>Room-Code</p>
		<h1 class="room-code">{room.code}</h1>
		<p class="subtitle">Teilt den Code, damit eure Freunde beitreten können.</p>
		<button type="button" class="online-secondary copy" onclick={copyCode}>
			{copied ? 'Kopiert!' : 'Code kopieren'}
		</button>

		{#if isHost}
			<fieldset class="categories">
				<legend>Kategorien</legend>
				{#if categoriesError}
					<p class="error" role="alert">{categoriesError}</p>
				{:else if categories.length === 0}
					<p class="hint">Kategorien werden geladen …</p>
				{/if}
				{#each categories as category (category.id)}
					<label class="category-label" title={category.description}>
						<input type="checkbox" value={category.id} bind:group={selectedCategoryIds} />
						{category.name}
					</label>
				{/each}
			</fieldset>

			<fieldset class="rounds">
				<legend>Anzahl Runden</legend>
				{#each roundOptions as option (option)}
					<label class="round-option">
						<input type="radio" name="online-rounds" value={option} bind:group={totalRounds} />
						{option}
					</label>
				{/each}
			</fieldset>

			<button type="button" class="online-primary" disabled={!canStart} onclick={start}>
				Spiel starten
			</button>
			{#if !enoughPlayers}
				<p class="hint">Mindestens {MIN_PLAYERS} Spieler benötigt.</p>
			{:else if selectedCategoryIds.length === 0}
				<p class="hint">Wählt mindestens eine Kategorie aus.</p>
			{/if}
		{:else}
			<p class="waiting">Warte auf den Host …</p>
			<div class="dots" aria-hidden="true">
				<span></span><span></span><span></span>
			</div>
		{/if}
	</section>
{/if}

<style>
	.lobby {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		padding: 1.5rem clamp(1.25rem, 4vw, 2.5rem) 2rem;
		text-align: center;
	}

	.room-code {
		font-size: clamp(3.5rem, 8vw, 5rem);
		letter-spacing: 0.25em;
		padding-left: 0.25em;
		line-height: 1;
	}

	.subtitle {
		color: var(--color20);
	}

	.copy {
		font-size: 1.25rem;
		min-height: 2.5rem;
	}

	fieldset {
		width: 100%;
		margin: 0;
		border: 1px solid var(--text-color);
		border-radius: 0;
		padding: 0.75rem 1rem;
		font-size: 1.25rem;
	}

	legend {
		padding: 0 0.35rem;
		font-size: 1.15rem;
	}

	.categories {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.5rem 1.5rem;
	}

	.category-label {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 1.5rem;
		cursor: pointer;
	}

	.category-label input {
		width: 1.1rem;
		height: 1.1rem;
		accent-color: var(--color20dark);
	}

	.rounds {
		display: flex;
		justify-content: center;
		gap: 0.75rem;
	}

	.round-option {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		aspect-ratio: 1 / 1;
		height: 3.5rem;
		border-radius: 10%;
		background: var(--color70light);
		font-size: 1.75rem;
		cursor: pointer;
		transition:
			background 0.1s ease,
			transform 0.1s ease-out;
	}

	.round-option:has(input:checked) {
		background: var(--color20dark);
	}

	.round-option:hover {
		background: var(--color20);
		transform: scale(1.05);
	}

	.round-option:has(input:focus-visible) {
		outline: 2px solid var(--text-color);
	}

	.round-option input {
		position: absolute;
		width: 0;
		height: 0;
		opacity: 0;
	}

	.hint {
		font-size: 1.2rem;
		color: hsla(0, 0%, 100%, 0.65);
	}

	.error {
		font-size: 1.2rem;
		color: var(--color10light);
	}

	.waiting {
		margin-top: 1rem;
		font-size: 2rem;
	}

	.dots {
		display: flex;
		gap: 0.5rem;
	}

	.dots span {
		width: 1rem;
		height: 1rem;
		border-radius: 50%;
		background: var(--color10);
		animation: blink 1.2s ease-in-out infinite;
	}

	.dots span:nth-child(2) {
		animation-delay: 0.2s;
	}

	.dots span:nth-child(3) {
		animation-delay: 0.4s;
	}

	@keyframes blink {
		50% {
			background: #ccc;
		}
	}
</style>
