<script lang="ts">
	import "$lib/themes/shellshockTheme.css"
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<title>Wer würde eher?</title>
	<link rel="icon" href={favicon} />
	<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet">
</svelte:head>
{@render children()}
