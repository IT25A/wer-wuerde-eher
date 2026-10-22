<script lang="ts">
	import { questions } from '#lib/dummyData/fragen';
</script>

{#each questions as q}
	<div class="question">
		<p>{q.text}</p>
		<p>ID: {q.id}</p>
		{#if q.tags}
			<p>{q.tags.join(', ')}</p>
		{/if}
	</div>
{/each}

<style>
	.question {
		border: 1px solid #ccc;
		padding: 10px;
		margin-bottom: 10px;
	}
</style>
