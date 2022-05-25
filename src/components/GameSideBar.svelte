<script lang=ts>
import { createEventDispatcher } from "svelte";

    import { fade } from "svelte/transition";

    let dispatch = createEventDispatcher();

    function newGame() {
        dispatch("newgame", {});
    }
</script>

<div class="side-bar" transition:fade>
    <div class="header">
        Moves
    </div>
    <div class="content">
        Coming soon
    </div>
    <div class="footer">
        <button on:click={newGame}>New Game</button>
    </div>
</div>

<style>
    .side-bar {
        height: calc(var(--grid-size) * 8);
        display: grid;
        grid-template-rows: auto 1fr auto;
        background-color: rgb(49, 49, 52);
        border-radius: calc(var(--grid-size) * 0.05);
        min-width: var(--side-bar-size);
        font-size: clamp(11px, calc(var(--side-bar-size) / 6), 40px);
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        color: white;
        filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.4));
    }

    .footer, .header {
        --h-padding: calc(var(--side-bar-size) / 15);
        --v-padding: calc(var(--side-bar-size) / 30);
        padding: var(--v-padding) var(--h-padding);
        min-height: calc(var(--grid-size) - var(--v-padding) * 2);
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .header {
        background-color: rgb(34, 34, 35);
        filter: drop-shadow(0 5px 5px rgba(0, 0, 0, 0.1));
        font-size: 1.15em;
    }

    .content {
        font-size: 0.75em;
        display: flex;
        align-items: center;
        justify-content: center;
        color: lightgray;

        background-position-x: -1px;
        --bg-grid-size: calc(var(--grid-size) / 3);
        background-size: var(--bg-grid-size) var(--bg-grid-size);
        --grid-color: rgb(59, 59, 62);
        background-image:
            linear-gradient(to right, var(--grid-color) 1px, transparent 1px),
            linear-gradient(to bottom, var(--grid-color) 1px, transparent 1px);
    }

    .footer {
        background-color: rgb(55 55 59);
        filter: drop-shadow(0 -6px 5px rgba(0, 0, 0, 0.1));
    }

    button {
        font-size: 0.75em;
        border-radius: 0.15em;
        background-color: rgb(36, 36, 38);
    }

    button:hover {
        background-color: rgb(29, 29, 31);
    }

</style>