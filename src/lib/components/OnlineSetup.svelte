<script lang="ts">
    import { socketStore, currentRoomStore, errorMessageStore, socketRef } from '$lib/socket-store';
    import { MIN_PLAYERS, ROUND_OPTIONS } from '$lib/game.svelte';
    import { getQuestionsByCategories, QUESTION_CATEGORIES, type QuestionCategory } from '$lib/questions';
    import type { Room } from '../../../shared/room-types';

    let playerName = $state('');
    let roomCode = $state('');
    let isCreating = $state(true);
    let currentRoom = $state<Room | null>(null);
    let errorMessage = $state<string>('');
    let totalRounds = $state(10);
    let selectedCategories = $state<QuestionCategory[]>([...QUESTION_CATEGORIES]);

    currentRoomStore.subscribe((value) => {
        currentRoom = value;
    });

    errorMessageStore.subscribe((value) => {
        errorMessage = value;
    });
</script>

<header class="online-header">
    <p class="online-kicker">Multiplayer</p>
    <h1 class="online-title">Wer würde eher?</h1>
    <p class="online-subtitle">Gemeinsam abstimmen. Laut diskutieren. Punkte sammeln.</p>
</header>

{#if errorMessage}
    <div class="online-error" role="alert">{errorMessage}</div>
{/if}

<div class="online-tabs">
    <button
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
    <section class="online-panel setup-panel">
        <p class="online-kicker">Neuer Room</p>
        <h2>Als Host starten</h2>
        <form
            class="online-form"
            onsubmit={(e) => {
                e.preventDefault();
                console.log('✏️ Button geklickt, playerName:', playerName);
                socketStore.createRoom(playerName);
            }}
        >
            <input
                class="online-input"
                placeholder="Dein Name"
                maxlength="20"
                bind:value={playerName}
            />
            <button class="online-primary" type="submit">Room erstellen</button>
        </form>
    </section>
{:else}
    <section class="online-panel setup-panel">
        <p class="online-kicker">Bestehender Room</p>
        <h2>Freunde beitreten</h2>
        <form
            class="online-form"
            onsubmit={(e) => {
                e.preventDefault();
                socketStore.joinRoom(roomCode, playerName);
            }}
        >
            <input
                class="online-input room-code-input"
                placeholder="Room-Code (z.B. ABC123)"
                maxlength="6"
                bind:value={roomCode}
            />
            <input
                class="online-input"
                placeholder="Dein Name"
                maxlength="20"
                bind:value={playerName}
            />
            <button class="online-primary" type="submit">Room beitreten</button>
        </form>
    </section>
{/if}

{#if currentRoom}
    <section class="online-panel room-panel">
        <div class="room-heading">
            <div>
                <p class="online-kicker">Room-Code</p>
                <strong class="room-code">{currentRoom.code}</strong>
            </div>
            <span class="player-count">{currentRoom.players.length} Spieler</span>
        </div>
        <p class="online-kicker player-label">Spieler im Room</p>
        <ul class="player-list">
            {#each currentRoom.players as player (player.id)}
                <li>
                    <span>{player.name}</span>
                    {#if player.isHost}
                        <small>Host</small>
                    {/if}
                </li>
            {/each}
        </ul>

        {#if currentRoom.hostId === socketRef.get()?.id}
            <fieldset class="mt-6">
                <legend class="muted mb-2">Anzahl Runden</legend>
                <div class="flex gap-2">
                    {#each ROUND_OPTIONS.filter((n) => n <= getQuestionsByCategories(selectedCategories).length) as option (option)}
                        <label
                            class="flex-1 cursor-pointer rounded-xl border border-white/15 bg-white/8 py-3 text-center text-lg font-semibold transition has-checked:border-transparent has-checked:bg-cyan-300 has-checked:text-slate-950"
                        >
                            <input class="sr-only" type="radio" name="online-rounds" value={option} bind:group={totalRounds} />
                            {option}
                        </label>
                    {/each}
                </div>
            </fieldset>

            <fieldset class="mt-4">
                <legend class="muted mb-2">Kategorien</legend>
                <div class="flex flex-wrap gap-2">
                    {#each QUESTION_CATEGORIES as category (category)}
                        <label class="cursor-pointer rounded-xl border border-white/15 bg-white/8 px-3 py-2 has-checked:border-cyan-300 has-checked:bg-cyan-300/20">
                            <input class="mr-2" type="checkbox" value={category} bind:group={selectedCategories} />
                            {category}
                        </label>
                    {/each}
                </div>
            </fieldset>
        {/if}

        {#if currentRoom.hostId === socketRef.get()?.id && currentRoom.players.length >= MIN_PLAYERS}
            <button
                class="online-primary room-action"
                disabled={selectedCategories.length === 0}
                onclick={() => {
                    socketRef.get()?.emit('game:start', {
                        totalRounds,
                        categories: selectedCategories
                    });
                }}
            >
                Spiel starten
            </button>
        {:else if currentRoom.hostId !== socketRef.get()?.id}
            <p class="waiting">Warte auf den Host...</p>
        {:else}
            <p class="waiting">Mindestens {MIN_PLAYERS} Spieler benötigt</p>
        {/if}

        <button class="online-secondary room-action" onclick={() => socketStore.leaveRoom()}>
            Room verlassen
        </button>
    </section>
{/if}

<style>
    .online-header { text-align: center; margin-bottom: 1.5rem; }
    .online-subtitle { margin-top: 0.75rem; color: hsla(0, 0%, 100%, 0.72); }
    .online-error { margin: 0 0 1rem; border: 2px solid hsl(0, 70%, 55%); border-radius: 0.75rem; padding: 0.75rem 1rem; background: hsla(0, 70%, 35%, 0.22); }
    .online-tabs { display: grid; grid-template-columns: 1fr 1fr; gap: 0.65rem; margin-bottom: 0.75rem; }
    .online-tabs button { min-height: 3.25rem; border: 2px solid hsla(0, 0%, 100%, 0.45); border-radius: 0.75rem; background: hsla(220, 30%, 16%, 0.78); }
    .online-tabs button.active { border-color: var(--color20); background: linear-gradient(30deg, hsla(200, 100%, 38%, 0.9), hsla(230, 75%, 48%, 0.9)); }
    .setup-panel, .room-panel { padding: 1.25rem; margin-top: 0.75rem; }
    .setup-panel h2 { margin: 0.25rem 0 1rem; font-size: 2.25rem; }
    .online-form { display: grid; gap: 0.75rem; }
    .room-code-input { text-transform: uppercase; letter-spacing: 0.22em; font-size: 1.25rem; text-align: center; }
    .room-heading { display: flex; align-items: end; justify-content: space-between; gap: 1rem; }
    .room-code { display: block; color: var(--color20light); font-size: 2.25rem; letter-spacing: 0.22em; }
    .player-count { border: 1px solid hsla(0, 0%, 100%, 0.35); border-radius: 999px; padding: 0.35rem 0.75rem; }
    .player-label { margin-top: 1.25rem; }
    .player-list { display: flex; flex-wrap: wrap; gap: 0.5rem; list-style: none; padding: 0; margin: 0.6rem 0 1.25rem; }
    .player-list li { display: flex; align-items: center; gap: 0.6rem; border: 1px solid hsla(0, 0%, 100%, 0.28); border-radius: 999px; background: hsla(200, 100%, 75%, 0.09); padding: 0.45rem 0.75rem 0.45rem 1rem; }
    .player-list small { border-radius: 999px; background: hsla(128, 76%, 43%, 0.28); padding: 0.15rem 0.45rem; }
    .room-action { width: 100%; margin-top: 0.75rem; }
    .waiting { text-align: center; margin-top: 1rem; color: hsla(0, 0%, 100%, 0.72); }
</style>
