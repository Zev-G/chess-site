<script lang="ts">
    import { findMoves, Move, PawnPromotion, pieceTeam, type Piece } from "./Chess";
    import { fade } from "svelte/transition";
    import BoardSpot from "./BoardSpot.svelte";
    import BoardPopup from "./BoardPopup.svelte";
    import { onMount } from "svelte";
    import GameSettings from "./GameSettings.svelte";
    import Game from "./Game";
    import GameSettingsToggle from "./GameSettingsToggle.svelte";
    import { Player } from "./Opponent";
    import RandomOpp from "./RandomOpp";
    import { SuperEasy, Easy, Medium, Tough } from "./Minimax";
    import BoardDataGate from "./BoardDataGate";
    import GameSideBar from "./GameSideBar.svelte";
    import PastMove from "./PastMove";

    export let game: Game;
    let teamWon: number = game.checkWinState();
    $: winText = teamWon == null ? "Game still running" : (teamWon == 0 ? "It's a tie" : (teamWon == 1 ? "White won" : "Black won"));

    let board: number[][] = game.board;

    let possibleMoves: Move[] = [];
    let possibleMoveSpots: number[] = [];

    let promotingPawn: PawnPromotion = null;
    let showingSettings: boolean = false;

    let whiteController = "player";
    let blackController = "player";

    let dataGate = new BoardDataGate();

    let moveHistory: Move[] = [];
    let pastMoves: PastMove[] = [];

    $: game.onMove = (move, prevBoard) => {
        board = [...board];
        possibleMoves = [];
        possibleMoveSpots = [];
        teamWon = game.winState;
        moveHistory = game.moveHistory;
        pastMoves = [...pastMoves, PastMove.convertMove(move, prevBoard)];
    }

    const controllerTransform = {
        player: function() { return new Player() },
        random: function() { return new RandomOpp() },
        super_easy: function() { return new SuperEasy() },
        easy: function() { return new Easy() },
        medium: function() { return new Medium() },
        tough: function() { return new Tough() }
    }

    $: game.blackController = controllerTransform[blackController]();
    $: game.whiteController = controllerTransform[whiteController]();

    $: showingPopup = promotingPawn || showingSettings || teamWon;

    let showing = false;
    onMount(() => showing = true);

    function movesRequested(event): void {
        if (promotingPawn == null) {
            let x: number = event.detail.x as number;
            let y: number = event.detail.y as number;
            if (possibleMoveSpots.indexOf(y * 8 + x) != -1) {
                move(x, y);
            } else {
                generateMoves(x, y);
            }
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
        if (move instanceof PawnPromotion && promotingPawn == null) {
            promotingPawn = move;
            return;
        }
        promotingPawn = null;
        game.doMove(move);
    }

    function promote(to: number) {
        let replacement: number;
        if (to == 4) replacement = 7;
        if (to == 3) replacement = 6;
        if (to == 2) replacement = 4;
        if (to == 1) replacement = 3;
        if (!pieceTeam(promotingPawn.pieces[0])) replacement += 10;
        promotingPawn.replacement = replacement;
        doMove(promotingPawn);
    }

    function generateMoves(x: number, y: number): void {
        // return;
        let piece = board[y][x];
        if (piece == -1) {
            possibleMoves = [];
            possibleMoveSpots = [];
        } else if (pieceTeam(piece) == game.turn && game.controller(pieceTeam(piece)) instanceof Player) {
            possibleMoves = findMoves({
                type: piece,
                x, y
            }, board);
            possibleMoveSpots = possibleMoves.map((move) => move.y * 8 + move.x);
        }
    }

    function restartGame(): void {
        game.stop();
        game = new Game();
        game.blackController = controllerTransform[blackController]();
        game.whiteController = controllerTransform[whiteController]();
        board = game.board;
        teamWon = game.checkWinState();
        pastMoves = [];
    }

    function resetRestartGame(): void {
        game.stop();
        game = new Game();
        board = game.board;
        teamWon = game.checkWinState();
        pastMoves = [];
    }
</script>

<div class="wrapper">
    {#if showing}
        <div class="inner-wrapper">
            <div class={"board" + (showingPopup ? " grayed-out" : "")} transition:fade>
                {#each board as row, y}
                    {#each row as piece, x}
                        <div>
                            <BoardSpot dataGate={dataGate} possibleMoves={possibleMoveSpots} on:movesRequested={movesRequested} on:dragDropped={movesRequested} value={piece} x={x} y={y}/>
                        </div>
                    {/each}
                {/each}
            </div>
            {#if showingSettings}
                <BoardPopup on:outclick={() => showingSettings = false}>
                    <GameSettings bind:whiteController bind:blackController game={game} on:click={() => showingSettings = false}/>
                </BoardPopup>
            {/if}
            {#if promotingPawn !== null}
                <BoardPopup>
                    <h1>Choose promotion</h1>
                    <div class="promotion-options">
                        <button on:click={() => promote(4)}>
                            <img alt="queen" src={`/${pieceTeam(promotingPawn.pieces[0]) ? "white" : "black"}/queen.png`}>
                        </button>
                        <button on:click={() => promote(3)}>
                            <img alt="rook" src={`/${pieceTeam(promotingPawn.pieces[0]) ? "white" : "black"}/rook.png`}>
                        </button>
                        <button on:click={() => promote(2)}>
                            <img alt="bishop" src={`/${pieceTeam(promotingPawn.pieces[0]) ? "white" : "black"}/bishop.png`}>
                        </button>
                        <button on:click={() => promote(1)}>
                            <img alt="knight" src={`/${pieceTeam(promotingPawn.pieces[0]) ? "white" : "black"}/knight.png`}>
                        </button>
                    </div>
                </BoardPopup>
            {/if}
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
        </div>
        <div class="icon" transition:fade>
            <GameSettingsToggle bind:open={showingSettings}/>
        </div>
        <GameSideBar bind:board={board} bind:moveHistory={pastMoves} on:newgame={resetRestartGame}/>
    {/if}
</div>

<style>

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
    
    .promotion-options > button > img {
        width: calc(var(--grid-size) * 0.871);
    }
    .promotion-options {
        margin: 1rem 0;
    }

    .grayed-out {
        opacity: 0.5;
    }

    .wrapper {
        height: 100vh;
        --side-bar-size: 30vw;
        --grid-size: calc(min(85vw - var(--side-bar-size), 90vh) / 8);
    }

    .wrapper, .inner-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
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