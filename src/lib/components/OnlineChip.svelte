<script lang="ts">
	import { currentRoomStore } from '$lib/socket-store';

	// Runder Spieler-Chip wie im Hot Seat (playerChip.svelte); die Farbe vergibt der Server.
	let { id, name, size = '1rem' }: { id: string; name: string; size?: string } = $props();

	const color = $derived(
		$currentRoomStore?.players.find((p) => p.id === id)?.color ?? 'var(--color70light)'
	);
</script>

<span class="chip" style:--player-color={color} style:font-size={size} aria-hidden="true">
	{name.substring(0, 2).toUpperCase()}
</span>

<style>
	.chip {
		display: inline-flex;
		flex: none;
		align-items: center;
		justify-content: center;
		width: 2em;
		height: 2em;
		border-radius: 50%;
		background-color: var(--player-color);
		text-shadow: 0 0 4px rgba(0, 0, 0, 0.6);
		transition: box-shadow 0.1s ease-out;
	}
</style>
