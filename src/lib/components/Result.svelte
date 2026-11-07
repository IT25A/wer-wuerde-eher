<script lang="ts">
	import { game } from '$lib/game.svelte';

	const isLast = $derived(game.round >= game.totalRounds);
	const maxVotes = $derived(Math.max(1, ...game.tally));
</script>

<p class="muted result-round-label">
	Runde {game.round} von {game.totalRounds}
</p>
<h1 class="result-question">"Wer würde eher {game.question}?"</h1>

<p class="result-winner">
	{game.roundWinners.length > 1 ? 'Gleichstand' : 'Es ist'}:<wbr> {game.roundWinners
		.map((p) => p.name)
		.join(' & ')}
</p>

<ul class="vote-counts">
	{#each game.players as p (p.name)}
		<li>
			<div class="result-votes">
				<span>{p.name}: </span>
				<span>{p.votes}</span>
			</div>
			{#if p.votes > 0}
			<div class="result-vote-bar" style:width="{(p.votes / maxVotes) * 100}%"></div>
			{/if}
		</li>
	{/each}
</ul>

<br>

<details class="voting-details">
	<summary>Wer hat wen gewählt?</summary>
	<ul class="player-votes">
		{#each game.players.toSorted((a, b) => (b.voted?.votes ?? 0) - (a.voted?.votes ?? 0)) as p (p.name)}
			<li id = player-list>{p.name} → {p.voted?.name || 'Niemand'}</li>
		{/each}
	</ul>
</details>

<button style="font-size: 1.5em" onclick={() => game.next()} id="next-round-btn">
	{isLast ? 'Endergebnis anzeigen' : 'Nächste Runde'}
</button>

<style>
.result-question {
		font-size: 2.5em;
		font-style: italic;
		margin-bottom: 1rem;
	}
	.result-winner {
		font-size: 4em;
		margin-bottom: 1rem;
	}
	.vote-counts {
		list-style: none;
		justify-content: space-between;
		padding: 0;
		margin: 0;
		width: 100%;
	}
	.result-votes {
		list-style: none;
		padding: 0;
		margin: 0;
		width: 100%;
		max-width: 600px;
	}

	.result-vote-bar {
		height: 1em;
		background: var(--color10	);
		border-radius: 1em;
	}
	.voting-details {
		font-size: 2em;
		color: var(--color20);
		margin-bottom: .5em;
	}
	.player-votes {
		list-style: none;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 0;
		margin: 0;
		width: 100%;
		max-width: 600px;
	}
	.player-votes li {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	#player-list{
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: .5rem;
		list-style: none;
		padding: 0;
		margin: 0;
		color: var(--color30);
	}

	#next-round-btn{
		font-size: 1.5rem;
		padding: .25rem 2rem;
	}
</style>