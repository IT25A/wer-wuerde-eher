<script lang="ts">
	const settingsDialog = document.getElementById('settings-dialog') as HTMLDialogElement;
	const languageDialog = document.getElementById('language-dialog') as HTMLDialogElement;

	function openSettings() {
		settingsDialog.showModal();
	}

	function openLanguage() {
		languageDialog.showModal();
	}
</script>

<div id="options">
	<button class="material-symbols-outlined" onclick={openLanguage}> language </button>
	<button class="material-symbols-outlined" onclick={openSettings}> settings</button>
</div>

<dialog id="settings-dialog"></dialog>
<dialog id="language-dialog"></dialog>

<style>
	#options {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		color: gray;
		z-index: 1000;
		button {
			font-size: 2rem;
			cursor: not-allowed;
			transition: all 0.1s ease-out;
		}
		button:hover {
			color: hsl(0, 0%, 80%);
			transform: scale(1.05);
		}
		button:active {
			transform: scale(0.95);
			animation: wiggleX 0.3s ease-out;
		}
	}
</style>
