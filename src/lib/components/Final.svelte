<script lang="ts">
	import { game } from '$lib/game.svelte';
	import Mascot from './Mascot.svelte';

	const top = $derived(game.ranking[0]);
	const winners = $derived(
		game.ranking
			.filter((r) => r.roundsWon === top.roundsWon && r.votesReceived === top.votesReceived)
			.map((r) => r.name)
	);
</script>

<div class="flex flex-col items-center text-center">
	<Mascot mimic="celebrating" caption="Wir haben einen Gewinner!" size="small" />

	<h1 class="text-4xl font-extrabold text-roulette-cream sm:text-5xl md:text-6xl">Endergebnis</h1>
	<p class="mt-4 text-2xl font-extrabold text-roulette-gold-light sm:text-3xl md:text-4xl">
		Am ehesten: {winners.join(' & ')}
	</p>
	<p class="muted mt-1 text-sm sm:text-base">
		Wer die meisten Runden "gewonnen" hat, wurde am häufigsten gewählt.
	</p>
</div>

<ol class="mt-6 w-full space-y-2">
	{#each game.ranking as entry, i (entry.name)}
		<li
			class="card flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 {i === 0
				? 'ring-2 ring-roulette-gold/70'
				: ''}"
		>
			<span class="text-lg font-semibold text-roulette-cream sm:text-xl md:text-2xl"
				>{i + 1}. {entry.name}</span
			>
			<span class="muted text-sm sm:text-base">
				{entry.roundsWon}
				{entry.roundsWon === 1 ? 'Runde' : 'Runden'} · {entry.votesReceived}
				{entry.votesReceived === 1 ? 'Stimme' : 'Stimmen'}
			</span>
		</li>
	{/each}
</ol>

<div class="mt-8 grid w-full gap-3">
	<button class="btn btn-primary" onclick={() => game.playAgain()}
		>Nochmal mit denselben Spielern</button
	>
	<button class="btn" onclick={() => game.reset()}>Neues Spiel</button>
</div>
