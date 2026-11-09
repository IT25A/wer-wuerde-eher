<script lang="ts">
	import { game } from '$lib/game.svelte';

	const isLast = $derived(game.round >= game.totalRounds);
	const maxVotes = $derived(Math.max(1, ...game.tally));
</script>

<p class="muted text-center text-sm tracking-widest uppercase">
	Runde {game.round} von {game.totalRounds}
</p>
<h1 class="mt-4 text-center text-2xl font-extrabold">Wer würde eher {game.question}</h1>

<p class="mt-6 text-center text-2xl font-extrabold text-cyan-300">
	{game.roundWinners.length > 1 ? 'Gleichstand' : 'Das war'}: {game.roundWinners
		.map((p) => p.name)
		.join(' & ')}
</p>

<ul class="card mt-6 space-y-4 p-5">
	{#each game.players as p (p.name)}
		<li>
			<div class="flex justify-between font-semibold">
				<span>{p.name}</span>
				<span>{p.votes}</span>
			</div>
			<div class="mt-1 h-3 rounded-full bg-black/25">
				<div
					class="h-3 rounded-full bg-linear-to-r from-violet-500 to-cyan-400 transition-all"
					style:width="{(p.votes / maxVotes) * 100}%"
				></div>
			</div>
		</li>
	{/each}
</ul>

<details class="muted mt-6">
	<summary class="cursor-pointer">Wer hat wen gewählt?</summary>
	<ul class="mt-2 space-y-1">
		{#each game.players as p (p.name)}
			<li>{p.name} → {p.voted?.name || 'Niemand'}</li>
		{/each}
	</ul>
</details>

<button class="btn btn-primary mt-8 w-full" onclick={() => game.next()}>
	{isLast ? 'Endergebnis anzeigen' : 'Nächste Runde'}
</button>
