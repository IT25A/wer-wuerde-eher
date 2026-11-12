<script lang="ts">
    import { onMount } from 'svelte';
    type Category = { id: number; name: string; description: string | null; questionCount: number }
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
    loadCategories();

</script>
<h1 class="text-3xl font-bold mb-4">Kategorien</h1>
{#each categories as category }
    <div class="card mb-3">
        <h2 class="text-xl font-bold">{category.name}</h2>
        {#if category.description}
            <p class="text-gray-600">{category.description}</p>
        {/if}
        <p class="text-gray-500">Fragen: {category.questionCount}</p>
    </div>
{/each}

{#if errorText}
    <div class="text-red-500">{errorText}</div>
{/if}