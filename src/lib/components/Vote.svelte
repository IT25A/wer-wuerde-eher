<script lang="ts">
	import { game } from '$lib/game.svelte';
</script>

<p class="muted text-center text-sm tracking-widest uppercase">
	Runde {game.round} von {game.totalRounds} · {game.voter.name} stimmt ab
</p>
<h1 class="mt-4 text-center text-3xl font-extrabold">
	Wer würde eher <span
		class="bg-linear-to-r from-violet-300 to-cyan-300 bg-clip-text text-transparent"
		>{game.question}</span
	>
</h1>

<div class="mt-8 grid gap-3">
	{#each game.players as p (p.name)}
		<button class="btn" onclick={() => game.vote(p)}>{p.name}</button>
	{/each}
</div>
