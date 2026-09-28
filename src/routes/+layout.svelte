<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}

<style>
	:global(body) {
		margin: 0;
		font-family: consolas, monaco, monospace;
		background-color: black;
		color: green;
	}
	:global(h1) {
		font-size: 3rem;
	}
</style>
