<script lang="ts">
    import { onMount } from 'svelte';
    import { socketStore, currentRoomStore, gameStateStore } from '$lib/socket-store';
    import OnlineSetup from '$lib/components/OnlineSetup.svelte';
    import OnlineVote from '$lib/components/OnlineVote.svelte';
    import OnlineResult from '$lib/components/OnlineResult.svelte';
    import OnlineFinal from '$lib/components/OnlineFinal.svelte';
    import type { GameState, Room } from '../../../shared/room-types';

    let currentRoom = $state<Room | null>(null);
    let gameState = $state<GameState | null>(null);

    currentRoomStore.subscribe((value) => {
        currentRoom = value;
    });

    gameStateStore.subscribe((value) => {
        gameState = value;
    });

    onMount(() => {
        socketStore.connect();
        return () => socketStore.disconnect();
    });
</script>

<main class="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-4 py-8">
    {#if !currentRoom || currentRoom.status === 'waiting'}
        <OnlineSetup />
    {:else if gameState?.phase === 'voting'}
        <OnlineVote />
    {:else if gameState?.phase === 'result'}
        <OnlineResult />
    {:else if gameState?.phase === 'final'}
        <OnlineFinal />
    {/if}
</main>
