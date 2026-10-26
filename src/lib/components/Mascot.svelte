<script lang="ts">
	interface Props {
		mimic: 'celebrating' | 'challenging' | 'happy' | 'no_clue' | 'normal' | 'thinking';
		caption?: string;
		size?: 'small' | 'medium' | 'large';
	}

	let { mimic, caption = '', size = 'medium' }: Props = $props();

	const maxWidth = {
		small: 'clamp(120px, 25vw, 260px)',
		medium: 'clamp(180px, 32vw, 360px)',
		large: 'clamp(260px, 40vw, 460px)'
	} as const;
</script>

<figure class="mascot" style:--mascot-size={maxWidth[size]}>
	<img src="/politician/{mimic}.png" alt="Spielmoderator" width="1024" height="1536" />
	{#if caption}
		<figcaption>{caption}</figcaption>
	{/if}
</figure>

<style>
	.mascot {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		margin: 0;
	}

	.mascot img {
		width: 100%;
		max-width: var(--mascot-size, 180px);
		height: auto;
		border: 2px solid var(--color-roulette-gold, #c9a227);
		border-radius: 1rem;
		background: linear-gradient(180deg, #1a1a1a, #0a0a0a);
		box-shadow: 0 0 40px rgba(201, 162, 39, 0.2);
	}

	.mascot figcaption {
		color: var(--color-roulette-gold-light, #e6c86b);
		font-size: clamp(0.9rem, 2vw, 1.25rem);
		font-weight: 600;
		text-align: center;
	}
</style>
