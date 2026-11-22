<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=cycle,indeterminate_question_box,public"
	/>
</svelte:head>
<main>
	<h1>Wer würde eher?</h1>
	<div id="button-container">
		<button type="button" id="online" onclick={() => goto(resolve('/online'))}>
			Online <span class="material-symbols-outlined"> public </span>
		</button>
		<button type="button" id="hotseat" onclick={() => goto(resolve('/hotseat'))}>
			Hot Seat <span class="material-symbols-outlined"> cycle </span>
		</button>
		<button type="button" id="q_only" onclick={() => goto(resolve('/nurFragen'))}>
			Nur Fragen <span class="material-symbols-outlined"> indeterminate_question_box </span>
		</button>
	</div>
	<a class="back-link cms-link" href={resolve('/cms')}>Fragen verwalten</a>
</main>

<style>
	#online {
		background: linear-gradient(30deg, hsl(140, 100%, 35%), hsl(120, 100%, 35%));
	}
	#hotseat {
		background: linear-gradient(30deg, hsl(200, 100%, 40%), hsl(240, 100%, 45%));
	}
	#q_only {
		background: linear-gradient(30deg, hsl(30, 100%, 40%), hsl(00, 100%, 45%));
	}

	h1 {
		font-size: 6rem;
		margin: 0;
		text-shadow: 0 0 4em	 hsla(0, 0%, 100%, 0.5);
	}
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100dvh;
		width: 100%;
		text-align: center;
	}
	#button-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 90%;
		max-width: 600px;
		button {
			width: 80%;
			margin: 0.5rem 0;
			padding: 0.5rem 1rem;
			font-size: 1.5rem;
			cursor: pointer;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			transition: all 0.1s ease-out;
			border: 2px solid hsla(0, 0%, 100%, 0.7);
			text-shadow: 0 0 10px hsla(0, 0%, 100%, 0.3);
		}
		button:hover {
			background-color: hsl(22, 100%, 50%);
			transform: scale(1.02);
		}
		button:active {
			transform: scale(0.98);
		}
		button:disabled {
			filter: grayscale(100%);
			cursor: not-allowed;
		}
		button:active:disabled {
			animation: wiggleX 0.3s ease-out;
		}
	}
	.material-symbols-outlined {
		font-size: 1em;
		vertical-align: middle;
		font-variation-settings:
			'FILL' 0,
			'wght' 400,
			'GRAD' 0,
			'opsz' 24;
	}
	.cms-link {
		margin-top: 1rem;
	}

	@keyframes wiggleX {
		0% {
			transform: translateX(0);
		}
		15% {
			transform: translateX(-0.7rem);
		}
		30% {
			transform: translateX(0.7rem);
		}
		45% {
			transform: translateX(-0.5rem);
		}
		60% {
			transform: translateX(0.4rem);
		}
		75% {
			transform: translateX(-0.3rem);
		}
		90% {
			transform: translateX(0.2rem);
		}
		100% {
			transform: translateX(0);
		}
	}
</style>
