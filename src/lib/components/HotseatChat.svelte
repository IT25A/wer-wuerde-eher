<script lang="ts">
	type ChatMessage = {
		id: number;
		message: string;
	};

	let newMessage = $state('');
	let messages = $state<ChatMessage[]>([]);
	let nextMessageId = 0;

	function sendMessage(event: SubmitEvent) {
		event.preventDefault();
		const message = newMessage.trim();
		if (!message) return;

		messages.push({ id: nextMessageId++, message });
		newMessage = '';
	}
</script>

<section class="card w-full p-5 lg:sticky lg:top-8">
	<h2 class="mb-4 text-lg font-bold">Chat</h2>
	<div class="mb-4 max-h-80 space-y-3 overflow-y-auto rounded-xl bg-black/25 p-3">
		{#if messages.length === 0}
			<p class="muted text-center text-sm">Noch keine Nachrichten</p>
		{:else}
			{#each messages as message (message.id)}
				<p class="text-sm">
					<span class="font-semibold text-cyan-300">Du:</span>
					<span class="ml-1">{message.message}</span>
				</p>
			{/each}
		{/if}
	</div>

	<form class="flex gap-2" onsubmit={sendMessage}>
		<input
			class="min-w-0 flex-1 rounded-xl border border-white/15 bg-black/25 px-4 py-3 text-lg text-white placeholder:text-indigo-300/50 focus:border-cyan-300 focus:outline-none"
			placeholder="Nachricht..."
			aria-label="Chat-Nachricht"
			bind:value={newMessage}
			maxlength="500"
		/>
		<button class="btn" type="submit">Senden</button>
	</form>
</section>
