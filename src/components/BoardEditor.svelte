<script lang=ts>
    import { defaultBoard, imageMap } from "./Chess";
    import { outclick } from "./outclick";
    import BoardSpot from "./BoardSpot.svelte";
    import BoardDataGate from "./BoardDataGate";

    export let board: number[][] = defaultBoard();

    let piecesPopupX: number;
    let piecesPopupY: number;
    let dataGate = new BoardDataGate();
    dataGate.onEmptyDragDropped = (x: number, y: number)  => {
        board[y][x] = -1;
        board = [...board];
    }

    let dragging = -1;
    
    let showingPieceOptions = false;
    $: editable = !showingPieceOptions;

    function showPieceOptions(x: number, y: number) {
        showingPieceOptions = true;
        piecesPopupX = x;
        piecesPopupY = y;
    }

    function choosePiece(piece: number) {
        showingPieceOptions = false;
        board[piecesPopupY][piecesPopupX] = piece;
        board = [...board];
    }

    function dragDropped(event) {
        let piece = board[event.detail.fromY][event.detail.fromX];
        board[event.detail.fromY][event.detail.fromX] = -1;
        board[event.detail.y][event.detail.x] = piece;
        board = [...board];
    }
</script>

<div class="wrapper">
    <div class="board">
        {#each board as row, y}
            {#each row as piece, x}
                <div>
                    <BoardSpot dataGate={dataGate} on:pieceRequested={(e) => showPieceOptions(e.detail.x, e.detail.y)} bind:editable value={piece} x={x} y={y} on:dragDropped={dragDropped}/>
                </div>
            {/each}
        {/each}
        {#if showingPieceOptions}
            <div class="overlay" style={`--x: ${piecesPopupX}; --y: ${piecesPopupY};`} use:outclick on:outclick={() => showingPieceOptions = false}>
                <div class="piece-options">
                    <button on:click={() => choosePiece(7)}>
                        <img alt="queen" src={`white/queen.png`}>
                    </button>
                    <button on:click={() => choosePiece(6)}>
                        <img alt="rook" src={`/white/rook.png`}>
                    </button>
                    <button on:click={() => choosePiece(4)}>
                        <img alt="bishop" src={`/white/bishop.png`}>
                    </button>
                    <button on:click={() => choosePiece(3)}>
                        <img alt="knight" src={`/white/knight.png`}>
                    </button>
                    <button on:click={() => choosePiece(2)}>
                        <img alt="knight" src={`/white/pawn.png`}>
                    </button>
                </div>
                <div class="piece-options">
                    <button on:click={() => choosePiece(17)}>
                        <img alt="queen" src={`/black/queen.png`}>
                    </button>
                    <button on:click={() => choosePiece(16)}>
                        <img alt="rook" src={`/black/rook.png`}>
                    </button>
                    <button on:click={() => choosePiece(14)}>
                        <img alt="bishop" src={`/black/bishop.png`}>
                    </button>
                    <button on:click={() => choosePiece(13)}>
                        <img alt="knight" src={`/black/knight.png`}>
                    </button>
                    <button on:click={() => choosePiece(12)}>
                        <img alt="knight" src={`/black/pawn.png`}>
                    </button>
                </div>
            </div>
        {/if}
        {#if dragging !== -1}
            <div class="dragging">
                <img src={imageMap[dragging]} alt="dragging piece">
            </div>
        {/if}
    </div>
</div>

<style>

    .piece-options button {
        width: calc(var(--grid-size) * 1);
        height: calc(var(--grid-size) * 1);
        padding: 0;
        margin: 0;
        border: none;
    }
    .piece-options img {
        width: calc(var(--grid-size) * 0.8);
        height: calc(var(--grid-size) * 0.8);
    }
    .piece-options {
        display: flex;
    }

    .wrapper {
        height: 100vh;
        --grid-size: calc(min(90vw, 90vh) / 8);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .overlay {
        position: absolute;
        background-color: rgb(25, 24, 27);
        top: calc(var(--y) * var(--grid-size) - var(--grid-size) * 0.5);
        left: calc(var(--x) * var(--grid-size) - var(--grid-size) * 2);
        filter: drop-shadow(0 0 10px black);
        border-radius: 1em;
    }
    
    .board {
        display: grid;
        grid-template-columns: repeat(8, var(--grid-size));
        grid-template-rows: repeat(8, var(--grid-size));
        grid-auto-flow: row;
        filter: drop-shadow(0 0 10px black);
        transition: opacity 0.5s;
        -webkit-user-drag: none;
        user-select: none;
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
    }
</style>