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
			const response = await fetch('/api/categories');
			if (!response.ok) throw new Error('Kategorien konnten nicht geladen werden.');
			categories = (await response.json()) as Category[];
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

{#if errorText}
	<div class="text-red-500">{errorText}</div>
{/if}
