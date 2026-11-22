<script lang="ts">
	import { onMount } from 'svelte';
	import { game, MAX_PLAYERS, MIN_PLAYERS, ROUND_OPTIONS } from '$lib/game.svelte';

	type Category = { id: number; name: string; description: string | null; questionCount: number };
	let categories = $state<Category[]>([]);
	let categoriesError = $state('');
	import PlayerChip from '$lib/components/playerChip.svelte';
	let name = $state('');
	let error: string | null = $state('');
	let isStarting = $state(false);
	let selectedQuestionCount = $derived(
		categories
			.filter((category) => game.selectedCategoryIds.includes(category.id))
			.reduce((total, category) => total + category.questionCount, 0)
	);

	async function loadCategories() {
		try {
			const response = await fetch('/api/categories');
			if (!response.ok) throw new Error('Kategorien konnten nicht geladen werden.');
			categories = (await response.json()) as Category[];
			game.selectedCategoryIds = game.selectedCategoryIds.filter((id) =>
				categories.some((category) => category.id === id)
			);
		} catch {
			categoriesError = 'Kategorien konnten nicht geladen werden.';
		}
	}

	onMount(() => {
		void loadCategories();
	});

	let startError = $state('');

	async function startGame() {
		isStarting = true;
		startError = (await game.start()) ?? '';
		isStarting = false;
	}

	function add(event: SubmitEvent) {
		event.preventDefault();
		error = game.addPlayer(name) ?? '';
		if (!error) name = '';
	}
</script>

<div class="setup-head">
	<h1 class="title">Wer würde eher?</h1>
	<p class="subtitle">
		Alle spielen an einem Gerät. Tragt eure Namen ein, danach wird das Gerät reihum weitergegeben.
	</p>
</div>

<section id="setup-players">
	<form id="add-player" onsubmit={add}>
		<input
			class="glow-box"
			placeholder="Name"
			maxlength="20"
			aria-label="Name des Spielers"
			bind:value={name}
		/>
		<button
			class="glow-box"
			id="add-player-btn"
			type="submit"
			disabled={game.players.length >= MAX_PLAYERS}
		>
			Hinzufügen
		</button>
	</form>
	{#if error}
		<p class="error-text" role="alert">{error}</p>
	{/if}

	{#if game.players.length}
		<ul id="player-list">
			{#each game.players as p (p.name)}
				<li>
					<PlayerChip player={p} allowRemove={true} />
				</li>
			{/each}
		</ul>
	{/if}
	<p class="muted setup-player-count">
		{game.players.length} / {MAX_PLAYERS} Spieler (mindestens {MIN_PLAYERS})
	</p>
</section>

<fieldset id="categories">
	<legend>Kategorien</legend>
	{#if categoriesError}
		<p class="error-text" role="alert">{categoriesError}</p>
	{:else if categories.length === 0}
		<p class="muted">Kategorien werden geladen …</p>
	{/if}
	<div class="category-list">
		{#each categories as category (category.id)}
			<label class="category-label">
				<input
					class="category-input"
					type="checkbox"
					checked={game.selectedCategoryIds.includes(category.id)}
					onchange={() => game.toggleCategory(category.id)}
				/>
				<span>
					<span class="category-name" title={category.description}>
						{category.name}
					</span>
				</span>
			</label>
		{/each}
	</div>
	{#if game.selectedCategoryIds.length === 0}
		<p class="error-text" role="alert">Wählt mindestens eine Kategorie aus.</p>
	{/if}
</fieldset>

<fieldset id="rounds">
	<legend>Anzahl Runden</legend>

	{#each ROUND_OPTIONS.filter((n) => n <= selectedQuestionCount) as option (option)}
		<label class="round-option">
			<input
				class="round-input"
				type="radio"
				name="rounds"
				value={option}
				bind:group={game.totalRounds}
			/>
			{option}
		</label>
	{/each}
	<!-- #TODO: Add custom round option -->
</fieldset>

<button
	class="start-btn"
	id="start-btn"
	disabled={!game.canStart ||
		game.selectedCategoryIds.length === 0 ||
		categories.length === 0 ||
		isStarting}
	onclick={startGame}
>
	{isStarting ? 'Fragen werden geladen …' : 'Spiel starten'}
</button>
{#if startError}
	<p class="error-text" role="alert">{startError}</p>
{/if}

<style>
	p {
		text-align: center;
	}
	.subtitle {
		color: var(--color20);
	}
	#categories {
		width: 100%;
		margin: 0;
		border: 1px solid var(--text-color);
		padding: 0.5rem 1rem 0.75rem;
	}
	.category-list {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.5rem 1.25rem;
	}
	.category-label {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		font-size: 1.35rem;
		cursor: pointer;
	}
	.category-input {
		accent-color: var(--color20dark);
	}
	#setup-players {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		width: 100%;
		margin: 1rem 0;
	}
	#add-player {
		display: flex;
		flex-direction: row;
		justify-content: center;
		gap: 1rem;
		width: 100%;
	}
	#add-player button,
	input {
		font-size: 1.25rem;
		padding: 0.25rem 0.5rem;
	}
	#add-player-btn {
		background: var(--color30);
	}

	#player-list {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 0.5rem;
		list-style: none;
		padding: 0;
		margin: 0;
	}
	/* .player-chip{
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: .5rem;
		background: var(--color20dark);
		text-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
		padding: .25rem .5rem;
		border-radius: .25rem;
	} */

	#rounds {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		width: 100%;
		margin: 0;
		border: 1px solid var(--text-color);
	}
	.round-option {
		display: inline-flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		aspect-ratio: 1/1;
		height: 3rem;
		font-size: 1.5rem;
		padding: 0.25rem;
		border-radius: 10%;
		margin: 0.25rem;
		background: var(--color70light);
		cursor: pointer;
		gap: 0.5rem;
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
	.round-option:active {
		transform: scale(0.98);
	}
	.round-option input {
		opacity: 0;
		position: absolute;
		width: 0;
		height: 0;
	}

	#start-btn {
		font-size: 1.5rem;
		padding: 0.25rem 2rem;
		background: var(--color30);
	}
</style>
