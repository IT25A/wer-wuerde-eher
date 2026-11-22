<script lang="ts">
	import { currentRoomStore, gameStateStore, playerIdStore, socketStore } from '$lib/socket-store';
	import OnlineChip from '$lib/components/OnlineChip.svelte';

	const game = $derived($gameStateStore);
	const isHost = $derived($currentRoomStore?.hostId === $playerIdStore);
	const isLast = $derived(game ? game.round >= game.totalRounds : false);
	const maxVotes = $derived(Math.max(0, ...(game?.players.map((p) => p.votes) ?? [])));
	const ranked = $derived(game?.players.toSorted((a, b) => b.votes - a.votes) ?? []);
	const winners = $derived(maxVotes > 0 ? ranked.filter((p) => p.votes === maxVotes) : []);
</script>

{#if game}
	<section class="online-panel result">
		<p>Runde {game.round} von {game.totalRounds}</p>
		<h1 class="result-question">"Wer würde eher {game.question}?"</h1>

		<p class="result-winner">
			{#if winners.length === 0}
				Keine Stimmen
			{:else}
				{winners.length > 1 ? 'Gleichstand' : 'Es ist'}:<wbr />
				{winners.map((p) => p.name).join(' & ')}
			{/if}
		</p>

		<ul class="vote-counts">
			{#each ranked as player (player.id)}
				<li>
					<OnlineChip id={player.id} name={player.name} size="1rem" />
					<div class="vote-row">
						<span class="result-votes">{player.name}: {player.votes}</span>
						{#if player.votes > 0}
							<div class="result-vote-bar" style:width="{(player.votes / maxVotes) * 100}%"></div>
						{/if}
					</div>
				</li>
			{/each}
		</ul>

		{#if isHost}
			<button type="button" class="online-secondary next" onclick={() => socketStore.nextRound()}>
				{isLast ? 'Endergebnis anzeigen' : 'Nächste Runde'}
			</button>
		{:else}
			<p class="subtitle">Warte auf den Host …</p>
		{/if}
	</section>
{/if}

<style>
	.result {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		padding: 1.75rem clamp(1.25rem, 4vw, 2.5rem) 2rem;
		text-align: center;
	}

	.result-question {
		font-size: clamp(2rem, 4vw, 2.75rem);
		font-style: italic;
		line-height: 1.1;
	}

	.result-winner {
		font-size: clamp(2.75rem, 6vw, 4rem);
		line-height: 1.1;
	}

	.vote-counts {
		display: grid;
		gap: 0.6rem;
		width: 100%;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	li {
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
		border-radius: 1em;
		background: var(--color10);
		transition: width 0.35s ease;
	}

	.subtitle {
		color: var(--color20);
	}

	.next {
		margin-top: 0.5rem;
	}
</style>
