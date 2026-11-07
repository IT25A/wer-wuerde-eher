<script lang="ts">
	import { game, MAX_PLAYERS, MIN_PLAYERS, ROUND_OPTIONS } from '$lib/game.svelte';
	import { questions } from '$lib/questions';
	import PlayerChip from '$lib/components/PlayerChip.svelte';
	let name = $state('');
	let error = $state('');
	function add(event: SubmitEvent) {
		event.preventDefault();
		error = game.addPlayer(name) ?? '';
		if (!error) name = '';
	}
</script>

<div class="setup-head">
	<h1 class="title">Wer würde eher?</h1>
	<p class="subtitle">
		Alle spielen an einem Gerät. Tragt eure Namen ein, danach wird das Gerät reihum weitergegeben.
	</p>
</div>

<section id="setup-players">
	<form id="add-player" onsubmit={add}>
		<input
			class="glow-box"
			placeholder="Name"
			maxlength="20"
			aria-label="Name des Spielers"
			bind:value={name}
		/>
		<button class="glow-box" id="add-player-btn" type="submit" disabled={game.players.length >= MAX_PLAYERS}>
			Hinzufügen
		</button>
	</form>
	{#if error}
		<p class="error" role="alert">{error}</p>
	{/if}

	{#if game.players.length}
		<ul id="player-list">
			{#each game.players as p (p.name)}
				<li>
					<PlayerChip player={p} allowRemove={true} />
				</li>
			{/each}
		</ul>
	{/if}
	<p class="muted setup-player-count">
		{game.players.length} / {MAX_PLAYERS} Spieler (mindestens {MIN_PLAYERS})
	</p>
</section>

<fieldset id="rounds">
	<legend>Anzahl Runden</legend>

	{#each ROUND_OPTIONS.filter((n) => n <= questions.length) as option (option)}
			<label class="round-option">
				<input
					class="round-input"
					type="radio"
					name="rounds"
					value={option}
					bind:group={game.totalRounds}
				/>
				{option}
			</label>
		{/each}
			<!-- #TODO: Add custom round option -->

</fieldset>

<br>
<button
	class="start-btn"
	id="start-btn"
	disabled={!game.canStart}
	onclick={() => game.start()}
>
	Spiel starten
</button>

<style>
	p{
		text-align: center;
	}
	.subtitle{
		color: var(--color20);
	}
	#setup-players{
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		width: 100%;
		margin: 1rem 0;
	}
	#add-player{
		display: flex;
		flex-direction: row;
		justify-content: center;
		gap: 1rem;
		width: 100%;
	}
	#add-player button, input{
		font-size: 1.25rem;
		padding: .25rem .5rem;
	}
	#add-player-btn{
		background: var(--color30);
	}

	#player-list{
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: .5rem;
		list-style: none;
		padding: 0;
		margin: 0;
	}
	/* .player-chip{
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: .5rem;
		background: var(--color20dark);
		text-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
		padding: .25rem .5rem;
		border-radius: .25rem;
	} */

	#rounds{
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		margin: 0;
		border-radius: .5rem;
	}
	.round-option{
		display: inline-flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		aspect-ratio: 1/1;
		height: 3rem;
		font-size: 1.5rem;
		padding: .25rem;
		border-radius: 10%;
		margin: .25rem;
		background: var(--color70light);
		cursor: pointer;
		gap: .5rem;
		transition: background .1s ease, transform .1s ease-out;
	}
	.round-option:has(input:checked){
		background: var(--color20dark);
	}
	.round-option:hover{
		background: var(--color20);
		transform: scale(1.05);
	}
	.round-option:active{
		transform: scale(.98);
	}
	.round-option input{
		opacity: 0;
		position: absolute;
		width: 0;
		height: 0;
	}

	#start-btn{
		font-size: 1.5rem;
		padding: .25rem 2rem;
		background: var(--color30);
	}
</style>