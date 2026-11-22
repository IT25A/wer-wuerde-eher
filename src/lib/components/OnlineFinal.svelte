<script lang="ts">
	import { gameStateStore, playerIdStore, socketStore } from '$lib/socket-store';
	import OnlineChip from '$lib/components/OnlineChip.svelte';

	const ranking = $derived(
		$gameStateStore?.players.toSorted(
			(a, b) => b.roundsWon - a.roundsWon || b.votesTotal - a.votesTotal
		) ?? []
	);
	const top = $derived(ranking[0]);
	const winners = $derived(
		top
			? ranking
					.filter((p) => p.roundsWon === top.roundsWon && p.votesTotal === top.votesTotal)
					.map((p) => p.name)
			: []
	);
</script>

<section class="online-panel final">
	<h1 class="online-title">Endergebnis</h1>
	{#if winners.length > 0}
		<p class="final-winner">Am ehesten: {winners.join(' & ')}</p>
	{/if}
	<p class="subtitle">Wer die meisten Runden "gewonnen" hat, wurde am häufigsten gewählt.</p>

	<ol class="final-ranking">
		{#each ranking as player, i (player.id)}
			<li class={[i === 0 && 'winner', player.id === $playerIdStore && 'me']}>
				<span class="place">{i + 1}.</span>
				<OnlineChip id={player.id} name={player.name} size="1rem" />
				<span class="name">{player.name}</span>
				<span class="stats">
					{player.roundsWon}
					{player.roundsWon === 1 ? 'Runde' : 'Runden'} · {player.votesTotal}
					{player.votesTotal === 1 ? 'Stimme' : 'Stimmen'}
				</span>
			</li>
		{/each}
	</ol>

	<button type="button" class="online-primary" onclick={() => socketStore.leaveRoom()}>
		Zurück zum Online-Menü
	</button>
</section>

<style>
	.final {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		padding: 1.75rem clamp(1.25rem, 4vw, 2.5rem) 2rem;
		text-align: center;
	}

	.final-winner {
		font-size: clamp(2.25rem, 5vw, 3.25rem);
		color: var(--color10);
	}

	.subtitle {
		font-size: 1.2rem;
		color: var(--color20);
	}

	.final-ranking {
		display: grid;
		gap: 0.5rem;
		width: 100%;
		margin: 0.5rem 0;
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

	li.me .name {
		color: var(--color20);
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
		font-size: 1.75rem;
	}

	.stats {
		font-size: 1.2rem;
		color: hsla(0, 0%, 100%, 0.7);
		white-space: nowrap;
	}
</style>
