<script lang="ts">
	import { game } from '$lib/game.svelte';

	const isLast = $derived(game.round >= game.totalRounds);
	const maxVotes = $derived(Math.max(1, ...game.tally));
</script>

<p class="muted result-round-label">
	Runde {game.round} von {game.totalRounds}
</p>
<h1 class="result-question-heading">Wer würde eher {game.question}?</h1>

<p class="result-winner-summary">
	{game.roundWinners.length > 1 ? 'Gleichstand' : 'Das war'}: {game.roundWinners
		.map((p) => p.name)
		.join(' & ')}
</p>

<ul class="card result-vote-list">
	{#each game.players as p (p.name)}
		<li>
			<div class="result-player-votes">
				<span>{p.name}</span>
				<span>{p.votes}</span>
			</div>
			<div class="result-vote-track">
				<div class="result-vote-bar" style:width="{(p.votes / maxVotes) * 100}%"></div>
			</div>
		</li>
	{/each}
</ul>

<details class="muted result-voter-details">
	<summary class="result-voter-summary">Wer hat wen gewählt?</summary>
	<ul class="result-voter-list">
		{#each game.players as p (p.name)}
			<li>{p.name} → {p.voted?.name || 'Niemand'}</li>
		{/each}
	</ul>
</details>

<button class="btn btn-primary result-next-action" onclick={() => game.next()}>
	{isLast ? 'Endergebnis anzeigen' : 'Nächste Runde'}
</button>
