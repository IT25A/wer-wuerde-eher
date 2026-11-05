<script lang="ts">
	import { game } from '$lib/game.svelte';
</script>

<div class="pass-device-content">
	<div class="pass-round-progress" aria-hidden="true">
		{#each { length: game.totalRounds } as _, i (i)}
			<span
				class="pass-round-segment {i < game.round
					? 'pass-round-segment-complete'
					: 'pass-round-segment-pending'}"
			></span>
		{/each}
	</div>
	<p class="muted pass-round-label">
		Runde {game.round} von {game.totalRounds}
	</p>

	<h1 class="muted pass-device-heading">Gib das Gerät an</h1>

	<div class="pass-device-avatar" aria-hidden="true">
		{game.voter.name.charAt(0).toUpperCase()}
	</div>
	<p class="pass-device-player-name">{game.voter.name}</p>

	<p class="card muted pass-device-note">
		Die anderen schauen bitte kurz weg. Die Frage und die Abstimmung sind geheim.
	</p>

	<button class="btn btn-primary pass-device-action" onclick={() => game.reveal()}>
		Ich bin {game.voter.name}
	</button>
</div>
