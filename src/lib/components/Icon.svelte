<script>
	let { name, size = 24, fill = 0, color = '#ffffff' } = $props();
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
	/>
</svelte:head>

<span
	class="material-symbols-outlined"
	style:font-size="{size}px"
	style:color
	style:font-variation-settings="'FILL' {fill}"
>
	{name}
</span>
