<script lang="ts">
	import { onMount } from 'svelte';
	import { game, MAX_PLAYERS, MIN_PLAYERS, ROUND_OPTIONS } from '$lib/game.svelte';
	
	type Category = { id: number; name: string; description: string | null; questionCount: number }
	let categories = $state<Category[]>([]);
	let categoriesError = $state('');

	let name = $state('');
	let error = $state('');
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

	async function startGame() {
		isStarting = true;
		error = await game.start();
		isStarting = false;
	}

	function add(event: SubmitEvent) {
		event.preventDefault();
		error = game.addPlayer(name) ?? '';
		if (!error) name = '';
	}
</script>

<div class="text-center">
	<h1
		class="bg-linear-to-r from-violet-300 via-blue-300 to-cyan-300 bg-clip-text text-5xl font-extrabold text-transparent"
	>
		Wer würde eher?
	</h1>
	<p class="muted mt-3">
		Alle spielen an einem Gerät. Tragt eure Namen ein, danach wird das Gerät reihum weitergegeben.
	</p>
</div>

<section class="card mt-8 p-5">
	<form class="flex gap-2" onsubmit={add}>
		<input
			class="min-w-0 flex-1 rounded-xl border border-white/15 bg-black/25 px-4 py-3 text-lg text-white placeholder:text-indigo-300/50 focus:border-cyan-300 focus:outline-none"
			placeholder="Name"
			maxlength="20"
			aria-label="Name des Spielers"
			bind:value={name}
		/>
		<button class="btn" type="submit" disabled={game.players.length >= MAX_PLAYERS}>
			Hinzufügen
		</button>
	</form>
	{#if error}
		<p class="mt-2 text-rose-300" role="alert">{error}</p>
	{/if}

	{#if game.players.length}
		<ul class="mt-4 flex flex-wrap gap-2">
			{#each game.players as p (p.name)}
				<li
					class="flex items-center gap-2 rounded-full bg-linear-to-r from-violet-500/30 to-cyan-400/30 py-1.5 pr-2 pl-4 ring-1 ring-white/15"
				>
					<span class="font-semibold">{p.name}</span>
					<button
						class="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-black/20 text-sm hover:bg-rose-500"
						aria-label="{p} entfernen"
						onclick={() => game.removePlayer(p)}>✕</button
					>
				</li>
			{/each}
		</ul>
	{/if}
	<p class="muted mt-3 text-sm">
		{game.players.length} / {MAX_PLAYERS} Spieler (mindestens {MIN_PLAYERS})
	</p>
</section>

<fieldset class="mt-6">
	<legend class="muted mb-2">Kategorien</legend>
	{#if categoriesError}
		<p class="text-rose-300" role="alert">{categoriesError}</p>
	{:else if categories.length === 0}
		<p class="muted">Kategorien werden geladen …</p>
	{/if}
	<div class="grid gap-3 sm:grid-cols-2">
		{#each categories as category (category.id)}
			<label
				class="flex cursor-pointer items-start gap-3 rounded-xl border border-white/15 bg-white/8 p-4 transition hover:bg-white/15 has-checked:border-cyan-300 has-checked:bg-cyan-300/15 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-cyan-300"
			>
				<input
					class="mt-1 accent-cyan-300"
					type="checkbox"
					checked={game.selectedCategoryIds.includes(category.id)}
					onchange={() => game.toggleCategory(category.id)}
				/>
				<span>
					<span class="block font-semibold">{category.name}</span>
					<span class="muted mt-1 block text-sm">{category.description}</span>
				</span>
			</label>
		{/each}
	</div>
	{#if game.selectedCategoryIds.length === 0}
		<p class="mt-2 text-rose-300" role="alert">Wählt mindestens eine Kategorie aus.</p>
	{/if}
</fieldset>

<fieldset class="mt-6">
	<legend class="muted mb-2">Anzahl Runden</legend>
	<div class="flex gap-2">
		{#each ROUND_OPTIONS.filter((n) => n <= selectedQuestionCount) as option (option)}
			<label
				class="flex-1 cursor-pointer rounded-xl border border-white/15 bg-white/8 py-3 text-center text-lg font-semibold transition hover:bg-white/15 has-checked:border-transparent has-checked:bg-cyan-300 has-checked:text-slate-950 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-cyan-300"
			>
				<input
					class="sr-only"
					type="radio"
					name="rounds"
					value={option}
					bind:group={game.totalRounds}
				/>
				{option}
			</label>
		{/each}
	</div>
</fieldset>

<button
	class="btn btn-primary mt-8 w-full"
    disabled={!game.canStart || game.selectedCategoryIds.length === 0 || categories.length === 0 || isStarting}
	onclick={startGame}
>
	{isStarting ? 'Fragen werden geladen …' : 'Spiel starten'}
</button>
{#if error}
	<p class="mt-2 text-rose-300" role="alert">{error}</p>
{/if}
