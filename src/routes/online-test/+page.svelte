<script lang="ts">
    import { onMount } from 'svelte';
    import { io, type Socket } from 'socket.io-client';

    import type {
        ClientToServerEvents,
        ServerToClientEvents
    } from '../../../shared/socket-events';

    import type { Room, RoomPlayer, ChatMessage } from '../../../shared/room-types';

    // Der Socket selbst muss nicht reaktiv sein.
    let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

    // Status
    let status = $state('Nicht verbunden');
    let serverMessage = $state('Noch keine Nachricht');

    // Room-Management
    let playerName = $state('');
    let roomCode = $state('');
    let currentRoom = $state<Room | null>(null);
    let errorMessage = $state('');

    let chatMessages = $state<ChatMessage[]>([]);
    let newMessage = $state('');
    let chatContainer: HTMLElement;

    onMount(() => {

        socket = io('http://localhost:3001');

        socket.on('connect', () => {
            status = 'Verbunden!';
            console.log('Socket verbunden:', socket?.id);
        });

        socket.on('connect_error', (error) => {
            status = 'Verbindungsfehler';
            console.error('Verbindungsfehler:', error.message);
        });

        socket.on('disconnect', (reason) => {
            status = 'Verbindung getrennt';
            console.log('Verbindung getrennt:', reason);
            currentRoom = null;
            chatMessages = [];
        });

        socket.on('server:welcome', (data) => {
            serverMessage = data.message;
        });

        // Room Events
        socket.on('room:created', (data) => {
            console.log('Room erstellt:', data.room);
            currentRoom = data.room;
            errorMessage = '';
        });

        socket.on('room:joined', (data) => {
            console.log('Room beigetreten:', data.room);
            currentRoom = data.room;
            errorMessage = '';
        });

        socket.on('room:player-joined', (data) => {
            console.log('Neuer Spieler beigetreten:', data.player);
            if (currentRoom) {
                currentRoom.players = [...currentRoom.players, data.player];
            }
        });

        socket.on('room:player-left', (data) => {
            console.log('Spieler hat verlassen:', data.playerId);
            if (currentRoom) {
                currentRoom.players = currentRoom.players.filter(
                    (p) => p.id !== data.playerId
                );
            }
        });

        socket.on('room:error', (data) => {
            console.error('Room-Fehler:', data.message);
            errorMessage = data.message;
        });

        socket.on('chat:message', (data) => {
            console.log('Chat-Nachricht empfangen:', data.message);
            chatMessages = [...chatMessages, data.message];

            // Scroll zum Ende des Chats
            setTimeout(() => {
                if (chatContainer) {
                    chatContainer.scrollTop = chatContainer.scrollHeight;
                }
            }, 0);
        });

        return () => {
            socket?.disconnect();
            socket = null;
        };
    });

    function createRoom() {
        if (!socket || !socket.connected) {
            errorMessage = 'Nicht mit Server verbunden';
            return;
        }

        if (!playerName.trim()) {
            errorMessage = 'Bitte gib einen Namen ein';
            return;
        }

        console.log('Erstelle Room für:', playerName);
        socket.emit('room:create', { playerName });
    }

    function joinRoom() {
        if (!socket || !socket.connected) {
            errorMessage = 'Nicht mit Server verbunden';
            return;
        }

        if (!playerName.trim()) {
            errorMessage = 'Bitte gib einen Namen ein';
            return;
        }

        if (!roomCode.trim()) {
            errorMessage = 'Bitte gib einen Room-Code ein';
            return;
        }

        console.log('Trete Room bei:', roomCode, 'als', playerName);
        socket.emit('room:join', { roomCode: roomCode.trim(), playerName });
    }

    function leaveRoom() {
        if (!socket || !socket.connected) {
            errorMessage = 'Nicht mit Server verbunden';
            return;
        }

        console.log('Verlasse Room');
        socket.emit('room:leave');
        currentRoom = null;
        chatMessages = [];
    }

    function sendMessage() {
        if (!socket || !socket.connected) {
            errorMessage = 'Nicht mit Server verbunden';
            return;
        }

        const message = newMessage.trim();
        if (!message) {
            return;
        }

        if (message.length > 500) {
            errorMessage = 'Nachricht zu lang (max. 500 Zeichen)';
            return;
        }

        console.log('Sende Chat-Nachricht:', message);
        socket.emit('chat:send', { message });
        newMessage = '';
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    }
</script>

<h1>Online-Modus – Room-Test</h1>

<div class="connection-status">
    <p><strong>Status:</strong> {status}</p>
    <p><strong>Server-Nachricht:</strong> {serverMessage}</p>
</div>

{#if !currentRoom}
    <div class="room-creation">
        <h2>Room erstellen oder beitreten</h2>

        <div class="form-group">
            <label for="playerName">Dein Name:</label>
            <input
                id="playerName"
                type="text"
                bind:value={playerName}
                placeholder="Dein Name"
            />
        </div>

        <div class="button-group">
            <button onclick={createRoom} disabled={!playerName.trim()}>
                Room erstellen
            </button>

            <div class="join-section">
                <input
                    type="text"
                    bind:value={roomCode}
                    placeholder="Room-Code (z.B. ABC123)"
                    maxlength="6"
                    style="text-transform: uppercase"
                />
                <button onclick={joinRoom} disabled={!playerName.trim() || !roomCode.trim()}>
                    Beitreten
                </button>
            </div>
        </div>

        {#if errorMessage}
            <p class="error">{errorMessage}</p>
        {/if}
    </div>
{:else}
    <div class="room-view">
        <h2>Du bist im Room: {currentRoom.code}</h2>

        <div class="room-info">
            <p><strong>Status:</strong> {currentRoom.status}</p>
            <p><strong>Spieler ({currentRoom.players.length}):</strong></p>
            <ul>
                {#each currentRoom.players as player (player.id)}
                    <li class={player.isHost ? 'host' : ''}>
                        {player.name}
                        {#if player.isHost} (Host){/if}
                        {!player.isConnected ? ' (getrennt)' : ''}
                    </li>
                {/each}
            </ul>
        </div>

        <div class="chat-section">
            <h3>Chat</h3>
            <div class="chat-messages" bind:this={chatContainer}>
                {#if chatMessages.length === 0}
                    <p class="chat-empty">Noch keine Nachrichten. Schreib die erste!</p>
                {:else}
                    {#each chatMessages as msg (msg.id)}
                        <div class="chat-message">
                            <span class="chat-sender">{msg.playerName}:</span>
                            <span class="chat-text">{msg.message}</span>
                            <span class="chat-time">
                                {new Date(msg.timestamp).toLocaleTimeString('de-DE', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </span>
                        </div>
                    {/each}
                {/if}
            </div>
            <div class="chat-input">
                <input
                    type="text"
                    bind:value={newMessage}
                    placeholder="Schreibe eine Nachricht..."
                    onkeydown={handleKeydown}
                    maxlength="500"
                />
                <button onclick={sendMessage} disabled={!newMessage.trim()}>
                    Senden
                </button>
            </div>
        </div>

        <button onclick={leaveRoom}>Room verlassen</button>

        {#if errorMessage}
            <p class="error">{errorMessage}</p>
        {/if}
    </div>
{/if}

<style>
    .connection-status {
        padding: 1rem;
        background: #f0f0f0;
        border-radius: 8px;
        margin-bottom: 2rem;
    }

    .room-creation,
    .room-view {
        max-width: 500px;
        padding: 2rem;
        border: 1px solid #ccc;
        border-radius: 8px;
    }

    .form-group {
        margin-bottom: 1rem;
    }

    .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: bold;
    }

    .form-group input {
        width: 100%;
        padding: 0.5rem;
        font-size: 1rem;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    .button-group {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .join-section {
        display: flex;
        gap: 0.5rem;
    }

    .join-section input {
        flex: 1;
        padding: 0.5rem;
        font-size: 1rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        text-transform: uppercase;
    }

    button {
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
        background: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    button:hover:not(:disabled) {
        background: #0056b3;
    }

    button:disabled {
        background: #ccc;
        cursor: not-allowed;
    }

    .room-info {
        margin: 1.5rem 0;
    }

    .room-info ul {
        list-style: none;
        padding: 0;
    }

    .room-info li {
        padding: 0.5rem;
        margin: 0.25rem 0;
        background: #f9f9f9;
        border-radius: 4px;
    }

    .room-info li.host {
        background: #e7f3ff;
        font-weight: bold;
    }

    .error {
        color: #dc3545;
        font-weight: bold;
        margin-top: 1rem;
    }

    .chat-section {
        margin: 1.5rem 0;
        border: 1px solid #ccc;
        border-radius: 8px;
        padding: 1rem;
    }

    .chat-section h3 {
        margin-top: 0;
        margin-bottom: 1rem;
    }

    .chat-messages {
        height: 300px;
        overflow-y: auto;
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 1rem;
        margin-bottom: 1rem;
        background: #fafafa;
    }

    .chat-empty {
        color: #666;
        text-align: center;
        margin-top: 2rem;
    }

    .chat-message {
        margin-bottom: 0.75rem;
        padding: 0.5rem;
        background: white;
        border-radius: 4px;
        border-left: 3px solid #007bff;
    }

    .chat-sender {
        font-weight: bold;
        color: #007bff;
    }

    .chat-text {
        margin-left: 0.5rem;
    }

    .chat-time {
        display: block;
        font-size: 0.75rem;
        color: #999;
        margin-top: 0.25rem;
    }

    .chat-input {
        display: flex;
        gap: 0.5rem;
    }

    .chat-input input {
        flex: 1;
        padding: 0.5rem;
        font-size: 1rem;
        border: 1px solid #ccc;
        border-radius: 4px;
    }
</style>