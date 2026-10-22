<script lang="ts">
	import { game } from '$lib/game.svelte';

	const top = $derived(game.ranking[0]);
	const winners = $derived(
		game.ranking
			.filter((r) => r.roundsWon === top.roundsWon && r.votesReceived === top.votesReceived)
			.map((r) => r.name)
	);
</script>

<div class="text-center">
	<h1 class="text-4xl font-extrabold">Endergebnis</h1>
	<p class="mt-4 text-2xl font-extrabold text-cyan-300">
		Am ehesten: {winners.join(' & ')}
	</p>
	<p class="muted mt-1 text-sm">
		Wer die meisten Runden "gewonnen" hat, wurde am häufigsten gewählt.
	</p>
</div>

<ol class="mt-6 space-y-2">
	{#each game.ranking as entry, i (entry.name)}
		<li
			class="card flex items-center justify-between px-4 py-3 {i === 0
				? 'ring-2 ring-cyan-300/70'
				: ''}"
		>
			<span class="text-lg font-semibold">{i + 1}. {entry.name}</span>
			<span class="muted text-sm">
				{entry.roundsWon}
				{entry.roundsWon === 1 ? 'Runde' : 'Runden'} · {entry.votesReceived}
				{entry.votesReceived === 1 ? 'Stimme' : 'Stimmen'}
			</span>
		</li>
	{/each}
</ol>

<div class="mt-8 grid gap-3">
	<button class="btn btn-primary" onclick={() => game.playAgain()}
		>Nochmal mit denselben Spielern</button
	>
	<button class="btn" onclick={() => game.reset()}>Neues Spiel</button>
</div>
