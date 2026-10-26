<script lang="ts">
	import { game } from '$lib/game.svelte';
	import Mascot from './Mascot.svelte';
</script>

<div class="flex flex-col items-center text-center">
	<Mascot mimic="thinking" size="small" />

	<p class="muted text-sm tracking-widest uppercase sm:text-base">
		Runde {game.round} von {game.totalRounds} · {game.voter} stimmt ab
	</p>
	<h1 class="mt-4 text-center text-3xl font-extrabold text-roulette-cream sm:text-4xl md:text-5xl">
		Wer würde eher <span class="text-roulette-gold-light">{game.question}</span>?
	</h1>

	<div class="mt-8 grid w-full gap-3">
		{#each game.players as player, i (player)}
			<button class="btn" onclick={() => game.vote(i)}>{player}</button>
		{/each}
	</div>
</div>
