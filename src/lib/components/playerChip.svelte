<script lang="ts">
import { game, type Player } from '$lib/game.svelte';
    let {player, allowRemove = false}: { player: Player; allowRemove?: boolean } = $props();
</script>

<span class="player-chip">
    <span class="player-name">{player.name.substring(0, 2).toUpperCase()}</span>
    {#if allowRemove}
    <button
        class="player-remove"
        aria-label="{player} entfernen"
        onclick={() => game.removePlayer(player)}>✕</button
    >
    <span class="full-name">{player.name}</span>
{/if}
</span>

<style>
    .player-chip {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        position: relative;
        width: 3rem;
        height: 3rem;
        font-size: 2rem;
        border-radius: 50%;
        background-color: red;
    }
    .player-chip:hover {
        box-shadow: inset 0 0 0 3px white;
    }
    .player-remove {
        position: absolute;
        right: 0;
        top: 0;
        background: none;
        border: none;
        color: var(--color-text);
        font-size: 1rem;
        cursor: pointer;
    }
    .full-name {
        opacity: 0;
        position: absolute;
        font-size: 0.75rem;
        bottom: 0;
        transition: opacity 0.2s ease-out;
    }
    .player-chip:hover .full-name {
        opacity: 1;
    }
</style>