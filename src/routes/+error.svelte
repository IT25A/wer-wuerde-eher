<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
</script>

<main class="page-box glow-box">
	<h1 class="status">{page.status}</h1>
	<p class="subtitle">
		{page.status === 404
			? 'Diese Seite gibt es leider nicht.'
			: 'Da ist leider etwas schiefgelaufen.'}
	</p>
	<a class="online-primary home" href={resolve('/')}>Zurück zum Hauptmenü</a>
</main>

<style>
	.status {
		font-size: 6rem;
	}

	.subtitle {
		color: var(--color20);
	}

	.home {
		display: inline-flex;
		align-items: center;
		color: var(--text-color);
		text-decoration: none;
	}
</style>
