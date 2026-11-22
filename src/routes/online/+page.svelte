<script lang="ts">
	import { onMount } from 'svelte';
	import {
		socketStore,
		currentRoomStore,
		gameStateStore,
		errorMessageStore
	} from '$lib/socket-store';
	import OnlineSetup from '$lib/components/OnlineSetup.svelte';
	import OnlineLobby from '$lib/components/OnlineLobby.svelte';
	import OnlineVote from '$lib/components/OnlineVote.svelte';
	import OnlineResult from '$lib/components/OnlineResult.svelte';
	import OnlineFinal from '$lib/components/OnlineFinal.svelte';
	import OnlinePlayers from '$lib/components/OnlinePlayers.svelte';
	import OnlineChat from '$lib/components/OnlineChat.svelte';

	onMount(() => {
		socketStore.connect();
		return () => socketStore.disconnect();
	});

	const room = $derived($currentRoomStore);
	const game = $derived(room?.status === 'playing' ? $gameStateStore : null);
	const gameRunning = $derived(game !== null && game.phase !== 'final');

	const status = $derived.by(() => {
		if (!game) return 'Lobby';
		if (game.phase === 'final') return 'Endergebnis';
		const round = `Runde ${game.round} / ${game.totalRounds}`;
		return game.phase === 'voting' ? `${round} · Abstimmung` : `${round} · Ergebnis`;
	});

	function leave() {
		if (gameRunning && !confirm('Das laufende Spiel wirklich verlassen?')) return;
		socketStore.leaveRoom();
	}
</script>

<main class="online-shell">
	{#if $errorMessageStore}
		<div class="online-error" role="alert">{$errorMessageStore}</div>
	{/if}

	{#if !room}
		<OnlineSetup />
	{:else}
		<header class="online-panel room-bar">
			<div class="room-id">
				<span class="online-kicker">Room</span>
				<strong>{room.code}</strong>
			</div>
			<p class="room-status">{status}</p>
			<button type="button" class="online-danger" onclick={leave}>Room verlassen</button>
		</header>

		<div class="layout">
			<div class="stage">
				{#if !game}
					<OnlineLobby />
				{:else if game.phase === 'voting'}
					<OnlineVote />
				{:else if game.phase === 'result'}
					<OnlineResult />
				{:else}
					<OnlineFinal />
				{/if}
			</div>

			<aside class="side">
				<OnlinePlayers />
				<OnlineChat />
			</aside>
		</div>
	{/if}
</main>

<style>
	.online-error {
		width: min(100%, 34rem);
		margin: 0 auto;
		border: 1px solid var(--text-color);
		background: var(--color10dark);
		padding: 0.75rem 1rem;
		text-align: center;
		font-size: 1.3rem;
	}

	.room-bar {
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: center;
		gap: 1rem;
		padding: 0.75rem 1rem;
	}

	.room-id {
		display: flex;
		align-items: baseline;
		gap: 0.6rem;
	}

	.room-id strong {
		font-size: 2rem;
		letter-spacing: 0.2em;
	}

	.room-status {
		text-align: center;
		color: var(--color20);
	}

	.room-bar button {
		min-height: 2.5rem;
		padding: 0.25rem 1.25rem;
		font-size: 1.25rem;
	}

	/* Beide Spalten sind gleich hoch: die Hauptbox bestimmt die Höhe, die Seitenleiste passt sich an. */
	.layout {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 23rem;
		grid-template-rows: minmax(40rem, auto);
		gap: 1.5rem;
	}

	.stage {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	.stage > :global(.online-panel) {
		flex: 1;
		justify-content: center;
	}

	.side {
		display: grid;
		grid-template-rows: auto minmax(0, 1fr);
		gap: 1.5rem;
		height: 0;
		min-height: 100%;
	}

	@media (max-width: 900px) {
		.layout {
			grid-template-columns: minmax(0, 1fr);
			grid-template-rows: auto;
		}

		.side {
			height: auto;
			min-height: 0;
		}
	}

	@media (max-width: 560px) {
		.room-bar {
			grid-template-columns: 1fr auto;
		}

		.room-status {
			grid-column: 1 / -1;
			grid-row: 2;
		}
	}
</style>
