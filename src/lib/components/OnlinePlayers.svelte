<script lang="ts">
	import { currentRoomStore, gameStateStore, playerIdStore, socketStore } from '$lib/socket-store';
	import OnlineChip from '$lib/components/OnlineChip.svelte';
	import { MAX_PLAYERS_PER_ROOM } from '../../../shared/room-types';

	const room = $derived($currentRoomStore);
	const isHost = $derived(room !== null && room.hostId === $playerIdStore);
	const inGame = $derived(room?.status === 'playing' && $gameStateStore !== null);
	const votedIds = $derived(
		$gameStateStore?.phase === 'voting' ? $gameStateStore.votedPlayerIds : []
	);
	const points = $derived(new Map($gameStateStore?.players.map((p) => [p.id, p.roundsWon]) ?? []));

	function kick(id: string, name: string) {
		if (confirm(`${name} wirklich aus dem Room entfernen?`)) socketStore.kickPlayer(id);
	}
</script>

{#if room}
	<section class="online-panel players">
		<h2>Spieler</h2>
		<p class="count">{room.players.length} / {MAX_PLAYERS_PER_ROOM} Spieler</p>

		<ul>
			{#each room.players as player (player.id)}
				<li class={[player.id === $playerIdStore && 'me']}>
					<OnlineChip id={player.id} name={player.name} size="1.1rem" />
					<span class="name">
						{player.name}
						{#if player.id === $playerIdStore}<small>(du)</small>{/if}
					</span>
					{#if player.id === room.hostId}<span class="tag host">Host</span>{/if}
					{#if votedIds.includes(player.id)}
						<span class="tag voted" title="Hat abgestimmt">✓</span>
					{/if}
					{#if inGame && points.has(player.id)}
						<span class="tag points" title="Gewonnene Runden">{points.get(player.id)}</span>
					{/if}
					{#if isHost && player.id !== $playerIdStore}
						<button
							type="button"
							class="kick"
							title="Aus dem Room entfernen"
							aria-label="{player.name} aus dem Room entfernen"
							onclick={() => kick(player.id, player.name)}
						>
							✕
						</button>
					{/if}
				</li>
			{/each}
		</ul>
	</section>
{/if}

<style>
	.players {
		padding: 1rem 1.25rem;
	}

	h2 {
		font-size: 2rem;
	}

	.count {
		margin-bottom: 0.75rem;
		text-align: center;
		font-size: 1.15rem;
		color: var(--color20);
	}

	ul {
		display: grid;
		gap: 0.5rem;
		max-height: 12rem;
		overflow-y: auto;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	li {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		padding: 0.15rem 0.25rem;
	}

	.name {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 1.4rem;
	}

	li.me .name {
		color: var(--color20);
	}

	.name small {
		color: hsla(0, 0%, 100%, 0.55);
		font-size: 1rem;
	}

	.tag {
		flex: none;
		border: 1px solid var(--text-color);
		padding: 0 0.4rem;
		font-size: 1rem;
	}

	.host {
		background: var(--color30);
	}

	.voted {
		background: var(--color20dark);
	}

	.points {
		background: var(--bg-color);
	}

	.kick {
		flex: none;
		width: 1.9rem;
		height: 1.9rem;
		padding: 0;
		background: var(--color10);
		font-size: 1rem;
	}
</style>
