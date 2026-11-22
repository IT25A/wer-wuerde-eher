<script lang="ts">
	import { game } from '$lib/game.svelte';
	import PlayerChip from '$lib/components/playerChip.svelte';

	const top = $derived(game.ranking[0]);
	const winners = $derived(
		game.ranking
			.filter((r) => r.roundsWon === top.roundsWon && r.votesReceived === top.votesReceived)
			.map((r) => r.name)
	);
	let isStarting = $state(false);
	let error = $state('');

	async function playAgain() {
		isStarting = true;
		error = (await game.playAgain()) ?? '';
		isStarting = false;
	}
</script>

<h1 class="final-title">Endergebnis</h1>
<p class="final-winner">Am ehesten: {winners.join(' & ')}</p>
<p class="final-description">Wer die meisten Runden "gewonnen" hat, wurde am häufigsten gewählt.</p>

<ol class="final-ranking">
	{#each game.ranking as entry, i (entry.name)}
		{@const player = game.players.find((p) => p.name === entry.name)}
		<li class={[winners.includes(entry.name) && 'winner']}>
			<span class="place">{i + 1}.</span>
			{#if player}
				<PlayerChip {player} style="font-size: 1rem;" />
			{/if}
			<span class="name">{entry.name}</span>
			<span class="stats">
				{entry.roundsWon}
				{entry.roundsWon === 1 ? 'Runde' : 'Runden'} · {entry.votesReceived}
				{entry.votesReceived === 1 ? 'Stimme' : 'Stimmen'}
			</span>
		</li>
	{/each}
</ol>

<div class="final-actions">
	<button class="online-primary" onclick={playAgain} disabled={isStarting} id="play-again-btn">
		{isStarting ? 'Fragen werden geladen …' : 'Nochmal mit denselben Spielern'}
	</button>
	<button class="online-secondary" onclick={() => game.backToSetup()} id="new-game-btn">
		Einstellungen ändern
	</button>
</div>
{#if error}
	<p class="error-text" role="alert">{error}</p>
{/if}

<style>
	.final-title {
		font-size: clamp(2.75rem, 6vw, 4rem);
	}

	.final-winner {
		font-size: clamp(2rem, 5vw, 3rem);
		color: var(--color10);
	}

	.final-description {
		font-size: 1.2rem;
		color: var(--color20);
	}

	.final-ranking {
		display: grid;
		gap: 0.5rem;
		width: 100%;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	li {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		border: 1px solid hsla(0, 0%, 100%, 0.35);
		padding: 0.4rem 0.75rem;
	}

	li.winner {
		border-color: var(--color10);
		box-shadow: 0 0 16px color-mix(in srgb, var(--color10) 50%, transparent);
	}

	.place {
		width: 2rem;
		font-size: 1.75rem;
	}

	.name {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		text-align: left;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 1.6rem;
	}

	.stats {
		font-size: 1.15rem;
		color: hsla(0, 0%, 100%, 0.7);
		white-space: nowrap;
	}

	.final-actions {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.75rem;
	}

	.final-actions button {
		font-size: 1.3rem;
		padding: 0.25rem 1.25rem;
	}
</style>
