<script lang="ts">
    import { socketStore, gameStateStore, chatMessagesStore, currentRoomStore, socketRef } from '$lib/socket-store';
    import type { ChatMessage, GameState, Room } from '../../../shared/room-types';

    let newMessage = $state('');
    let gameState = $state<GameState | null>(null);
    let chatMessages = $state<ChatMessage[]>([]);
    let currentRoom = $state<Room | null>(null);

    gameStateStore.subscribe((value) => {
        gameState = value;
    });

    chatMessagesStore.subscribe((value) => {
        chatMessages = value;
    });

    currentRoomStore.subscribe((value) => {
        currentRoom = value;
    });

    const isLast = $derived(
        gameState ? gameState.round >= gameState.totalRounds : false
    );
    const maxVotes = $derived(Math.max(1, ...(gameState?.players.map((p) => p.votes) ?? [0])));
    const isHost = $derived(currentRoom?.hostId === socketRef.get()?.id);
</script>

<section class="result-heading">
    <p class="online-kicker">Runde {gameState?.round} von {gameState?.totalRounds}</p>
    <h1 class="online-title result-title">Wer würde eher <span class="online-accent">{gameState?.question}</span>?</h1>
</section>

<style>
    .result-heading { text-align: center; }
    .result-title { margin: 0.75rem 0 0.5rem; font-size: clamp(2.2rem, 8vw, 4rem); }
    .round-winner { min-height: 3.5rem; display: flex; align-items: center; justify-content: center; color: var(--color20light); text-align: center; text-shadow: 0 0 1.25rem hsla(200, 100%, 75%, 0.35); }
    .result-list { list-style: none; padding: 1rem; }
    .result-list li { margin: 0.55rem 0; }
    .result-row { display: flex; justify-content: space-between; font-weight: 700; }
    .result-bar { height: 0.55rem; margin-top: 0.45rem; border-radius: 999px; overflow: hidden; background: hsla(220, 70%, 5%, 0.72); }
    .result-fill { height: 100%; border-radius: 999px; background: linear-gradient(90deg, var(--color20dark), var(--color20light)); transition: width 0.35s ease; }
    .result-action { width: 100%; margin-top: 1.25rem; }
    .waiting { margin-top: 1.25rem; text-align: center; color: hsla(0, 0%, 100%, 0.72); }
    .chat-panel { margin-top: 1.25rem; padding: 1rem; }
    .chat-messages { max-height: 13rem; overflow-y: auto; border-radius: 0.75rem; background: hsla(220, 70%, 5%, 0.72); padding: 0.75rem; }
    .chat-empty { text-align: center; color: hsla(0, 0%, 100%, 0.55); }
    .chat-name { color: var(--color20light); }
    .chat-form { display: grid; grid-template-columns: 1fr auto; gap: 0.65rem; margin-top: 0.75rem; }
    .chat-form button { min-width: 6.5rem; }
    @media (max-width: 520px) { .chat-form { grid-template-columns: 1fr; } }
</style>

<p class="round-winner">
    {gameState?.players.filter((p) => p.votes === Math.max(...(gameState?.players.map((p) => p.votes) ?? [0])))
        .map((p) => p.name)
        .join(' & ')}
</p>

<ul class="online-panel result-list">
    {#each gameState?.players as player (player.id)}
        <li>
            <div class="result-row">
                <span>{player.name}</span>
                <span>{player.votes}</span>
            </div>
            <div class="result-bar">
                <div
                    class="result-fill"
                    style:width="{(player.votes / maxVotes) * 100}%"
                ></div>
            </div>
        </li>
    {/each}
</ul>

{#if isHost}
    <button
        class="online-primary result-action"
        onclick={() => socketStore.nextRound()}
    >
        {isLast ? 'Endergebnis anzeigen' : 'Nächste Runde'}
    </button>
{:else}
    <p class="waiting">Warte auf den Host...</p>
{/if}

<section class="online-panel chat-panel">
    <h3>Chat</h3>
    <div class="chat-messages">
        {#if chatMessages.length === 0}
            <p class="chat-empty">Noch keine Nachrichten</p>
        {:else}
            {#each chatMessages as msg (msg.id)}
                <div class="text-sm">
                    <span class="chat-name">{msg.playerName}:</span>
                    <span>{msg.message}</span>
                </div>
            {/each}
        {/if}
    </div>
    <form
        class="chat-form"
        onsubmit={(e) => {
            e.preventDefault();
            if (newMessage.trim()) {
                socketStore.sendChatMessage(newMessage);
                newMessage = '';
            }
        }}
    >
        <input
            class="online-input"
            placeholder="Nachricht..."
            bind:value={newMessage}
            maxlength="500"
        />
        <button class="online-secondary" type="submit">Senden</button>
    </form>
</section>
