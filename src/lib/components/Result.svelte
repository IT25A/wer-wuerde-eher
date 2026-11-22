<script lang="ts">
	import { game } from '$lib/game.svelte';
	import PlayerChip from '$lib/components/playerChip.svelte';

	const isLast = $derived(game.round >= game.totalRounds);
	const maxVotes = $derived(Math.max(1, ...game.tally));
	let playersByVotes = $derived(game.players.toSorted((a, b) => (b.votes ?? 0) - (a.votes ?? 0)));
</script>

<p class="muted result-round-label">
	Runde {game.round} von {game.totalRounds}
</p>
<h1 class="result-question">"Wer würde eher {game.question}?"</h1>

<p class="result-winner">
	{game.roundWinners.length > 1 ? 'Gleichstand' : 'Es ist'}:<wbr />
	{game.roundWinners.map((p) => p.name).join(' & ')}
</p>

<ul class="vote-counts">
	{#each playersByVotes as p (p.name)}
		<li>
			<PlayerChip player={p} style="font-size: 1rem;" />
			<div class="vote-row">
				<span class="result-votes">{p.name}: {p.votes}</span>
				{#if p.votes > 0}
					<div class="result-vote-bar" style:width="{(p.votes / maxVotes) * 100}%"></div>
				{/if}
			</div>
		</li>
	{/each}
</ul>

<br />

<details class="voting-details">
	<summary style="cursor: pointer">Wer hat wen gewählt?</summary>
	<ul class="player-votes">
		{#each game.players.toSorted((a, b) => (b.voted?.votes ?? 0) - (a.voted?.votes ?? 0)) as p (p.name)}
			<li class="player-list">{p.name} → {p.voted?.name || 'Niemand'}</li>
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
		display: grid;
		gap: 0.6rem;
		list-style: none;
		padding: 0;
		margin: 0;
		width: 100%;
	}
	.vote-counts li {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}
	.vote-row {
		flex: 1;
		min-width: 0;
		text-align: left;
	}
	.result-votes {
		font-size: 1.4rem;
	}

	.result-vote-bar {
		height: 1em;
		background: var(--color10);
		border-radius: 1em;
	}
	.voting-details {
		font-size: 2em;
		color: var(--color20);
		margin-bottom: 0.5em;
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

	.player-list {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 0.5rem;
		list-style: none;
		padding: 0;
		margin: 0;
		color: var(--color10);
	}

	#next-round-btn {
		font-size: 1.5rem;
		padding: 0.25rem 2rem;
	}
</style>
