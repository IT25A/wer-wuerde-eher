<script lang="ts">
	import { game, MAX_PLAYERS, MIN_PLAYERS, ROUND_OPTIONS } from '$lib/game.svelte';
	import { questions } from '$lib/questions';

	let name = $state('');
	let error = $state('');

	function add(event: SubmitEvent) {
		event.preventDefault();
		error = game.addPlayer(name) ?? '';
		if (!error) name = '';
	}
</script>

<h1 class="text-4xl font-bold">Wer würde eher?</h1>
<p class="mt-2 text-green-600">
	Alle spielen an einem Gerät. Tragt eure Namen ein, danach wird das Gerät reihum weitergegeben.
</p>

<form class="mt-8 flex gap-2" onsubmit={add}>
	<input
		class="min-w-0 flex-1 rounded border-2 border-green-500 bg-black px-3 py-3 text-lg text-green-400 placeholder:text-green-800"
		placeholder="Name"
		maxlength="20"
		aria-label="Name des Spielers"
		bind:value={name}
	/>
	<button class="btn" type="submit" disabled={game.players.length >= MAX_PLAYERS}>Hinzufügen</button
	>
</form>
{#if error}
	<p class="mt-2 text-red-400" role="alert">{error}</p>
{/if}

<ul class="mt-6 space-y-2">
	{#each game.players as player, i (player)}
		<li class="flex items-center justify-between rounded border border-green-700 px-3 py-2">
			<span class="text-lg">{player}</span>
			<button
				class="cursor-pointer text-green-600 hover:text-red-400"
				aria-label="{player} entfernen"
				onclick={() => game.removePlayer(i)}>✕</button
			>
		</li>
	{/each}
</ul>
<p class="mt-2 text-sm text-green-700">
	{game.players.length} / {MAX_PLAYERS} Spieler (mindestens {MIN_PLAYERS})
</p>

<fieldset class="mt-8">
	<legend class="mb-2 text-green-600">Anzahl Runden</legend>
	<div class="flex gap-2">
		{#each ROUND_OPTIONS.filter((n) => n <= questions.length) as option (option)}
			<label
				class="flex-1 cursor-pointer rounded border-2 border-green-700 py-2 text-center has-checked:border-green-400 has-checked:bg-green-500 has-checked:text-black"
			>
				<input
					class="sr-only"
					type="radio"
					name="rounds"
					value={option}
					bind:group={game.totalRounds}
				/>
				{option}
			</label>
		{/each}
	</div>
</fieldset>

<button class="btn btn-primary mt-8 w-full" disabled={!game.canStart} onclick={() => game.start()}>
	Spiel starten
</button>
