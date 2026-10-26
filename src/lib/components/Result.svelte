<script lang="ts">
	import { game } from '$lib/game.svelte';
	import Mascot from './Mascot.svelte';

	const isLast = $derived(game.round >= game.totalRounds);
	const maxVotes = $derived(Math.max(1, ...game.tally));
</script>

<div class="flex flex-col items-center text-center">
	<Mascot mimic="happy" caption="Das war's!" size="small" />

	<p class="muted text-sm tracking-widest uppercase sm:text-base">
		Runde {game.round} von {game.totalRounds}
	</p>
	<h1 class="mt-4 text-center text-2xl font-extrabold text-roulette-cream sm:text-3xl md:text-4xl">
		Wer würde eher {game.question}?
	</h1>

	<p
		class="mt-6 text-center text-2xl font-extrabold text-roulette-gold-light sm:text-3xl md:text-4xl"
	>
		{game.roundWinners.length > 1 ? 'Gleichstand' : 'Das war'}: {game.roundWinners.join(' & ')}
	</p>

	<ul class="card mt-6 w-full space-y-4">
		{#each game.players as player, i (player)}
			<li>
				<div class="flex justify-between text-base font-semibold text-roulette-cream sm:text-lg">
					<span>{player}</span>
					<span>{game.tally[i]}</span>
				</div>
				<div class="mt-1 h-3 rounded-full bg-roulette-bg/50 sm:h-4">
					<div
						class="h-3 rounded-full bg-gradient-to-r from-roulette-bordeaux to-roulette-gold transition-all sm:h-4"
						style:width="{(game.tally[i] / maxVotes) * 100}%"
					></div>
				</div>
			</li>
		{/each}
	</ul>

	<details class="muted mt-6 w-full text-left sm:text-base">
		<summary class="cursor-pointer">Wer hat wen gewählt?</summary>
		<ul class="mt-2 space-y-1">
			{#each game.votes as target, voter (voter)}
				<li>{game.players[voter]} → {game.players[target]}</li>
			{/each}
		</ul>
	</details>

	<button class="btn btn-primary mt-8 w-full" onclick={() => game.next()}>
		{isLast ? 'Endergebnis anzeigen' : 'Nächste Runde'}
	</button>
</div>
