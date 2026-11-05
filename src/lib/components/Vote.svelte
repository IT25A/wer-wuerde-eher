<script lang="ts">
	import { game } from '$lib/game.svelte';
</script>

<p class="muted vote-round-label">
	Runde {game.round} von {game.totalRounds} · {game.voter.name} stimmt ab
</p>
<h1 class="vote-question-heading">
	Wer würde eher <span class="vote-question-highlight">{game.question}</span>?
</h1>

<div class="vote-player-list">
	{#each game.players as p (p.name)}
		<button class="btn" onclick={() => game.vote(p)}>{p.name}</button>
	{/each}
</div>
