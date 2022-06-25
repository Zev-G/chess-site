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
import { transition_out } from "svelte/internal";

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

    let showBoard = true;

    $: game.onMove = (move, prevBoard) => {
        let controller = game.turn ? game.blackController : game.whiteController;
        console.log(controller.isPlayer());
        
        if (!controller.isPlayer()) {
            console.log(`1asdf`);
            animateMove(move);
        }
        board = [...board];
        possibleMoves = [];
        possibleMoveSpots = [];
        teamWon = game.winState;
        if (teamWon != null && showingSettings) {
            showingSettings = false;
        }
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

    let fromDrag: boolean = false;

    function dragDropped(event) {
        fromDrag = true;
        movesRequested(event);
    }
    function movesRequested(event): void {
        if (promotingPawn == null) {
            let x: number = event.detail.x as number;
            let y: number = event.detail.y as number;
            if (possibleMoveSpots.indexOf(y * 8 + x) != -1) {
                move(x, y);
            } else {
                generateMoves(x, y);
                fromDrag = false;
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
        if (!fromDrag) {            
            animateMove(move);
        }
        fromDrag = false;
        game.doMove(move);
    }

    function animateMove(move: Move) {
        dataGate.spots[move.fromX + move.fromY * 8].animateTo(move.x, move.y);
        dataGate.spots[move.x + move.y * 8].suspend();
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

    function showNewGameView() {
        showBoard = false;
        showingSettings = false;
        teamWon = null;
        game.running = false;
    }

    function startGame() {
        showBoard = true;
        restartGame();
    }
</script>

<div class="wrapper">
    {#if showing}
        <div class="inner-wrapper">
            <div class="board-wrapper">
                <div class={"board-settings" + (!showBoard ? " not-absolute" : "")} style={showBoard ? `transition: opacity 0ms 500ms; opacity: 0;` : `opacity: 1;`}>
                    <div class="board-grid-bg">
                        <h1>Create New Game</h1>
                        <div class="ai-controllers">
                            <div class="white-controller">
                                White Controller
                                <ul>
                                    <li class={whiteController == "player" ? "selected" : ""} on:click={() => whiteController = "player"}>Player</li>
                                    <li class={whiteController == "random" ? "selected" : ""} on:click={() => whiteController = "random"}>Random</li>
                                    <li class={whiteController == "easy" ? "selected" : ""} on:click={() => whiteController = "easy"}>Easy</li>
                                    <li class={whiteController == "medium" ? "selected" : ""} on:click={() => whiteController = "medium"}>Medium</li>
                                    <li class={whiteController == "tough" ? "selected" : ""} on:click={() => whiteController = "tough"}>Tough</li>
                                </ul>
                            </div>
                            <div class="black-controller">
                                Black Controller
                                <ul>
                                    <li class={blackController == "player" ? "selected" : ""} on:click={() => blackController = "player"}>Player</li>
                                    <li class={blackController == "random" ? "selected" : ""} on:click={() => blackController = "random"}>Random</li>
                                    <li class={blackController == "easy" ? "selected" : ""} on:click={() => blackController = "easy"}>Easy</li>
                                    <li class={blackController == "medium" ? "selected" : ""} on:click={() => blackController = "medium"}>Medium</li>
                                    <li class={blackController == "tough" ? "selected" : ""} on:click={() => blackController = "tough"}>Tough</li>
                                </ul>
                            </div>
                        </div>
                        <h2>FEN</h2>
                        <input type="text" name="" id="" value="Not implemented yet">
                        <button on:click={startGame}>Start Game</button>
                    </div>
                </div>
                    <div class={"board" + (showingPopup ? " grayed-out" : "")} style={showBoard ? "" : "pointer-events: none;"}>
                        {#each board as row, y}
                            {#each row as piece, x}
                                <div>
                                    <BoardSpot show={showBoard} dataGate={dataGate} possibleMoves={possibleMoveSpots} on:movesRequested={movesRequested} on:dragDropped={dragDropped} value={piece} x={x} y={y}/>
                                </div>
                            {/each}
                        {/each}
                    </div>
            </div>
            {#if showingSettings && showBoard}
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
        <div class="icon" style={showBoard ? "" : "pointer-events: none;"}>
            <GameSettingsToggle bind:open={showingSettings}/>
        </div>
        <GameSideBar bind:board={board} bind:moveHistory={pastMoves} on:newgame={() => {
            if (showBoard) {
                showNewGameView();
            } else {
                startGame();
            }
        }} on:restartgame={restartGame}/>
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
    /* button {
        font-size: calc(var(--grid-size) * 0.175);
    } */
    
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
        position: absolute;
        display: grid;
        grid-template-columns: repeat(8, var(--grid-size));
        grid-template-rows: repeat(8, var(--grid-size));
        grid-auto-flow: row;
        filter: drop-shadow(0 0 10px black);
        transition: opacity 0.5s;
    }

    .board-wrapper {
        width: calc(8 * var(--grid-size));
        height: calc(8 * var(--grid-size));
    }

    .board-settings {
        width: calc(8 * var(--grid-size));
        height: calc(8 * var(--grid-size));
        position: absolute;

        background-color: rgb(36, 36, 38);

        color: white;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-size: calc(var(--grid-size) / 4);
    }

    .board-grid-bg {
        width: calc(8 * var(--grid-size));
        height: calc(8 * var(--grid-size));
        position: absolute;

        /* padding: 0 calc(var(--grid-size) / 4); */
        display: flex;
        align-items: center;
        flex-direction: column;

        background-size: calc(var(--grid-size) - 1px/4) calc(var(--grid-size) - 1px/4);
        --grid-color: rgb(47, 47, 50);
        background-image:
            linear-gradient(to right, var(--grid-color) 2px, transparent 2px),
            linear-gradient(to bottom, var(--grid-color) 2px, transparent 2px);
    }

    .board-settings h1 {
        margin-top: calc(var(--grid-size) / 8);
    }
    
    .board-settings ul {
        margin-top: calc(var(--grid-size) / 8);
        font-size: calc(var(--grid-size) / 5);
        color: lightgray;
        padding-left: 0;
    }

    li {
        list-style: none;
        padding: calc(var(--grid-size) / 14) calc(var(--grid-size) / 4);
        border-radius: calc(var(--grid-size) / 8);
        cursor: pointer;
        transition: padding-left 0.2s, color 0.2s;
    }

    li:hover {
        padding-left: calc(var(--grid-size) / 3);
        color: white;
    }

    li.selected {
        background-color: rgb(25, 25, 26);
    }

    .ai-controllers {
        margin-top: calc(var(--grid-size) / 2.75);
        display: flex;
        gap: var(--grid-size);
        color: rgb(231, 231, 231);
    }

    .white-controller, .black-controller {
        background-color: rgba(25, 25, 26, 0.706);
        padding: calc(var(--grid-size) / 8) calc(var(--grid-size) / 2);
        border-radius: calc(var(--grid-size) / 8);
    }

    h2 {
        margin: calc(var(--grid-size) / 8);
    }

    input {
        margin: 0;
        padding: calc(var(--grid-size) / 16);
        width: calc(var(--grid-size) * 4.5);
        font-size: calc(var(--grid-size) / 5);
        color: lightgray;
        background-color: rgb(25, 25, 26);
        border: none;
        border-radius: calc(var(--grid-size) / 12);
        outline-width: 0;
        pointer-events: none;
        opacity: 0.5;
    }

    button {
        /* font-size: 0.75em; */
        /* border-radius: 0.15em; */
        margin-top: calc(var(--grid-size) / 1.28);
        background-color: rgb(28, 28, 29);
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-size: calc(var(--grid-size) / 2.75);
        border-radius: calc(var(--grid-size) / 7);
    }

    button:hover {
        background-color: rgb(22, 22, 23);
    }
</style>