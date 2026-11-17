<script lang="ts">
    import { socketStore, currentRoomStore, errorMessageStore, socketRef } from '$lib/socket-store';
    import { MIN_PLAYERS } from '$lib/game.svelte';
    import type { Room } from '../../../shared/room-types';

    let playerName = $state('');
    let roomCode = $state('');
    let isCreating = $state(true);
    let currentRoom = $state<Room | null>(null);
    let errorMessage = $state<string>('');

    currentRoomStore.subscribe((value) => {
        currentRoom = value;
    });

    errorMessageStore.subscribe((value) => {
        errorMessage = value;
    });
</script>

<div class="text-center">
    <h1
        class="bg-linear-to-r from-violet-300 via-blue-300 to-cyan-300 bg-clip-text text-5xl font-extrabold text-transparent"
    >
        Wer würde eher? (Online)
    </h1>
    <p class="muted mt-3">
        Spielt mit Freunden im selben Netzwerk via WebSockets.
    </p>
</div>

{#if errorMessage}
    <div class="mt-4 p-4 bg-rose-500/20 border border-rose-500/50 rounded-xl">
        <p class="text-rose-300 font-semibold">{errorMessage}</p>
    </div>
{/if}

<div class="mt-8 flex gap-4">
    <button
        class="online-btn flex-1"
        class:active={isCreating}
        onclick={() => (isCreating = true)}
    >
        Room erstellen
    </button>
    <button
        class="online-btn flex-1"
        class:active={!isCreating}
        onclick={() => (isCreating = false)}
    >
        Beitreten
    </button>
</div>

{#if isCreating}
    <section class="card mt-6 p-5">
        <h2 class="text-xl font-bold mb-4">Neuen Room erstellen</h2>
        <form
            class="flex gap-2"
            onsubmit={(e) => {
                e.preventDefault();
                console.log('✏️ Button geklickt, playerName:', playerName);
                socketStore.createRoom(playerName);
            }}
        >
            <input
                class="min-w-0 flex-1 rounded-xl border border-white/15 bg-black/25 px-4 py-3 text-lg text-white placeholder:text-indigo-300/50 focus:border-cyan-300 focus:outline-none"
                placeholder="Dein Name"
                maxlength="20"
                bind:value={playerName}
            />
            <button class="btn" type="submit">Erstellen</button>
        </form>
    </section>
{:else}
    <section class="card mt-6 p-5">
        <h2 class="text-xl font-bold mb-4">Room beitreten</h2>
        <form
            class="flex flex-col gap-3"
            onsubmit={(e) => {
                e.preventDefault();
                socketStore.joinRoom(roomCode, playerName);
            }}
        >
            <input
                class="w-full rounded-xl border border-white/15 bg-black/25 px-4 py-3 text-lg text-white placeholder:text-indigo-300/50 focus:border-cyan-300 focus:outline-none uppercase"
                placeholder="Room-Code (z.B. ABC123)"
                maxlength="6"
                bind:value={roomCode}
            />
            <input
                class="w-full rounded-xl border border-white/15 bg-black/25 px-4 py-3 text-lg text-white placeholder:text-indigo-300/50 focus:border-cyan-300 focus:outline-none"
                placeholder="Dein Name"
                maxlength="20"
                bind:value={playerName}
            />
            <button class="btn" type="submit">Beitreten</button>
        </form>
    </section>
{/if}

{#if currentRoom}
    <section class="card mt-6 p-5">
        <h2 class="text-xl font-bold mb-4">Room: {currentRoom.code}</h2>
        <p class="muted mb-2">Spieler im Room:</p>
        <ul class="flex flex-wrap gap-2">
            {#each currentRoom.players as player (player.id)}
                <li
                    class="flex items-center gap-2 rounded-full bg-linear-to-r from-violet-500/30 to-cyan-400/30 py-1.5 pr-2 pl-4 ring-1 ring-white/15"
                >
                    <span class="font-semibold">{player.name}</span>
                    {#if player.isHost}
                        <span class="text-xs bg-cyan-500/30 px-2 py-0.5 rounded-full">Host</span>
                    {/if}
                </li>
            {/each}
        </ul>

        {#if currentRoom.hostId === socketRef.get()?.id && currentRoom.players.length >= MIN_PLAYERS}
            <button
                class="btn btn-primary mt-4 w-full"
                onclick={() => {
                    socketRef.get()?.emit('game:start', { totalRounds: 10 });
                }}
            >
                Spiel starten
            </button>
        {:else if currentRoom.hostId !== socketRef.get()?.id}
            <p class="muted mt-4 text-sm">Warte auf den Host...</p>
        {:else}
            <p class="muted mt-4 text-sm">Mindestens {MIN_PLAYERS} Spieler benötigt</p>
        {/if}

        <button class="btn mt-4 w-full" onclick={() => socketStore.leaveRoom()}>
            Room verlassen
        </button>
    </section>
{/if}

<style>
    .online-btn {
        background: linear-gradient(30deg, hsl(140, 100%, 35%), hsl(120, 100%, 35%));
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        transition: all 0.1s ease-out;
        border: 2px solid hsla(0, 0%, 100%, 0.7);
        text-shadow: 0 0 10px hsla(0, 0%, 100%, 0.3);
    }

    .online-btn:hover {
        background-color: hsl(22, 100%, 50%);
        transform: scale(1.02);
    }

    .online-btn:active {
        transform: scale(0.98);
    }
</style>
