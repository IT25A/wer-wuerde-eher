<script lang="ts">
	import { game, MAX_PLAYERS, MIN_PLAYERS, ROUND_OPTIONS } from '$lib/game.svelte';
	import { questions } from '$lib/questions';

	let name = $state('');
	let error = $state('');

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
			{#each game.players as player, i (player)}
				<li
					class="flex items-center gap-2 rounded-full bg-linear-to-r from-violet-500/30 to-cyan-400/30 py-1.5 pr-2 pl-4 ring-1 ring-white/15"
				>
					<span class="font-semibold">{player}</span>
					<button
						class="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-black/20 text-sm hover:bg-rose-500"
						aria-label="{player} entfernen"
						onclick={() => game.removePlayer(i)}>✕</button
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
	<legend class="muted mb-2">Anzahl Runden</legend>
	<div class="flex gap-2">
		{#each ROUND_OPTIONS.filter((n) => n <= questions.length) as option (option)}
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

<button class="btn btn-primary mt-8 w-full" disabled={!game.canStart} onclick={() => game.start()}>
	Spiel starten
</button>
