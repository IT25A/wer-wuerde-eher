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

<p class="muted text-center text-sm tracking-widest uppercase">
    Runde {gameState?.round} von {gameState?.totalRounds} ·
    {voteCount} von {gameState?.players.length} haben gevotet
</p>
<h1 class="mt-4 text-center text-3xl font-extrabold">
    Wer würde eher <span
        class="bg-linear-to-r from-violet-300 to-cyan-300 bg-clip-text text-transparent"
    >{gameState?.question}</span
    >?
</h1>

{#if !hasVoted}
    <div class="mt-8 grid gap-3">
        {#each gameState?.players as player (player.id)}
            {#if player.id !== myId}
                <button
                    class="btn"
                    onclick={() => socketStore.vote(player.id)}
                >
                    {player.name}
                </button>
            {/if}
        {/each}
    </div>
{:else}
    <p class="muted mt-8 text-center">Deine Stimme ist abgegeben. Warte auf die anderen Spieler...</p>
{/if}

{#if isHost}
    <button class="btn mt-4 w-full" onclick={() => socketStore.abortVoting()}>
        Abstimmung jetzt beenden
    </button>
{/if}

<section class="card mt-8 p-5">
    <h3 class="text-lg font-bold mb-4">Chat</h3>
    <div
        class="overflow-y-auto space-y-3 mb-4 p-3 bg-black/25 rounded-xl max-h-60"
    >
        {#if chatMessages.length === 0}
            <p class="muted text-sm text-center">Noch keine Nachrichten</p>
        {:else}
            {#each chatMessages as msg (msg.id)}
                <div class="text-sm">
                    <span class="font-semibold text-cyan-300">{msg.playerName}:</span>
                    <span class="ml-1">{msg.message}</span>
                </div>
            {/each}
        {/if}
    </div>
    <form
        class="flex gap-2"
        onsubmit={(e) => {
            e.preventDefault();
            if (newMessage.trim()) {
                socketStore.sendChatMessage(newMessage);
                newMessage = '';
            }
        }}
    >
        <input
            class="min-w-0 flex-1 rounded-xl border border-white/15 bg-black/25 px-4 py-3 text-lg text-white placeholder:text-indigo-300/50 focus:border-cyan-300 focus:outline-none"
            placeholder="Nachricht..."
            bind:value={newMessage}
            maxlength="500"
        />
        <button class="btn" type="submit">Senden</button>
    </form>
</section>

{#if errorMessage}
    <p class="mt-4 text-center text-rose-300" role="alert">{errorMessage}</p>
{/if}
