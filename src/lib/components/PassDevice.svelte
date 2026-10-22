<script lang="ts">
	import { game } from '$lib/game.svelte';
</script>

<p class="text-green-600">Runde {game.round} von {game.totalRounds}</p>
<h1 class="mt-4 text-3xl font-bold">Gib das Gerät an</h1>
<p class="my-8 text-5xl font-bold break-words text-green-300">{game.voter}</p>
<p class="mb-8 text-green-600">
	Die anderen schauen bitte kurz weg. Die Frage und die Abstimmung sind geheim.
</p>
<button class="btn btn-primary w-full" onclick={() => game.reveal()}>
	Ich bin {game.voter}
</button>
