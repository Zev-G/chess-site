<script lang="ts">
    import { defaultBoard } from "./Chess";
    import { fade } from "svelte/transition";
    import BoardSpot from "./BoardSpot.svelte";
import { onMount } from "svelte";
    let board = defaultBoard;

    let showing = false;
    onMount(() => showing = true);
</script>

<div class="wrapper">
    <div class="board">
        {#if showing}
            {#each board as row, y}
                {#each row as piece, x}
                    <div transition:fade={{delay: (y * 8 + x) * 35 + 350, duration: 300}}>
                        <BoardSpot value={piece} x={x} y={y}/>
                    </div>
                {/each}
            {/each}
        {/if}
    </div>
</div>

<style>
    :global(html, body) {
        margin: 0;
        padding: 0;
        background-color: rgb(29, 31, 36);
    }

    .wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
    }

    .board {
        display: grid;
        --grid-size: calc(min(90vw, 90vh) / 8);
        grid-template-columns: repeat(8, var(--grid-size));
        grid-template-rows: repeat(8, var(--grid-size));
        grid-auto-flow: row;
        filter: drop-shadow(0 0 20px black)
    }
</style>