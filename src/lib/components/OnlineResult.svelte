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

<p class="muted text-center text-sm tracking-widest uppercase">
    Runde {gameState?.round} von {gameState?.totalRounds}
</p>
<h1 class="mt-4 text-center text-2xl font-extrabold">
    Wer würde eher {gameState?.question}?
</h1>

<p class="mt-6 text-center text-2xl font-extrabold text-cyan-300">
    {gameState?.players.filter((p) => p.votes === Math.max(...(gameState?.players.map((p) => p.votes) ?? [0])))
        .map((p) => p.name)
        .join(' & ')}
</p>

<ul class="card mt-6 space-y-4 p-5">
    {#each gameState?.players as player (player.id)}
        <li>
            <div class="flex justify-between font-semibold">
                <span>{player.name}</span>
                <span>{player.votes}</span>
            </div>
            <div class="mt-1 h-3 rounded-full bg-black/25">
                <div
                    class="h-3 rounded-full bg-linear-to-r from-violet-500 to-cyan-400 transition-all"
                    style:width="{(player.votes / maxVotes) * 100}%"
                ></div>
            </div>
        </li>
    {/each}
</ul>

{#if isHost}
    <button
        class="btn btn-primary mt-8 w-full"
        onclick={() => socketStore.nextRound()}
    >
        {isLast ? 'Endergebnis anzeigen' : 'Nächste Runde'}
    </button>
{:else}
    <p class="muted mt-8 text-center">Warte auf den Host...</p>
{/if}

<section class="card mt-8 p-5">
    <h3 class="text-lg font-bold mb-4">Chat</h3>
    <div class="overflow-y-auto space-y-3 mb-4 p-3 bg-black/25 rounded-xl max-h-60">
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
