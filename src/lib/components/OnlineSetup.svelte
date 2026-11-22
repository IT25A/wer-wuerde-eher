<script lang="ts">
	import { resolve } from '$app/paths';
	import { socketStore } from '$lib/socket-store';

	let mode = $state<'create' | 'join'>('create');
	let playerName = $state('');
	let roomCode = $state('');

	const canSubmit = $derived(
		playerName.trim().length > 0 && (mode === 'create' || roomCode.trim().length === 6)
	);

	function submit(event: SubmitEvent) {
		event.preventDefault();
		if (!canSubmit) return;
		if (mode === 'create') socketStore.createRoom(playerName);
		else socketStore.joinRoom(roomCode, playerName);
	}
</script>

<section class="online-panel setup">
	<h1 class="online-title">Wer würde eher?</h1>
	<p class="subtitle">
		Jeder spielt am eigenen Gerät. Erstellt einen Room oder tretet mit dem Code eines Freundes bei.
	</p>

	<div class="tabs" role="tablist" aria-label="Room erstellen oder beitreten">
		<button
			type="button"
			role="tab"
			aria-selected={mode === 'create'}
			class={[mode === 'create' && 'active']}
			onclick={() => (mode = 'create')}
		>
			Room erstellen
		</button>
		<button
			type="button"
			role="tab"
			aria-selected={mode === 'join'}
			class={[mode === 'join' && 'active']}
			onclick={() => (mode = 'join')}
		>
			Beitreten
		</button>
	</div>

	<form class="setup-form" onsubmit={submit}>
		{#if mode === 'join'}
			<label class="field">
				<span>Room-Code</span>
				<input
					class="online-input code-input"
					placeholder="ABC123"
					maxlength="6"
					autocomplete="off"
					spellcheck="false"
					bind:value={roomCode}
				/>
			</label>
		{/if}

		<label class="field">
			<span>Dein Name</span>
			<input
				class="online-input"
				placeholder="Name"
				maxlength="20"
				autocomplete="nickname"
				bind:value={playerName}
			/>
		</label>

		<p class="hint">
			{mode === 'create'
				? 'Als Host wählst du Runden und Kategorien und startest das Spiel.'
				: 'Den sechsstelligen Code bekommst du vom Host.'}
		</p>

		<button class="online-primary" type="submit" disabled={!canSubmit}>
			{mode === 'create' ? 'Room erstellen' : 'Room beitreten'}
		</button>
	</form>

	<a class="back-link" href={resolve('/')}>Zurück zum Hauptmenü</a>
</section>

<style>
	.setup {
		width: min(100%, 34rem);
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.25rem;
		padding: 1.5rem clamp(1.25rem, 4vw, 2.25rem);
	}

	.subtitle {
		text-align: center;
		color: var(--color20);
	}

	.tabs {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.75rem;
		width: 100%;
	}

	.tabs button {
		min-height: 3rem;
		background: var(--color70light);
		font-size: 1.5rem;
		transition:
			background 0.1s ease,
			transform 0.1s ease-out;
	}

	.tabs button:hover {
		background: var(--color20);
	}

	.tabs button.active {
		background: var(--color20dark);
	}

	.setup-form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		width: 100%;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		font-size: 1.25rem;
	}

	.code-input {
		text-align: center;
		text-transform: uppercase;
		font-size: 2.25rem;
		letter-spacing: 0.4em;
	}

	.hint {
		text-align: center;
		font-size: 1.2rem;
		color: hsla(0, 0%, 100%, 0.65);
	}

	.setup-form button {
		align-self: center;
	}
</style>
