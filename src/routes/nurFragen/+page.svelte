<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';

	// Kategorien und Fragen kommen wie im Hot Seat aus der Datenbank.
	type Category = { id: number; name: string; description: string | null; questionCount: number };

	let categories = $state.raw<Category[]>([]);
	let selectedCategoryIds = $state<number[]>([]);
	let deck = $state.raw<string[]>([]);
	let index = $state(0);
	let isLoading = $state(true);
	let error = $state('');

	const question = $derived(deck[index] ?? '');

	async function loadDeck() {
		error = '';
		if (selectedCategoryIds.length === 0) {
			deck = [];
			error = 'Wählt mindestens eine Kategorie aus.';
			return;
		}
		isLoading = true;
		try {
			const response = await fetch('/api/game/questions', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ categoryIds: selectedCategoryIds, count: 100 })
			});
			const result: { questions?: { questionText: string }[]; error?: string } =
				await response.json();
			if (!response.ok || !result.questions?.length) {
				throw new Error(result.error ?? 'Fragen konnten nicht geladen werden.');
			}
			deck = result.questions.map((q) => q.questionText);
			index = 0;
		} catch (e) {
			deck = [];
			error = e instanceof Error ? e.message : 'Fragen konnten nicht geladen werden.';
		} finally {
			isLoading = false;
		}
	}

	// Nächste Frage aus dem gemischten Stapel; ist er durch, wird neu gemischt.
	function nextQuestion() {
		if (index + 1 < deck.length) index++;
		else void loadDeck();
	}

	function toggleCategory(categoryId: number) {
		selectedCategoryIds = selectedCategoryIds.includes(categoryId)
			? selectedCategoryIds.filter((id) => id !== categoryId)
			: [...selectedCategoryIds, categoryId];
		void loadDeck();
	}

	onMount(async () => {
		try {
			const response = await fetch('/api/categories');
			if (!response.ok) throw new Error();
			categories = (await response.json()) as Category[];
			selectedCategoryIds = categories.map((category) => category.id);
		} catch {
			isLoading = false;
			error = 'Kategorien konnten nicht geladen werden.';
			return;
		}
		await loadDeck();
	});
</script>

<main class="page-box glow-box">
	<p class="subtitle">Nur Fragen · ohne Punkte, einfach diskutieren</p>

	<h1 class="question">
		{#if question}
			Wer würde eher {question}?
		{:else if isLoading}
			Fragen werden geladen …
		{:else}
			Wer würde eher …?
		{/if}
	</h1>

	{#if error}
		<p class="error-text" role="alert">{error}</p>
	{/if}

	<button class="online-primary" onclick={nextQuestion} disabled={isLoading || deck.length === 0}>
		Neue Frage
	</button>

	{#if categories.length > 0}
		<fieldset class="categories">
			<legend>Kategorien</legend>
			{#each categories as category (category.id)}
				<label class="category-label" title={category.description}>
					<input
						type="checkbox"
						checked={selectedCategoryIds.includes(category.id)}
						onchange={() => toggleCategory(category.id)}
					/>
					{category.name}
				</label>
			{/each}
		</fieldset>
	{/if}

	<a class="back-link" href={resolve('/')}>Zurück zum Hauptmenü</a>
</main>

<style>
	.subtitle {
		color: var(--color20);
	}

	.question {
		font-size: clamp(2.5rem, 6vw, 3.5rem);
		line-height: 1.1;
		text-wrap: balance;
	}

	.categories {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.5rem 1.25rem;
		width: 100%;
		margin: 0;
		border: 1px solid var(--text-color);
		padding: 0.5rem 1rem 0.75rem;
	}

	.category-label {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		font-size: 1.35rem;
		cursor: pointer;
	}

	.category-label input {
		accent-color: var(--color20dark);
	}
</style>
