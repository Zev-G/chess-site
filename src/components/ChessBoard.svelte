<script lang="ts">
    import { findMoves, Move, pieceTeam } from "./Chess";
    import { fade } from "svelte/transition";
    import BoardSpot from "./BoardSpot.svelte";
    import BoardPopup from "./BoardPopup.svelte";
    import { onMount } from "svelte";
    import GameSettings from "./GameSettings.svelte";
    import Game from "./Game";

    export let game: Game;
    let teamWon: number = game.checkWinState();
    $: winText = teamWon == null ? "Game still running" : (teamWon == 0 ? "It's a tie" : (teamWon == 1 ? "White won" : "Black won"));

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
                doMove(move);
                return;
            }
        }
    }

    function doMove(move: Move) {
        move.do(board);
        board = [... board];
        possibleMoves = [];
        possibleMoveSpots = [];
        game.turn = !game.turn;
        teamWon = game.checkWinState();
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

    function restartGame(): void {
        game = new Game();
        board = game.board;
        teamWon = game.checkWinState();
    }
</script>

<div class="wrapper">
    {#if showing}
        <div class={"board" + (teamWon !== null ? " grayed-out" : "")} transition:fade>
                {#each board as row, y}
                    {#each row as piece, x}
                        <div>
                            <BoardSpot possibleMoves={possibleMoveSpots} on:movesRequested={movesRequested} board={board} value={piece} x={x} y={y}/>
                        </div>
                    {/each}
                {/each}
        </div>
        {#if teamWon !== null}
            <BoardPopup>
                <div>
                    {#if teamWon == 0}
                        <img alt="tie" src="/tie.png">
                    {:else if teamWon == 1}
                        <img alt="white won" src="/white/king.png">
                    {:else if teamWon == -1}
                        <img alt="black won" src="/black/king.png">
                    {/if}
                </div>
                <h1>{winText}</h1>
                <div>
                    <button on:click={restartGame}>Play again</button>
                </div>
            </BoardPopup>
        {/if}
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

    h1 {
        margin-top: 0;
        margin-bottom: 0.1em;
    }
    img {
        width: calc(var(--grid-size) * 1.25);
    }
    button {
        font-size: calc(var(--grid-size) * 0.175);
    }

    .grayed-out {
        opacity: 0.5;
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
        transition: opacity 0.5s;
    }
</style>