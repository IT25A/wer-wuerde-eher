<script lang="ts">
	import { game } from '$lib/game.svelte';
	import Setup from '$lib/components/Setup.svelte';
	import PassDevice from '$lib/components/PassDevice.svelte';
	import Vote from '$lib/components/Vote.svelte';
	import Result from '$lib/components/Result.svelte';
	import Final from '$lib/components/Final.svelte';
</script>

<main class="hotseat-game-shell glow-box">
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
</main>

<style>
	main{
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: min(80%, 550px);
		padding: 1.5rem;
		border-radius: 1rem;
	}
</style>