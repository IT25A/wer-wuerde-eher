<script lang="ts">
	import { game, type Player } from '$lib/game.svelte';
	let {
		player,
		allowRemove = false,
		style
	}: { player: Player; allowRemove?: boolean; style?: string } = $props();
</script>

<span
	class="player-chip"
	style={`--player-color: ${player.color || 'var(--default-color)'}; ${style || ''}`}
>
	<span class="player-name">{player.name.substring(0, 2).toUpperCase()}</span>
	{#if allowRemove}
		<button
			class="player-remove"
			aria-label="{player} entfernen"
			onclick={() => game.removePlayer(player)}>✕</button
		>
	{/if}
	<span class="full-name">{player.name}</span>
</span>

<style>
	:root {
		--default-color: rgb(255, 0, 0);
	}
	.player-chip {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		position: relative;
		width: 2em;
		height: 2em;
		font-size: 2.5em;
		border-radius: 50%;
		background-color: var(--player-color);
		transition: all 0.1s ease-out;
	}
	.player-chip:hover {
		box-shadow: inset 0 0 0px 3px white;
	}
	.player-remove {
		position: absolute;
		right: 0;
		top: 0;
		background: none;
		border: none;
		color: white;
		font-size: 1rem;
		cursor: pointer;
	}
	.full-name {
		opacity: 0;
		position: absolute;
		font-size: 0.6em;
		bottom: -0.4em;
		transition: opacity 0.2s ease-out;
		background-color: var(--bg-color);
		padding: 0.1em 0.3em;
		border-radius: 0.3em;
		box-shadow: inset 0 0 0px 1.5px white;
	}
	.player-chip:hover .full-name {
		opacity: 1;
	}
	.player-name {
		text-shadow: 0 0 5 px rgba(0, 0, 0, 1);
	}
</style>
