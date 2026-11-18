<script lang="ts">
	import { game } from '$lib/game.svelte';
	import PlayerChip from '$lib/components/PlayerChip.svelte';
</script>

<p>
	Runde {game.round} von {game.totalRounds} · {game.voter.name} stimmt ab
</p>
<h1 class="vote-question-heading">
	Wer würde eher <span class="vote-question-highlight">{game.question}</span>?
</h1>

<div class="vote-player-list">
	{#each game.players as p (p.name)}
		<button class="vote-btn" onclick={() => game.vote(p)}>
			<PlayerChip player={p} allowRemove={false} />
		</button>
	{/each}
</div>

<style>
	.vote-player-list {
		display: flex;
		gap: 0.5rem;
		justify-content: center;
	}

	.vote-btn {
		background: none;
		border: none;
		cursor: pointer;
	}
	.vote-btn :global(.player-chip):hover {
		transform: scale(1.1);
	}
</style>
