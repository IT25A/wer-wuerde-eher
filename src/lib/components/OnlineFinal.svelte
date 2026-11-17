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

<h1 class="text-4xl font-extrabold mb-8 text-center">Spiel beendet!</h1>

<div class="card p-6 space-y-4">
    <h2 class="text-2xl font-bold">Endergebnis</h2>
    {#each gameState?.players.toSorted((a, b) => b.roundsWon - a.roundsWon) as player (player.id)}
        <div class="flex justify-between items-center p-3 bg-black/25 rounded-xl">
            <span class="text-xl font-semibold">{player.name}</span>
            <span class="text-xl font-bold text-cyan-300">{player.roundsWon} Runden</span>
        </div>
    {/each}
</div>

<button class="btn btn-primary mt-8 w-full" onclick={() => socketStore.leaveRoom()}>
    Zurück zum Hauptmenü
</button>

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
