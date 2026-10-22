<script lang="ts">
	import { game } from '$lib/game.svelte';

	const top = $derived(game.ranking[0]);
	const winners = $derived(
		game.ranking
			.filter((r) => r.roundsWon === top.roundsWon && r.votesReceived === top.votesReceived)
			.map((r) => r.name)
	);
</script>

<h1 class="text-4xl font-bold">Endergebnis</h1>
<p class="mt-4 text-xl text-green-300">
	Am ehesten: {winners.join(' & ')}
</p>
<p class="mt-1 text-sm text-green-600">
	Wer die meisten Runden "gewonnen" hat, wurde am häufigsten gewählt.
</p>

<ol class="mt-6 space-y-2">
	{#each game.ranking as entry, i (entry.name)}
		<li class="flex items-center justify-between rounded border border-green-700 px-3 py-2">
			<span class="text-lg">{i + 1}. {entry.name}</span>
			<span class="text-sm text-green-600">
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
