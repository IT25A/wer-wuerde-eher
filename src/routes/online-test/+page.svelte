<script lang="ts">
    import { onMount } from 'svelte';
    import { io, type Socket } from 'socket.io-client';

    import type {
        ClientToServerEvents,
        ServerToClientEvents
    } from '../../../shared/socket-events';

    import type { Room } from '../../../shared/room-types';

    // Der Socket selbst muss nicht reaktiv sein.
    let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

    // Diese Werte werden im Frontend angezeigt und sind deshalb reaktiv.
    let status = $state('Nicht verbunden');
    let serverMessage = $state('Noch keine Nachricht');
    let pingResponse = $state('Noch kein Ping gesendet');

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
        });

        socket.on('server:welcome', (data) => {
        serverMessage = data.message;
        });

        socket.on('server:pong', (data) => {
         console.log('Pong empfangen:', data.message);
         pingResponse = data.message;
        });

        return () => {
            socket?.disconnect();
            socket = null;
        };
    });

    function sendPing() {
        console.log('Ping-Button wurde geklickt');

        if (!socket || !socket.connected) {
            console.error('Keine aktive Socket-Verbindung!');
            return;
        }

        console.log('Sende Ping an Server...');
        socket.emit('client:ping');
    }
</script>

<h1>Online-Modus – Verbindungstest</h1>

<p>Status: {status}</p>

<p>Nachricht vom Server: {serverMessage}</p>

<p>Ping-Antwort: {pingResponse}</p>

<button onclick={sendPing}>
    Ping an Server senden
</button>