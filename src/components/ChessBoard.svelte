<script lang="ts">
    import { defaultBoard, findMoves, Move } from "./Chess";
    import { fade } from "svelte/transition";
    import BoardSpot from "./BoardSpot.svelte";
    import { onMount } from "svelte";
    let board = defaultBoard;

    let possibleMoves: Move[] = [];
    let possibleMoveSpots: number[] = [];

    let showing = false;
    onMount(() => showing = true);

    function movesRequested(event): void {
        let x: number = event.detail.x as number;
        let y: number = event.detail.y as number;
        if (possibleMoveSpots.indexOf(y * 8 + x) != -1) {
            move(x, y);
        } else {
            generateMoves(x, y);
        }
    }

    function move(x: number, y: number): void {
        for (let move of possibleMoves) {
            if (move.x == x && move.y == y) {
                move.do(board);
                board = [... board];
                possibleMoves = [];
                possibleMoveSpots = [];
                return;
            }
        }
    }

    function generateMoves(x: number, y: number): void {
        // return;
        let piece = board[y][x];
        if (piece == -1) {
            possibleMoves = [];
            possibleMoveSpots = [];
        } else {
            possibleMoves = findMoves({
                type: piece,
                x, y
            }, board);
            possibleMoveSpots = possibleMoves.map((move) => move.y * 8 + move.x);
        }
    }
</script>

<div class="wrapper">
    <div class="board">
        {#if showing}
            {#each board as row, y}
                {#each row as piece, x}
                    <div transition:fade={{delay: (y * 8 + x) * 35 + 350, duration: 300}}>
                        <BoardSpot possibleMoves={possibleMoveSpots} on:movesRequested={movesRequested} board={board} value={piece} x={x} y={y}/>
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