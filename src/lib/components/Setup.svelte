<script lang="ts">
	import { game, MAX_PLAYERS, MIN_PLAYERS, ROUND_OPTIONS } from '$lib/game.svelte';
	import { questions } from '$lib/questions';
	import Mascot from './Mascot.svelte';

	let name = $state('');
	let error = $state('');

	function add(event: SubmitEvent) {
		event.preventDefault();
		error = game.addPlayer(name) ?? '';
		if (!error) name = '';
	}
</script>

<div class="text-center">
	<Mascot mimic="thinking" caption="Wen nehmen wir mit?" size="small" />

	<h1 class="mt-4 text-4xl font-extrabold text-roulette-gold-light sm:text-5xl md:text-6xl">
		Wer würde eher?
	</h1>
	<p class="muted mt-3 text-base sm:text-lg">
		Alle spielen an einem Gerät. Tragt eure Namen ein, danach wird das Gerät reihum weitergegeben.
	</p>
</div>

<section class="card mt-8">
	<form class="flex gap-2" onsubmit={add}>
		<input
			class="min-w-0 flex-1 rounded-xl border border-roulette-gold/30 bg-roulette-bg/60 px-4 py-3 text-lg text-roulette-cream placeholder:text-roulette-gold/50 focus:border-roulette-gold focus:outline-none sm:px-5 sm:py-4 sm:text-xl"
			placeholder="Name"
			maxlength="20"
			aria-label="Name des Spielers"
			bind:value={name}
		/>
		<button class="btn !w-auto" type="submit" disabled={game.players.length >= MAX_PLAYERS}>
			Hinzufügen
		</button>
	</form>
	{#if error}
		<p class="mt-2 text-roulette-gold-light" role="alert">{error}</p>
	{/if}

	{#if game.players.length}
		<ul class="mt-4 flex flex-wrap gap-2">
			{#each game.players as player, i (player)}
				<li
					class="flex items-center gap-2 rounded-full bg-roulette-felt/60 py-1.5 pr-2 pl-4 ring-1 ring-roulette-gold/30"
				>
					<span class="font-semibold">{player}</span>
					<button
						class="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-black/20 text-sm hover:bg-roulette-bordeaux"
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
				class="flex-1 cursor-pointer rounded-xl border border-roulette-gold/30 bg-roulette-felt/40 py-3 text-center text-lg font-semibold transition hover:bg-roulette-felt/70 has-checked:border-transparent has-checked:bg-roulette-gold has-checked:text-roulette-bg has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-roulette-gold sm:py-4 sm:text-xl"
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
