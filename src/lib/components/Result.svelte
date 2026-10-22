<script lang="ts">
	import { game } from '$lib/game.svelte';

	const isLast = $derived(game.round >= game.totalRounds);
	const maxVotes = $derived(Math.max(1, ...game.tally));
</script>

<p class="text-green-600">Runde {game.round} von {game.totalRounds}</p>
<h1 class="mt-4 text-2xl font-bold">Wer würde eher {game.question}?</h1>

<p class="mt-6 text-xl text-green-300">
	{game.roundWinners.length > 1 ? 'Gleichstand' : 'Das war'}: {game.roundWinners.join(' & ')}
</p>

<ul class="mt-6 space-y-3">
	{#each game.players as player, i (player)}
		<li>
			<div class="flex justify-between">
				<span>{player}</span>
				<span>{game.tally[i]}</span>
			</div>
			<div class="mt-1 h-3 rounded bg-green-950">
				<div
					class="h-3 rounded bg-green-500 transition-all"
					style:width="{(game.tally[i] / maxVotes) * 100}%"
				></div>
			</div>
		</li>
	{/each}
</ul>

<details class="mt-6 text-green-600">
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
