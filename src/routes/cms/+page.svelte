<!-- #region Scripts -->
<script lang="ts">
	import { onMount } from 'svelte';
	import Icon from '$lib/components/Icon.svelte';
	interface question {
		id: number;
		questionText: string;
		categoryIds: number[];
	}
	let questions = $state<question[]>([]);
	type Category = { id: number; name: string; description: string | null; questionCount: number };
	interface Question {
		id: number;
		questionText: string;
		categoryIds: number[];
	}
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
		const response = await fetch('/api/cms/question/?questionId=all');
		if (!response.ok) errorText = 'Fragen konnten nicht geladen werden.';
		questions = (await response.json()).questions as question[];
		console.log('Loaded questions:', questions);
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
	let editQuestionTextDialog: HTMLDialogElement | null = $state(null);
	let questionToEdit: Question | null = $state(null);
	let editQuestionText: string = $state('');
	function openEditQuestionTextDialog(question: Question) {
		questionToEdit = question;
		editQuestionText = question.questionText ?? '';
		editQuestionTextDialog?.showModal();
	}

	async function patchQuestionText(questionId: number, questionText: string) {
		const response = await fetch(`/api/cms/question/`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ questionId, question_text: questionText })
		});
		if (!response.ok) errorText = 'Frage konnte nicht aktualisiert werden.';
		await loadQuestions();
	}

	let deleteQuestionDialog: HTMLDialogElement | null = $state(null);
	let questionToDelete: Question | null = $state(null);

	function handleAddQuestion(
		event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }
	) {
		event.preventDefault();
		const form = event.currentTarget;
		const questionTextInput = form.elements.namedItem('questionText') as HTMLInputElement;
		const questionText = questionTextInput.value.trim();
		if (questionText) {
			fetch('/api/cms/question', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ question_text: questionText })
			})
				.then((response) => {
					if (!response.ok) throw new Error('Frage konnte nicht hinzugefügt werden.');
					return response.json();
				})
				.then(() => {
					loadQuestions();
					questionTextInput.value = '';
				})
				.catch((error) => {
					errorText = error.message;
				});
		} else {
			errorText = 'Bitte geben Sie eine Frage ein.';
		}
	}
</script>
<!-- #endregion -->

<h1>Kategorien</h1>
<div id="addStuff">
	<form id="addCategoryForm" onsubmit={handleAddCategory}>
		<input type="text" placeholder="Kategoriename" name="categoryName" required />
		<input type="text" placeholder="Beschreibung" name="categoryDescription" />
		<button type="submit">Kategorie hinzufügen</button>
	</form>
	<hr />
	<form id="addQuestionForm" onsubmit={handleAddQuestion}>
		<input type="text" placeholder="Fragenstellung" name="questionText" required style="flex: 1;" />
		<button type="submit">Frage hinzufügen</button>
	</form>
</div>
<table>
	<thead>
		<tr>
			<th>ID</th>
			<th>Frage</th>
			{#each categories as category (category.id)}
				<th
					>{category.name}
					<button
						onclick={() => {
							openEditCategoryDialog(category);
						}}
					>
						<Icon name="edit" />
					</button>
					<button
						onclick={() => {
							categoryToDelete = category;
							deleteDialog?.showModal();
						}}><Icon name="delete" color="#ff0000" /></button
					>
				</th>
			{/each}
		</tr>
	</thead>
	<tbody>
		{#each questions as question (question.id)}
			<tr>
				<td>{question.id}</td>
				<td class="questionText"
					><button onclick={() => openEditQuestionTextDialog(question)}><Icon name="edit" /></button
					>
					{question.questionText}</td
				>
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

{#if errorText}
	<p class="error">{errorText}</p>
{/if}

<!-- #region Dialogs -->
<dialog bind:this={deleteDialog}>
	<h3>Kategorie löschen</h3>
	<p>Möchten Sie die Kategorie {categoryToDelete?.name} wirklich löschen?</p>
	<div>
		<button
			class="delete"
			onclick={() => {
				if (categoryToDelete) deleteCategory(categoryToDelete.id);
				deleteDialog?.close();
				categoryToDelete = null;
				loadCategories();
			}}>Löschen</button
		>
		<button class="confirm" onclick={() => deleteDialog?.close()}>Abbrechen</button>
	</div>
</dialog>
<dialog class="editCategoryDialog" bind:this={editCategoryDialog}>
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
		<div>
			<button class="confirm" type="submit">Speichern</button>
			<button class="cancel" onclick={() => editCategoryDialog?.close()} type="button"
				>Abbrechen</button
			>
		</div>
	</form>
</dialog>
<dialog class="editQuestionDialog" bind:this={editQuestionTextDialog}>
	<button
		class="delete"
		onclick={() => {
			if (questionToEdit) {
				questionToDelete = questionToEdit;
				deleteQuestionDialog?.showModal();
			}
		}}>Frage löschen<Icon name="delete" /></button
	>
	<h3>Frage bearbeiten</h3>
	<form
		onsubmit={(e) => {
			e.preventDefault();
			if (questionToEdit) {
				const form = e.target as HTMLFormElement;
				const textInput = form.elements.namedItem('editQuestionText') as HTMLInputElement;
				const text = textInput.value.trim();
				patchQuestionText(questionToEdit.id, text);
			}
			editQuestionTextDialog?.close();
			questionToEdit = null;
			loadQuestions();
		}}
	>
		<textarea name="editQuestionText" bind:value={editQuestionText} placeholder="Frage"></textarea>
		<div>
			<button class="confirm" type="submit">Speichern</button>
			<button class="cancel" onclick={() => editQuestionTextDialog?.close()} type="button"
				>Abbrechen</button
			>
		</div>
	</form>
</dialog>
<dialog bind:this={deleteQuestionDialog}>
	<h3>Frage löschen</h3>
	<p>Möchten Sie die Frage {questionToDelete?.questionText} wirklich löschen?</p>
	<button
		class="delete"
		onclick={async () => {
			if (questionToDelete) {
				await fetch(`/api/cms/question/`, {
					method: 'DELETE',
					body: JSON.stringify({ questionId: questionToDelete.id })
				});
			}
			deleteQuestionDialog?.close();
			editQuestionTextDialog?.close();
			questionToDelete = null;
			questionToEdit = null;
			loadQuestions();
		}}>Löschen</button
	>
	<button
		class="confirm"
		onclick={() => {
			deleteQuestionDialog?.close();
		}}>Abbrechen</button
	>
</dialog>

<!-- #endregion -->

<style>
	dialog[open] {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	dialog {
		background-color: #0a1531;
		color: #ffffff;
		padding: 1rem;
		border-radius: 0.5rem;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
	}
	dialog input {
		font-size: 1.5rem;
	}
	dialog div {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
	}
	dialog div * {
		font-size: 1.25rem;
		flex-grow: 1;
	}
	dialog h3 {
		color: #ffffff;
		font-size: 3rem;
	}
	.error {
		color: red;
	}
	.editCategoryDialog {
		width: min(50%, calc(200px + 25%));
	}
	.editCategoryDialog form {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.confirm {
		background-color: #4caf50;
		color: white;
		border: none;
		cursor: pointer;
	}
	.cancel {
		background-color: #f44336;
		color: white;
		border: none;
		cursor: pointer;
	}
	.editQuestionDialog {
		width: min(50%, calc(200px + 25%));
	}
	.editQuestionDialog form {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.delete {
		background-color: #8e0900;
		color: white;
		border: none;
		cursor: pointer;
		align-self: flex-end;
	}
	textarea {
		field-sizing: content;
		resize: none;
		padding: 0.1em 0.3em;
	}
	table {
		border-collapse: collapse;
		font-size: 1.5rem;
		background-color: #0a1531;
		margin-bottom: 1rem;
	}
	thead {
		position: sticky;
		z-index: 100;
		font-size: 1.2em;
		top: 0;
		background-color: #123068;
	}
	th,
	td {
		border: 1px solid #ffffff;
		padding: 0.5rem;
		text-align: center;
	}
	th button {
		margin-left: 0.2rem;
	}
	.questionText {
		text-align: left;
	}
	input[type='checkbox'] {
		transform: scale(1.5);
		accent-color: #4caf50;
		cursor: pointer;
	}

	#addStuff {
		display: flex;
		align-items: center;
		flex-direction: column;
		padding: 2rem;
		border: 1px solid #ffffff;
		margin-bottom: 1rem;
	}
	#addStuff form {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 1.5rem;
		gap: 1rem;
	}
	#addStuff * {
		font-size: 1.5rem;
	}
	hr {
		border: none;
		height: 1px;
		background-color: hsl(0, 0%, 100%, 0.5);
		margin: 1rem 0;
		width: 100%;
	}
</style>
