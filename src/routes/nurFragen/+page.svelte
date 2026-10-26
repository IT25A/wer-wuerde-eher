<script lang="ts">
	import { questions } from '$lib/questions';
	function randomQuestion() {
		return questions[Math.floor(Math.random() * questions.length)];
	}
	let question = $state(randomQuestion());
</script>

<p>Wer würde <span class="question">{question}</span></p>
<button onclick={() => (question = randomQuestion())}>Neue Frage</button>

<style>
	:global(body) {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 100dvh;
		font-family: 'Bebas Neue', cursive;
	}
	p {
		font-size: 3rem;
		text-align: center;
	}
	.question {
		color: hsl(20, 100%, 50%);
		text-shadow: 0 0 20px hsla(20, 100%, 50%, 0.7);
	}
	button {
		display: block;
		padding: 0.5rem 1rem;
		width: min(80%, 300px);
		font-size: 1.5rem;
		background-color: hsl(20, 100%, 48%);
		color: white;
		border: 1px white solid;
		cursor: pointer;
		text-align: center;
		transition: all 0.1s ease-out;
	}
	button:hover {
		background-color: hsl(22, 100%, 50%);
		transform: scale(1.02);
	}
	button:active {
		transform: scale(0.98);
	}
</style>
