<script lang="ts">
	import { game } from '$lib/game.svelte';
	import Mascot from './Mascot.svelte';

	const rounds = $derived(Array.from({ length: game.totalRounds }, (_, i) => i));
</script>

<div class="flex flex-col items-center text-center">
	<div class="flex items-center gap-1.5" aria-hidden="true">
		{#each rounds as step (step)}
			<span
				class="h-2 w-8 rounded-full transition-colors sm:h-2.5 sm:w-10 {step < game.round
					? 'bg-roulette-gold'
					: 'bg-roulette-gold/15'}"
			></span>
		{/each}
	</div>
	<p class="muted mt-2 text-sm tracking-widest uppercase sm:text-base">
		Runde {game.round} von {game.totalRounds}
	</p>

	<Mascot mimic="challenging" caption="Gib das Gerät weiter..." size="small" />

	<h1 class="muted mt-6 text-lg sm:text-2xl">Gib das Gerät an</h1>

	<div
		class="mt-4 flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-roulette-bordeaux to-roulette-gold text-6xl font-extrabold text-roulette-cream shadow-2xl ring-4 shadow-black/50 ring-roulette-gold/30 sm:h-40 sm:w-40 sm:text-7xl md:h-48 md:w-48 md:text-8xl"
		aria-hidden="true"
	>
		{game.voter.charAt(0).toUpperCase()}
	</div>
	<p
		class="mt-5 text-4xl font-extrabold wrap-break-word text-roulette-cream sm:text-5xl md:text-6xl"
	>
		{game.voter}
	</p>

	<p class="card muted my-8 max-w-xs px-4 py-3 text-sm sm:max-w-sm sm:text-base">
		Die anderen schauen bitte kurz weg. Die Frage und die Abstimmung sind geheim.
	</p>

	<button class="btn btn-primary w-full" onclick={() => game.reveal()}>
		Ich bin {game.voter}
	</button>
</div>
