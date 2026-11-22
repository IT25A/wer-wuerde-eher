<script lang="ts">
	import { tick } from 'svelte';
	import { chatMessagesStore, playerIdStore, socketStore } from '$lib/socket-store';

	let newMessage = $state('');

	function send(event: SubmitEvent) {
		event.preventDefault();
		const message = newMessage.trim();
		if (!message) return;
		socketStore.sendChatMessage(message);
		newMessage = '';
	}

	// Hält die Liste bei neuen Nachrichten und bei Größenänderungen am Ende.
	function scrollToEnd(node: HTMLElement) {
		const toEnd = () => node.scrollTo({ top: node.scrollHeight });
		if ($chatMessagesStore.length > 0) tick().then(toEnd);
		const observer = new ResizeObserver(toEnd);
		observer.observe(node);
		return () => observer.disconnect();
	}
</script>

<section class="online-panel chat">
	<h2>Chat</h2>

	<div class="chat-messages" {@attach scrollToEnd}>
		{#each $chatMessagesStore as msg (msg.id)}
			<div class={['chat-message', msg.playerId === $playerIdStore && 'own']}>
				<span class="chat-name">{msg.playerName}</span>
				<p>{msg.message}</p>
			</div>
		{:else}
			<p class="chat-empty">Noch keine Nachrichten</p>
		{/each}
	</div>

	<form class="chat-form" onsubmit={send}>
		<input
			class="online-input"
			placeholder="Nachricht..."
			aria-label="Chat-Nachricht"
			maxlength="500"
			bind:value={newMessage}
		/>
		<button class="online-primary" type="submit" disabled={!newMessage.trim()}>Senden</button>
	</form>
</section>

<style>
	.chat {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		height: 100%;
		min-height: 0;
		padding: 1rem 1.25rem;
	}

	h2 {
		font-size: 2rem;
	}

	.chat-messages {
		flex: 1;
		min-height: 0;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		overflow-y: auto;
		border: 1px solid hsla(0, 0%, 100%, 0.35);
		background: var(--bg-color);
		padding: 0.75rem;
	}

	.chat-message {
		align-self: flex-start;
		max-width: 90%;
		background: var(--color70);
		padding: 0.3rem 0.6rem;
	}

	.chat-message.own {
		align-self: flex-end;
		background: var(--color20dark);
	}

	.chat-name {
		display: block;
		color: var(--color20);
		font-size: 1rem;
	}

	.chat-message.own .chat-name {
		color: hsla(0, 0%, 100%, 0.85);
	}

	.chat-message p {
		font-size: 1.3rem;
		line-height: 1.2;
		overflow-wrap: anywhere;
	}

	.chat-empty {
		margin: auto;
		text-align: center;
		font-size: 1.25rem;
		color: hsla(0, 0%, 100%, 0.5);
	}

	.chat-form {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 0.5rem;
	}

	.chat-form button {
		padding: 0.25rem 1rem;
		font-size: 1.3rem;
	}

	@media (max-width: 900px) {
		.chat-messages {
			min-height: 10rem;
			max-height: 18rem;
		}
	}
</style>
