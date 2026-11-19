<script lang="ts">
	import { onMount } from 'svelte';
	interface question {
		id: number;
		questionText: string;
		categoryIds: number[];
	}
	let questions = $state<question[]>([]);
	type Category = { id: number; name: string; description: string | null; questionCount: number };
	let categories = $state<Category[]>([]);
	let errorText = $state('');
	async function loadCategories() {
		try {
			const response = await fetch('/api/cms/categories/?categoryId=all');
			if (!response.ok) throw new Error('Kategorien konnten nicht geladen werden.');
			categories = (await response.json()).categories as Category[];
			errorText = '';
		} catch {
			errorText = 'Kategorien konnten nicht geladen werden.';
		}
	}

	async function loadQuestions() {
		const response = await fetch('/api/game/allQuestions');
		if (!response.ok) throw new Error('Fragen konnten nicht geladen werden.');
		questions = (await response.json()).questions as question[];
	}

	onMount(() => {
		loadCategories();
		loadQuestions();
	});
	async function addCategory(name: string, description: string) {
		const response = await fetch('/api/cms/categories', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ categoryName: name, description: description })
		});
		if (!response.ok) throw new Error('Kategorie konnte nicht hinzugefügt werden.');
		await loadCategories();
	}
	async function handleAddCategory(event: Event) {
		event.preventDefault();
		const form = event.target as HTMLFormElement;
		const nameInput = form.elements.namedItem('categoryName') as HTMLInputElement;
		const descriptionInput = form.elements.namedItem('categoryDescription') as HTMLInputElement;
		const name = nameInput.value.trim();
		const description = descriptionInput.value.trim();
		if (name) {
			await addCategory(name, description).catch((error) => {
				errorText = error.message;
				return;
			});
			nameInput.value = '';
			descriptionInput.value = '';
		} else {
			errorText = 'Bitte geben Sie einen Kategorienamen ein.';
		}
	}
</script>

<h1>Kategorien</h1>
<table>
	<thead>
		<tr>
			<th>ID</th>
			<th>Frage</th>
			{#each categories as category (category.id)}
				<th>{category.name}</th>
			{/each}
		</tr>
	</thead>
	<tbody>
		{#each questions as question (question.id)}
			<tr>
				<td>{question.id}</td>
				<td>{question.questionText}</td>
				{#each categories as category (category.id)}
					<td><input type="checkbox" checked={question.categoryIds.includes(category.id)} /></td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>
<form id="addCategoryForm" onsubmit={handleAddCategory}>
	<input type="text" placeholder="Kategoriename" name="categoryName" />
	<input type="text" placeholder="Beschreibung" name="categoryDescription" />
	<button type="submit">Kategorie hinzufügen</button>
</form>

{#if errorText}
	<div class="text-red-500">{errorText}</div>
{/if}
