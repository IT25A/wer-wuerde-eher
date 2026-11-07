<script lang="ts">
	import { onDestroy } from 'svelte';

	type Phase = 'setup' | 'vote' | 'result' | 'final';

	type Player = {
		name: string;
		roundsWon: number;
		totalVotes: number;
		roundVotes: number;
		voted: Player | null;
		isAdmin: boolean;
	};

	type GameState = {
		gameCode: string;
		players: Player[];
		totalRounds: number;
		currentRound: number;
		maxPlayers: number;
		phase: Phase;
	};

	let socket = $state<WebSocket | null>(null);
	let game = $state<GameState | null>(null);
	let playerName = $state('');
	let gameCode = $state('');
	let joinCode = $state('');
	let selectedTarget = $state('');
	let status = $state('Not connected');
	let error = $state('');

	let connected = $derived(socket?.readyState === 1);
	let currentPlayer = $derived(game?.players.find((player) => player.name === playerName));
	let canAdvance = $derived(Boolean(currentPlayer?.isAdmin));

	function connect(onConnected?: () => void) {
		if (socket && socket.readyState === 1) {
			onConnected?.();
			return;
		}

		error = '';
		status = 'Connecting...';
		const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
		const connection = new WebSocket(`${protocol}//${window.location.host}/ws`);
		socket = connection;

		connection.onopen = () => {
			status = 'Connected';
			onConnected?.();
		};
		connection.onmessage = (event) => {
			const message = JSON.parse(event.data) as GameState & { error?: string };
			if (message.error) {
				error = message.error;
				return;
			}
			game = message;
			gameCode = message.gameCode;
			status = `In room ${message.gameCode}`;
		};
		connection.onerror = () => {
			error = 'Could not connect to the multiplayer server on port 8080.';
			status = 'Connection error';
		};
		connection.onclose = () => {
			socket = null;
			status = 'Disconnected';
		};
	}

	function send(message: Record<string, string>) {
		if (!socket || socket.readyState !== 1) {
			error = 'Connect to the multiplayer server first.';
			return;
		}
		socket.send(JSON.stringify(message));
		error = '';
	}

	function createGame() {
		connect(() => send({ type: 'create_game', playerName }));
	}

	function joinGame() {
		connect(() => send({ type: 'join_game', gameCode: joinCode.trim().toUpperCase(), playerName }));
	}

	function advancePhase() {
		send({ type: game?.phase === 'setup' ? 'start_game' : 'next_round' });
	}

	onDestroy(() => {
		socket?.close();
	});
</script>

<svelte:head>
	<title>Multiplayer testen | Wer würde eher?</title>
</svelte:head>

<main>
	<header>
		<p class="eyebrow">Multiplayer test room</p>
		<h1>Wer würde eher?</h1>
		<p>Test the WebSocket room and game phases from two browser windows.</p>
	</header>

	<section class="panel connection-panel">
		<div class="status">
			<span class:online={connected} class="status-dot"></span>
			{status}
		</div>
		{#if !game}
			<form
				onsubmit={(event) => {
					event.preventDefault();
					createGame();
				}}
			>
				<label>
					Your name
					<input bind:value={playerName} maxlength="20" placeholder="Player name" required />
				</label>
				<button type="submit">Create room</button>
			</form>
			<div class="divider"><span>or join a room</span></div>
			<form
				onsubmit={(event) => {
					event.preventDefault();
					joinGame();
				}}
			>
				<label>
					Room code
					<input bind:value={joinCode} maxlength="6" placeholder="ABC123" required />
				</label>
				<button type="submit" class="secondary">Join room</button>
			</form>
		{:else}
			<div class="room-code">
				<span>Room code</span>
				<strong>{game.gameCode}</strong>
			</div>
			<p class="hint">Open this page in another window and join with this code.</p>
		{/if}
		{#if error}<p class="error">{error}</p>{/if}
	</section>

	{#if game}
		<section class="panel game-panel">
			<div class="game-heading">
				<div>
					<p class="eyebrow">Round {game.currentRound} / {game.totalRounds}</p>
					<h2>{game.phase}</h2>
				</div>
				{#if canAdvance}
					<button onclick={advancePhase}>
						{game.phase === 'setup' ? 'Start game' : 'Next phase'}
					</button>
				{/if}
			</div>

			<h3>Players ({game.players.length} / {game.maxPlayers})</h3>
			<ul class="players">
				{#each game.players as player (player.name)}
					<li class:selected={player.name === playerName}>
						<span>{player.name}{player.isAdmin ? ' ★' : ''}</span>
						{#if game.phase === 'vote'}
							<button
								class="vote-button"
								onclick={() => {
									selectedTarget = player.name;
									send({ type: 'vote', targetName: player.name });
								}}
							>
								{selectedTarget === player.name ? 'Voted' : 'Vote'}
							</button>
						{:else if game.phase === 'result' || game.phase === 'final'}
							<span class="votes">{player.roundVotes} votes</span>
						{/if}
					</li>
				{/each}
			</ul>
		</section>
	{/if}
</main>

<style>
	:global(body) {
		margin: 0;
		background: #10131d;
		color: #f5f7ff;
		font-family: Arial, sans-serif;
	}

	main {
		width: min(92%, 620px);
		margin: 0 auto;
		padding: 4rem 0;
	}

	header {
		margin-bottom: 2rem;
	}
	h1,
	h2,
	h3,
	p {
		margin-top: 0;
	}
	h1 {
		margin-bottom: 0.5rem;
		font-size: clamp(2.5rem, 8vw, 4.5rem);
	}
	h2 {
		margin-bottom: 0;
		text-transform: capitalize;
	}
	h3 {
		margin-top: 2rem;
	}
	header p:last-child,
	.hint {
		color: #a7aec7;
	}
	.eyebrow {
		margin-bottom: 0.4rem;
		color: #77e6ba;
		font-size: 0.8rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}

	.panel {
		padding: 1.5rem;
		border: 1px solid #30384f;
		border-radius: 1rem;
		background: #181d2b;
		box-shadow: 0 1rem 3rem #07091166;
	}
	.connection-panel {
		margin-bottom: 1rem;
	}
	.status {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 1.25rem;
		color: #a7aec7;
	}
	.status-dot {
		width: 0.65rem;
		height: 0.65rem;
		border-radius: 50%;
		background: #e88787;
	}
	.status-dot.online {
		background: #77e6ba;
	}
	form {
		display: flex;
		align-items: end;
		gap: 0.75rem;
	}
	label {
		display: grid;
		flex: 1;
		gap: 0.4rem;
		color: #a7aec7;
		font-size: 0.85rem;
	}
	input {
		width: 100%;
		box-sizing: border-box;
		padding: 0.75rem;
		border: 1px solid #3a4562;
		border-radius: 0.5rem;
		background: #10131d;
		color: inherit;
		font: inherit;
	}
	button {
		padding: 0.75rem 1rem;
		border: 0;
		border-radius: 0.5rem;
		background: #77e6ba;
		color: #10131d;
		cursor: pointer;
		font: inherit;
		font-weight: 700;
	}
	button:hover {
		filter: brightness(1.1);
	}
	button.secondary,
	.vote-button {
		background: #303b59;
		color: #f5f7ff;
	}
	.divider {
		margin: 1.25rem 0;
		border-top: 1px solid #30384f;
		text-align: center;
	}
	.divider span {
		position: relative;
		top: -0.65rem;
		padding: 0 0.75rem;
		background: #181d2b;
		color: #77809e;
		font-size: 0.8rem;
	}
	.room-code {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem;
		border-radius: 0.5rem;
		background: #10131d;
		color: #a7aec7;
	}
	.room-code strong {
		color: #77e6ba;
		font-size: 1.5rem;
		letter-spacing: 0.15em;
	}
	.error {
		margin: 1rem 0 0;
		color: #ff9a9a;
	}
	.game-heading {
		display: flex;
		align-items: start;
		justify-content: space-between;
		gap: 1rem;
	}
	.players {
		display: grid;
		gap: 0.6rem;
		padding: 0;
		list-style: none;
	}
	.players li {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.8rem 1rem;
		border-radius: 0.5rem;
		background: #10131d;
	}
	.players li.selected {
		outline: 1px solid #77e6ba;
	}
	.votes {
		color: #77e6ba;
		font-size: 0.9rem;
	}
	@media (max-width: 500px) {
		form {
			align-items: stretch;
			flex-direction: column;
		}
	}
</style>
