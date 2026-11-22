<script lang="ts">
	import { game } from '$lib/game.svelte';
	import PlayerChip from '$lib/components/playerChip.svelte';
</script>

<div class="pass-device-content">

	<p>
		Runde {game.round} von {game.totalRounds}
	</p>

	<h1>Gib das Gerät an</h1>

	<PlayerChip player={game.voter} allowRemove = {false} style="font-size: 4em;"/>
	<p class="pass-device-player-name">{game.voter.name}</p>

	<button class="continue-btn" onclick={() => game.reveal()}>
		Weiter
	</button>
		<div class="round-progress" aria-hidden="true">
		{#each { length: game.totalRounds } as _, i (i)}
			<span
				class="pass-round-segment {i < game.round
					? 'pass-round-segment-complete'
					: 'pass-round-segment-pending'}"
			></span>
		{/each}
	</div>
</div>
<style>
	.pass-device-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	.round-progress {
		display: flex;
		gap: 0.5rem;
	}

	.pass-round-segment {
		width: 1rem;
		height: 1rem;
		border-radius: 50%;
		background-color: #ccc;
	}

	.pass-round-segment-complete {
		background-color: var(--color10);
	}

	.pass-round-segment-pending {
		background-color: #ccc;
	}


    .pass-device-player-name {
        margin-bottom: 0;
    }

    .continue-btn {
		font-size: 2rem;
		padding: .25rem 2rem;
        max-width: 20em;
		background-color: var(--color10);
    }
</style>
