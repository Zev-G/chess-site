<script lang=ts>
    import { createEventDispatcher, tick } from "svelte";

    import { fade } from "svelte/transition";
    import { CastleMove, imageMap, pieceKind, pieceName, pieceTeam, type Move } from "./Chess";
    import type PastMove from "./PastMove";
    import IoMdRefresh from 'svelte-icons/io/IoMdRefresh.svelte'

    export let moveHistory: PastMove[];
    export let board: number[][];
    
    let content: HTMLDivElement;

    $: {
        moveHistory;
        (async () => {
            await tick();
            if (content) {
                content.scrollTo({ top: content.scrollHeight, behavior: 'smooth' });
            }
        })();
    }

    const dispatch = createEventDispatcher();

    function newGame() {
        dispatch("newgame", {});
    }

    function restartGame() {
        dispatch("restartgame", {});
    }
</script>

<div class="side-bar">
    <div class="header">
        Moves
    </div>
    <div class="content" bind:this={content}>
        {#each moveHistory as move}
            <div class="move">
                <img src={imageMap[move.moving]} alt="chess piece">
                <p>{move.formattedString()}</p>
            </div>
        {/each}
    </div>
    <div class="footer">
        <button on:click={newGame}>New Game</button>
        <button class="restart-game" on:click={restartGame}><IoMdRefresh/></button>
    </div>
</div>

<style>
    .side-bar {
        height: calc(var(--grid-size) * 8);
        display: grid;
        grid-template-rows: auto 1fr auto;
        background-color: rgb(49, 49, 52);
        border-radius: calc(var(--grid-size) * 0.05);
        width: var(--side-bar-size);
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
        gap: calc(var(--side-bar-size) / 30);
        align-items: center;
        justify-content: center;
    }

    .header {
        background-color: rgb(34, 34, 35);
        filter: drop-shadow(0 5px 5px rgba(0, 0, 0, 0.1));
        font-size: calc(var(--side-bar-size) / 8);
    }

    .content {
        /* display: flex;
        align-items: center;
        justify-content: center; */
        color: lightgray;

        background-position-x: -1px;
        --bg-grid-size: calc(var(--grid-size) / 3);
        font-size: var(--bg-grid-size);
        background-size: var(--bg-grid-size) var(--bg-grid-size);
        --grid-color: rgb(59, 59, 62);
        background-image:
            linear-gradient(to right, var(--grid-color) 1px, transparent 1px),
            linear-gradient(to bottom, var(--grid-color) 1px, transparent 1px);
        overflow-y: scroll;
    }

    .move {
        display: flex;
        align-items: center;
        gap: calc(var(--bg-grid-size) / 8);
    }

    .move img {
        height: var(--bg-grid-size);
    }

    .move p {
        margin: 0;
        font-size: 0.6em;
    }

    .footer {
        background-color: rgb(55 55 59);
        filter: drop-shadow(0 -6px 5px rgba(0, 0, 0, 0.1));
    }

    button {
        font-size: calc(var(--side-bar-size) / 20);
        border-radius: 0.15em;
        background-color: rgb(36, 36, 38);
    }

    button:hover {
        background-color: rgb(29, 29, 31);
    }

    .restart-game {
        width: calc(var(--side-bar-size) / 6.6);
        padding: calc(var(--side-bar-size) / 80) calc(var(--side-bar-size) / 30) 0 calc(var(--side-bar-size) / 30);
    }

</style>