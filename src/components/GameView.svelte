<script lang="ts">
    import { findMoves, images, Move, PawnPromotion, pieceTeam, type Piece } from "./Chess";
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
    import { interpret, toGame } from "./FEN";
    import FaCode from 'svelte-icons/fa/FaCode.svelte';
    import FaGlobeAfrica from 'svelte-icons/fa/FaGlobeAfrica.svelte';

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

    let fen = "";

    $: game.onMove = (move, prevBoard) => {
        let controller = game.turn ? game.blackController : game.whiteController;
        
        if (!controller.isPlayer()) {
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
        if (fen != "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" && fen != "") {
            const gameTemplate: Game = toGame(interpret(fen));
            game.board = gameTemplate.board;
            game.turn = gameTemplate.turn;
        }
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



    const mobileCheck = function() {
        let check = false;
            (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
    };
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
                        <input type="text" name="" id="" bind:value={fen} placeholder="Set a F.E.N. for the game here.">
                        <button class="start-game" on:click={startGame}>Start Game</button>
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
            <!-- {#if showingSettings && showBoard}
                <BoardPopup on:outclick={() => showingSettings = false}>
                    <GameSettings bind:whiteController bind:blackController game={game} on:click={() => showingSettings = false}/>
                </BoardPopup>
            {/if} -->
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
                            <img alt="tie" src={images.white.pawn}>
                        {:else if teamWon == 1}
                            <img alt="white won" src={images.white.king}>
                        {:else if teamWon == -1}
                            <img alt="black won" src={images.black.king}>
                        {/if}
                    </div>
                    <h1>{winText}</h1>
                    <div>
                        <button class="play-again" on:click={restartGame}>Play again</button>
                    </div>
                </BoardPopup>
            {/if}
        </div>
        <!-- <div class="icon" style={showBoard ? "" : "pointer-events: none;"}>
            <GameSettingsToggle bind:open={showingSettings}/>
        </div> -->
        <GameSideBar bind:board={board} bind:moveHistory={pastMoves} on:newgame={() => {
            if (showBoard) {
                showNewGameView();
            } else {
                startGame();
            }
        }} on:restartgame={restartGame}/>
        {#if !mobileCheck()}
            <div class="links">
                <a href="https://github.com/Zev-G/chess-site">
                    <button>
                        <div class="link-button">
                            <FaCode />
                            Code
                        </div>
                    </button>
                </a>
                <a href="https://www.zevg.ca">
                    <button>
                        <div class="link-button">
                            <FaGlobeAfrica />
                            Website
                        </div>
                    </button>
                </a>
            </div>
        {/if}
    {/if}
</div>

<style>

    h1 {
        color: var(--text-main);
        margin-top: 0;
        margin-bottom: 0.1em;
    }
    img {
        width: calc(var(--grid-size) * 1.25);
    }
    .play-again {
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

    @media (orientation: portrait) {
        .wrapper {
            flex-direction: column;
            --grid-size: calc(85vw / 8);
        }
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
        filter: drop-shadow(0 0 10px var(--off-black));
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
        background-color: var(--semi-offset-bg);
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
        background-color: var(--dark-bg);
        border: none;
        border-radius: calc(var(--grid-size) / 12);
        outline-width: 0;
        /* pointer-events: none;
        opacity: 0.5; */
    }

    .start-game {
        /* font-size: 0.75em; */
        /* border-radius: 0.15em; */
        margin-top: calc(var(--grid-size) / 1.28);
        background-color: var(--dark-bg);
        font-family: var(--default-font);
        font-size: calc(var(--grid-size) / 2.75);
        border-radius: calc(var(--grid-size) / 7);
    }

    .start-game:hover {
        background-color: var(--dark3-bg);
    }

    .link-button {
        display: flex;
        opacity: 0.5;
        gap: 0.5vw;
        font-size: clamp(10px, 1vw, 15px);
    }

    .links {
        position: absolute;
        bottom: 0;
        left: 0;
        /* display: flex; */
        gap: 0.5vw;
        margin: 0.2vw;
    }

    .links button {
        padding: 0.3vw 1vw;
        background-color: transparent;
    }

    .links button:hover {
        background-color: var(--semi-offset-bg);
    }

    .link-button :global(svg) {
        height: clamp(15px, 1.5vw, 20px);
    }
</style>