<script lang="ts">
    import { defaultBoard } from "./Chess";
    import BoardSpot from "./BoardSpot.svelte";
    let board = defaultBoard;
</script>

<div class="wrapper">
    <div class="board">
        {#each board as row, y}
            {#each row as piece, x}
                <BoardSpot value={piece} x={x} y={y}/>
            {/each}
        {/each}
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