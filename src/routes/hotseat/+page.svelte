<script lang="ts">
	import { game } from '$lib/game.svelte';
	import Setup from '$lib/components/Setup.svelte';
	import PassDevice from '$lib/components/PassDevice.svelte';
	import Vote from '$lib/components/Vote.svelte';
	import Result from '$lib/components/Result.svelte';
	import Final from '$lib/components/Final.svelte';
	import HotseatChat from '$lib/components/HotseatChat.svelte';
</script>

<main
	class="mx-auto grid min-h-screen max-w-6xl items-center gap-8 px-4 py-8 lg:grid-cols-[minmax(0,1fr)_20rem]"
>
	<section class="mx-auto w-full max-w-xl lg:max-w-none">
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
	</section>

	<HotseatChat />
</main>
