<script lang="ts">
    import { socketStore, gameStateStore, chatMessagesStore } from '$lib/socket-store';
    import type { ChatMessage, GameState } from '../../../shared/room-types';

    let newMessage = $state('');
    let gameState = $state<GameState | null>(null);
    let chatMessages = $state<ChatMessage[]>([]);

    gameStateStore.subscribe((value) => {
        gameState = value;
    });

    chatMessagesStore.subscribe((value) => {
        chatMessages = value;
    });
</script>

<header class="final-heading">
    <p class="online-kicker">Multiplayer beendet</p>
    <h1 class="online-title">Das Endergebnis</h1>
</header>

<div class="online-panel ranking">
    {#each gameState?.players.toSorted((a, b) => b.roundsWon - a.roundsWon) as player (player.id)}
        <div class="ranking-row">
            <span>{player.name}</span>
            <strong>{player.roundsWon} Runden</strong>
        </div>
    {/each}
</div>

<button class="online-primary exit-button" onclick={() => socketStore.leaveRoom()}>
    Zurück zum Hauptmenü
</button>

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

<style>
    .final-heading { text-align: center; margin-bottom: 1.25rem; }
    .final-heading h1 { font-size: clamp(2.8rem, 9vw, 5rem); }
    .ranking { padding: 0.75rem 1rem; }
    .ranking-row { display: flex; justify-content: space-between; align-items: center; gap: 1rem; border-bottom: 1px solid hsla(0, 0%, 100%, 0.12); padding: 0.75rem 0.25rem; }
    .ranking-row:last-child { border-bottom: 0; }
    .ranking-row strong { color: var(--color20light); white-space: nowrap; }
    .exit-button { width: 100%; margin-top: 1.25rem; }
    .chat-panel { margin-top: 1.25rem; padding: 1rem; }
    .chat-messages { max-height: 13rem; overflow-y: auto; border-radius: 0.75rem; background: hsla(220, 70%, 5%, 0.72); padding: 0.75rem; }
    .chat-empty { text-align: center; color: hsla(0, 0%, 100%, 0.55); }
    .chat-name { color: var(--color20light); }
    .chat-form { display: grid; grid-template-columns: 1fr auto; gap: 0.65rem; margin-top: 0.75rem; }
    .chat-form button { min-width: 6.5rem; }
    @media (max-width: 520px) { .chat-form { grid-template-columns: 1fr; } }
</style>
