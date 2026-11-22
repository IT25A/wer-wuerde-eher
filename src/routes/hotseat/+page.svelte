<script lang="ts">
	import { game } from '$lib/game.svelte';
	import Setup from '$lib/components/Setup.svelte';
	import PassDevice from '$lib/components/PassDevice.svelte';
	import Vote from '$lib/components/Vote.svelte';
	import Result from '$lib/components/Result.svelte';
	import Final from '$lib/components/Final.svelte';

	// Wie "Room verlassen" im Online-Modus: jederzeit zurück, bei laufendem Spiel mit Rückfrage.
	function backToMenu() {
		const running = game.phase !== 'setup' && game.phase !== 'final';
		if (running && !confirm('Das laufende Spiel wirklich beenden?')) return;
		game.reset();
	}
</script>

<main class="page-box glow-box">
	{#if game.phase === 'setup'}
		<Setup />
	{:else if game.phase === 'pass'}
		<PassDevice />
	{:else if game.phase === 'vote'}
		<Vote />
	{:else if game.phase === 'result'}
		<Result />
	{:else}
		<Final />
	{/if}

	<button type="button" class="back-link link-button" onclick={backToMenu}>
		Zurück zum Hauptmenü
	</button>
</main>

<style>
	.link-button {
		border: none;
		background: none;
		padding: 0;
		text-decoration: underline;
	}
</style>
