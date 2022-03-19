<script lang="ts">
    import { defaultBoard } from "./Chess";
    import BoardSpot from "./BoardSpot.svelte";
    let board = defaultBoard;
</script>

<div class="board">
    {#each board as row, y}
        {#each row as piece, x}
            <BoardSpot value={piece} x={x} y={y}/>
        {/each}
    {/each}
</div>