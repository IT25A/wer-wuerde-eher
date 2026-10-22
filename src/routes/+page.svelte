<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
</script>

<main>
	<h1>Wer würde eher?</h1>
	<button type="button" class="border">Online</button> <br />
	<button type="button" class="border" onclick={() => goto(resolve('/hotseat'))}>Hot Seat</button>
	<br />
	<button type="button" class="border">Nur Fragen</button>
</main>
