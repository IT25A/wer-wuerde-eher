<script lang="ts">
	import { game } from '$lib/game.svelte';
	import Setup from '$lib/components/Setup.svelte';
	import PassDevice from '$lib/components/PassDevice.svelte';
	import Vote from '$lib/components/Vote.svelte';
	import Result from '$lib/components/Result.svelte';
	import Final from '$lib/components/Final.svelte';
</script>

<main class="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-4 py-8 text-green-400">
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
