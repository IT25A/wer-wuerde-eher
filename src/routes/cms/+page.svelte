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
		if (!response.ok) errorText = 'Fragen konnten nicht geladen werden.';
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
		if (!response.ok) errorText = 'Kategorie konnte nicht hinzugefügt werden.';
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

	async function deleteCategory(categoryId: number) {
		const response = await fetch(`/api/cms/categories/`, {
			method: 'DELETE',
			body: JSON.stringify({ categoryId: categoryId })
		});
		if (!response.ok) errorText = 'Kategorie konnte nicht gelöscht werden.';
		await loadCategories();
	}

	let deleteDialog: HTMLDialogElement | null = null;
	let categoryToDelete: Category | null = $state(null);

	async function toggleCategory(
		categoryId: number,
		questionIds: number | number[],
		checked: boolean
	) {
		const response = await fetch(`/api/cms/categories/`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ categoryId, questionIds, action: checked ? 'add' : 'remove' })
		});
		if (!response.ok) errorText = 'Kategorie konnte nicht aktualisiert werden.';
		await loadQuestions();
	}

	async function patchCategoryDetails(categoryId: number, name?: string, description?: string) {
		const response = await fetch(`/api/cms/categories/`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ categoryId, name, description, action: 'updateDetails' })
		});
		if (!response.ok) errorText = 'Kategorie konnte nicht aktualisiert werden.';
		await loadCategories();
	}
	let editCategoryDialog: HTMLDialogElement | null = null;
	let categoryToEdit: Category | null = $state(null);
	let editCategoryName: string = $state('');
	let editCategoryDescription: string = $state('');
	function openEditCategoryDialog(category: Category) {
		categoryToEdit = category;
		editCategoryName = category.name ?? '';
		editCategoryDescription = category.description ?? '';
		editCategoryDialog?.showModal();
	}
</script>

<h1>Kategorien</h1>
<table>
	<thead>
		<tr>
			<th>ID</th>
			<th>Frage</th>
			{#each categories as category (category.id)}
				<th
					>{category.name}<button
						onclick={() => {
							categoryToDelete = category;
							deleteDialog?.showModal();
						}}>X</button
					>
					<button
						onclick={() => {
							openEditCategoryDialog(category);
						}}
					>
						Bearbeiten
					</button>
				</th>
			{/each}
		</tr>
	</thead>
	<tbody>
		{#each questions as question (question.id)}
			<tr>
				<td>{question.id}</td>
				<td>{question.questionText}</td>
				{#each categories as category (category.id)}
					<td
						><input
							type="checkbox"
							checked={question.categoryIds.includes(category.id)}
							onchange={(e) => toggleCategory(category.id, question.id, e.currentTarget.checked)}
						/></td
					>
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

<dialog bind:this={deleteDialog}>
	<h3>Kategorie löschen</h3>
	<p>Möchten Sie die Kategorie {categoryToDelete?.name} wirklich löschen?</p>
	<button onclick={() => deleteDialog?.close()}>Abbrechen</button>
	<button
		onclick={() => {
			if (categoryToDelete) deleteCategory(categoryToDelete.id);
			deleteDialog?.close();
			categoryToDelete = null;
			loadCategories();
		}}>Löschen</button
	>
</dialog>
<dialog bind:this={editCategoryDialog}>
	<h3>Kategorie bearbeiten</h3>
	<form
		onsubmit={(e) => {
			e.preventDefault();
			if (categoryToEdit) {
				const form = e.target as HTMLFormElement;
				const nameInput = form.elements.namedItem('editCategoryName') as HTMLInputElement;
				const descriptionInput = form.elements.namedItem(
					'editCategoryDescription'
				) as HTMLInputElement;
				const name = nameInput.value.trim();
				const description = descriptionInput.value.trim();
				patchCategoryDetails(categoryToEdit.id, name, description);
			}
			editCategoryDialog?.close();
			categoryToEdit = null;
			loadCategories();
		}}
	>
		<input
			type="text"
			name="editCategoryName"
			bind:value={editCategoryName}
			placeholder="Kategoriename"
		/>
		<textarea
			name="editCategoryDescription"
			bind:value={editCategoryDescription}
			placeholder="Beschreibung"></textarea>
		<button type="submit">Speichern</button>
		<button onclick={() => editCategoryDialog?.close()}>Abbrechen</button>
	</form>
</dialog>
