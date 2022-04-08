<script lang="ts">
    import { defaultBoard, findMoves, Move, pieceTeam } from "./Chess";
    import { fade } from "svelte/transition";
    import BoardSpot from "./BoardSpot.svelte";
    import { onMount } from "svelte";
    import GameSettings from "./GameSettings.svelte";
    import type Game from "./Game";

    export let game: Game;

    let board: number[][] = game.board;

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
                game.turn = !game.turn;
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
        } else if (pieceTeam(piece) == game.turn) {
            possibleMoves = findMoves({
                type: piece,
                x, y
            }, board);
            possibleMoveSpots = possibleMoves.map((move) => move.y * 8 + move.x);
        }
    }
</script>

<div class="wrapper">
    {#if showing}
        <div class="board" transition:fade>
                {#each board as row, y}
                    {#each row as piece, x}
                        <div>
                            <BoardSpot possibleMoves={possibleMoveSpots} on:movesRequested={movesRequested} board={board} value={piece} x={x} y={y}/>
                        </div>
                    {/each}
                {/each}
        </div>
        <!-- <div class="icon" transition:fade>
            <GameSettings />
        </div> -->
    {/if}
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
        --grid-size: calc(min(90vw, 90vh) / 8);
    }

    .icon {
        display: flex;
        height: calc(var(--grid-size) * 8);
        align-items: flex-start;
    }

    .board {
        display: grid;
        grid-template-columns: repeat(8, var(--grid-size));
        grid-template-rows: repeat(8, var(--grid-size));
        grid-auto-flow: row;
        filter: drop-shadow(0 0 10px black);
    }
</style>