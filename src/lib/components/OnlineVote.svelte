<script lang="ts">
    import { socketStore, gameStateStore, chatMessagesStore, errorMessageStore, socketRef } from '$lib/socket-store';
    import type { ChatMessage, GameState } from '../../../shared/room-types';

    let newMessage = $state('');
    let chatContainer: HTMLElement;
    let gameState = $state<GameState | null>(null);
    let chatMessages = $state<ChatMessage[]>([]);
    let errorMessage = $state<string>('');

    gameStateStore.subscribe((value) => {
        gameState = value;
    });

    chatMessagesStore.subscribe((value) => {
        chatMessages = value;
    });

    errorMessageStore.subscribe((value) => {
        errorMessage = value;
    });

    const isMyTurn = $derived(
        gameState?.voterId === socketRef.get()?.id
    );

    const currentVoterName = $derived(
        gameState?.players.find((p) => p.id === gameState?.voterId)?.name
    );
</script>

<p class="muted text-center text-sm tracking-widest uppercase">
    Runde {gameState?.round} von {gameState?.totalRounds} ·
    {isMyTurn ? 'Du bist dran' : `${currentVoterName} ist dran`}
</p>
<h1 class="mt-4 text-center text-3xl font-extrabold">
    Wer würde eher <span
        class="bg-linear-to-r from-violet-300 to-cyan-300 bg-clip-text text-transparent"
    >{gameState?.question}</span
    >?
</h1>

{#if isMyTurn}
    <div class="mt-8 grid gap-3">
        {#each gameState?.players as player (player.id)}
            {#if player.id !== socketRef.get()?.id}
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
    <p class="muted mt-8 text-center">Warte auf {currentVoterName}...</p>
{/if}

<section class="card mt-8 p-5">
    <h3 class="text-lg font-bold mb-4">Chat</h3>
    <div
        class="overflow-y-auto space-y-3 mb-4 p-3 bg-black/25 rounded-xl max-h-60"
        bind:this={chatContainer}
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
