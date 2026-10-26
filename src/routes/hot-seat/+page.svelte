<script lang="ts">
	import { game } from '$lib/game.svelte';
	import Setup from '$lib/components/Setup.svelte';
	import PassDevice from '$lib/components/PassDevice.svelte';
	import Vote from '$lib/components/Vote.svelte';
	import Result from '$lib/components/Result.svelte';
	import Final from '$lib/components/Final.svelte';
</script>

<main class="game-stage">
	<div class="w-full max-w-xl sm:max-w-2xl md:max-w-3xl">
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
	</div>
</main>
