<script lang="ts">
	import { game } from '$lib/game.svelte';

	const top = $derived(game.ranking[0]);
	const winners = $derived(
		game.ranking
			.filter((r) => r.roundsWon === top.roundsWon && r.votesReceived === top.votesReceived)
			.map((r) => r.name)
	);
</script>

<div class="final-summary">
	<h1 class="final-title">Endergebnis</h1>
	<p class="final-winner">
		Am ehesten: {winners.join(' & ')}
	</p>
	<p class="muted final-description">
		Wer die meisten Runden "gewonnen" hat, wurde am häufigsten gewählt.
	</p>
</div>

<ol class="final-ranking">
	{#each game.ranking as entry, i (entry.name)}
		<li class="card final-ranking-entry {i === 0 ? 'final-ranking-winner' : ''}">
			<span class="final-ranking-name">{i + 1}. {entry.name}</span>
			<span class="muted final-ranking-stats">
				{entry.roundsWon}
				{entry.roundsWon === 1 ? 'Runde' : 'Runden'} · {entry.votesReceived}
				{entry.votesReceived === 1 ? 'Stimme' : 'Stimmen'}
			</span>
		</li>
	{/each}
</ol>

<div class="final-actions">
	<button class="btn btn-primary final-play-again" onclick={() => game.playAgain()}
		>Nochmal mit denselben Spielern</button
	>
	<button class="btn final-new-game" onclick={() => game.reset()}>Neues Spiel</button>
</div>
