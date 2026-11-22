<script lang="ts">
	import { currentRoomStore, gameStateStore, playerIdStore, socketStore } from '$lib/socket-store';
	import OnlineChip from '$lib/components/OnlineChip.svelte';

	const game = $derived($gameStateStore);
	const myId = $derived($playerIdStore);
	const hasVoted = $derived(myId !== null && (game?.votedPlayerIds.includes(myId) ?? false));
	const isHost = $derived($currentRoomStore?.hostId === myId);
	const voteCount = $derived(game?.votedPlayerIds.length ?? 0);
	const playerCount = $derived(game?.players.length ?? 0);
	const candidates = $derived(game?.players.filter((p) => p.id !== myId) ?? []);
</script>

{#if game}
	<section class="online-panel vote">
		<p>Runde {game.round} von {game.totalRounds}</p>
		<h1 class="question">Wer würde eher {game.question}?</h1>

		{#if !hasVoted}
			<p class="subtitle">Wähle eine Person</p>
			<div class="vote-player-list">
				{#each candidates as player (player.id)}
					<button type="button" class="vote-btn" onclick={() => socketStore.vote(player.id)}>
						<OnlineChip id={player.id} name={player.name} size="2.5rem" />
						<span class="vote-name">{player.name}</span>
					</button>
				{/each}
			</div>
		{:else}
			<p class="voted">Deine Stimme ist abgegeben.</p>
			<p class="subtitle">Warte auf die anderen Spieler …</p>
		{/if}

		<div class="vote-progress" aria-label="{voteCount} von {playerCount} Stimmen abgegeben">
			{#each game.players as player (player.id)}
				<span
					class={['vote-segment', game.votedPlayerIds.includes(player.id) && 'done']}
					title={player.name}
				></span>
			{/each}
		</div>
		<p class="vote-count">{voteCount} / {playerCount} Stimmen</p>

		{#if isHost}
			<button
				type="button"
				class="online-secondary abort"
				onclick={() => socketStore.abortVoting()}
			>
				Abstimmung jetzt beenden
			</button>
		{/if}
	</section>
{/if}

<style>
	.vote {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		padding: 1.75rem clamp(1.25rem, 4vw, 2.5rem) 2rem;
		text-align: center;
	}

	.question {
		font-size: clamp(2.5rem, 5vw, 4rem);
		line-height: 1.1;
	}

	.subtitle {
		color: var(--color20);
	}

	.vote-player-list {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 1.25rem 1.5rem;
		margin: 0.5rem 0;
	}

	.vote-btn {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.4rem;
		border: none;
		background: none;
		padding: 0;
	}

	.vote-btn :global(.chip) {
		transition:
			transform 0.1s ease-out,
			box-shadow 0.1s ease-out;
	}

	.vote-btn:hover :global(.chip),
	.vote-btn:focus-visible :global(.chip) {
		transform: scale(1.1);
		box-shadow: inset 0 0 0 3px white;
	}

	.vote-name {
		max-width: 9rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 1.5rem;
	}

	.voted {
		margin-top: 0.5rem;
		font-size: 2.5rem;
		color: var(--color30);
	}

	.vote-progress {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.5rem;
		margin-top: 0.5rem;
	}

	.vote-segment {
		width: 1rem;
		height: 1rem;
		border-radius: 50%;
		background: #ccc;
	}

	.vote-segment.done {
		background: var(--color10);
	}

	.vote-count {
		margin-top: -0.5rem;
		font-size: 1.2rem;
		color: hsla(0, 0%, 100%, 0.7);
	}

	.abort {
		font-size: 1.25rem;
	}
</style>
