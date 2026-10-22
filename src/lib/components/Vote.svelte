<script lang="ts">
	import { game } from '$lib/game.svelte';
</script>

<p class="text-green-600">
	Runde {game.round} von {game.totalRounds} · {game.voter} stimmt ab
</p>
<h1 class="mt-4 text-3xl font-bold">Wer würde eher {game.question}?</h1>

<div class="mt-8 grid gap-3">
	{#each game.players as player, i (player)}
		<button class="btn" onclick={() => game.vote(i)}>{player}</button>
	{/each}
</div>
