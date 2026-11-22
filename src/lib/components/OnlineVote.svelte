<script lang="ts">
    import { socketStore, gameStateStore, chatMessagesStore, errorMessageStore, socketRef, currentRoomStore } from '$lib/socket-store';
    import type { ChatMessage, GameState, Room } from '../../../shared/room-types';

    let newMessage = $state('');
    let gameState = $state<GameState | null>(null);
    let chatMessages = $state<ChatMessage[]>([]);
    let errorMessage = $state<string>('');
    let currentRoom = $state<Room | null>(null);

    gameStateStore.subscribe((value) => {
        gameState = value;
    });

    chatMessagesStore.subscribe((value) => {
        chatMessages = value;
    });

    errorMessageStore.subscribe((value) => {
        errorMessage = value;
    });

    currentRoomStore.subscribe((value) => {
        currentRoom = value;
    });

    const myId = $derived(socketRef.get()?.id);
    const hasVoted = $derived(myId ? gameState?.votedPlayerIds.includes(myId) ?? false : false);
    const isHost = $derived(currentRoom?.hostId === myId);
    const voteCount = $derived(gameState?.votedPlayerIds.length ?? 0);
</script>

<section class="question-panel">
    <p class="online-kicker">Runde {gameState?.round} von {gameState?.totalRounds}</p>
    <h1 class="online-title question-title">Wer würde eher <span class="online-accent">{gameState?.question}</span>?</h1>
    <div class="vote-progress" aria-label="{voteCount} von {gameState?.players.length} Stimmen abgegeben">
        <span>{voteCount} / {gameState?.players.length} Stimmen</span>
        <div><i style:width="{gameState?.players.length ? (voteCount / gameState.players.length) * 100 : 0}%"></i></div>
    </div>
</section>

{#if !hasVoted}
    <div class="choice-grid">
        {#each gameState?.players as player (player.id)}
            {#if player.id !== myId}
                <button
                    class="online-choice"
                    onclick={() => socketStore.vote(player.id)}
                >
                    {player.name}
                </button>
            {/if}
        {/each}
    </div>
{:else}
    <p class="voted-message">Deine Stimme ist abgegeben.<br />Warte auf die anderen Spieler.</p>
{/if}

{#if isHost}
    <button class="online-secondary abort-button" onclick={() => socketStore.abortVoting()}>
        Abstimmung jetzt beenden
    </button>
{/if}

<section class="online-panel chat-panel">
    <h3>Chat</h3>
    <div
        class="chat-messages"
    >
        {#if chatMessages.length === 0}
            <p class="chat-empty">Noch keine Nachrichten</p>
        {:else}
            {#each chatMessages as msg (msg.id)}
                <div class="chat-message">
                    <span>{msg.playerName}</span>
                    <p>{msg.message}</p>
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

{#if errorMessage}
    <p class="mt-4 text-center text-rose-300" role="alert">{errorMessage}</p>
{/if}

<style>
    .question-panel { text-align: center; }
    .question-title { margin: 0.75rem 0 1.25rem; font-size: clamp(2.3rem, 8vw, 4.5rem); }
    .vote-progress { width: min(100%, 420px); margin: 0 auto; }
    .vote-progress span { display: block; margin-bottom: 0.45rem; color: hsla(0, 0%, 100%, 0.72); }
    .vote-progress div { height: 0.55rem; border: 1px solid hsla(0, 0%, 100%, 0.22); border-radius: 999px; overflow: hidden; background: hsla(220, 70%, 5%, 0.72); }
    .vote-progress i { display: block; height: 100%; background: linear-gradient(90deg, var(--color20dark), var(--color20light)); transition: width 0.25s ease; }
    .choice-grid { display: grid; gap: 0.65rem; margin-top: 1.25rem; }
    .voted-message { margin: 1.5rem 0; text-align: center; color: var(--color20light); }
    .abort-button { width: 100%; margin-top: 0.75rem; }
    .chat-panel { margin-top: 1.25rem; padding: 1rem; }
    .chat-panel h3 { margin-bottom: 0.75rem; }
    .chat-messages { max-height: 13rem; overflow-y: auto; border-radius: 0.75rem; background: hsla(220, 70%, 5%, 0.72); padding: 0.75rem; }
    .chat-empty { text-align: center; color: hsla(0, 0%, 100%, 0.55); }
    .chat-message { display: grid; grid-template-columns: minmax(5rem, auto) 1fr; gap: 0.5rem; padding: 0.25rem 0; }
    .chat-message span { color: var(--color20light); }
    .chat-message p { font-size: 1.15rem; overflow-wrap: anywhere; }
    .chat-form { display: grid; grid-template-columns: 1fr auto; gap: 0.65rem; margin-top: 0.75rem; }
    .chat-form button { min-width: 6.5rem; }
    @media (max-width: 520px) { .chat-form { grid-template-columns: 1fr; } }
</style>
