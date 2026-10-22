<script lang="ts">
	import { game } from '$lib/game.svelte';
</script>

<div class="flex flex-col items-center text-center">
	<div class="flex items-center gap-1.5" aria-hidden="true">
		{#each { length: game.totalRounds } as _, i}
			<span
				class="h-1.5 w-6 rounded-full transition-colors {i < game.round
					? 'bg-cyan-300'
					: 'bg-white/15'}"
			></span>
		{/each}
	</div>
	<p class="muted mt-2 text-sm tracking-widest uppercase">
		Runde {game.round} von {game.totalRounds}
	</p>

	<h1 class="muted mt-10 text-lg">Gib das Gerät an</h1>

	<div
		class="mt-6 flex h-28 w-28 items-center justify-center rounded-full bg-linear-to-br from-violet-500 to-cyan-400 text-6xl font-extrabold text-white shadow-2xl ring-4 shadow-violet-900/50 ring-white/20"
		aria-hidden="true"
	>
		{game.voter.charAt(0).toUpperCase()}
	</div>
	<p class="mt-5 text-4xl font-extrabold wrap-break-word">{game.voter}</p>

	<p class="card muted my-10 max-w-xs px-4 py-3 text-sm">
		Die anderen schauen bitte kurz weg. Die Frage und die Abstimmung sind geheim.
	</p>

	<button class="btn btn-primary w-full" onclick={() => game.reveal()}>
		Ich bin {game.voter}
	</button>
</div>
