<script lang=ts>
    import { copyBoard, defaultBoard, imageMap, pieceKind } from "./Chess";
    import { outclick } from "./outclick";
    import BoardSpot from "./BoardSpot.svelte";
    import BoardDataGate from "./BoardDataGate";

    export let board: number[][] = defaultBoard();
    const boardsBySize = {
        "3": [
            [-1, 18, -1],
            [-1, -1, -1],
            [-1, 8, -1]
        ],
        "4": [
            [-1, 18, -1, -1],
            [-1, -1, -1, -1],
            [-1, -1, -1, -1],
            [-1, -1, 8, -1]
        ],
        "5": [
            [15, 14, 18, 14, 15],
            [10, 10, 10, 10, 10],
            [-1, -1, -1, -1, -1],
            [0,  0,  0,  0,  0],
            [5,  4,  8,  4,  5]
        ],
        "6": [
            [15, 14, 17, 18, 14, 15],
            [10, 10, 10, 10, 10, 10],
            [-1, -1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1, -1],
            [0,  0,  0,  0,  0,  0],
            [5,  4,  7,  8,  4,  5]
        ],
        "7": [
            [15, 13, 14, 18, 14, 13, 15],
            [10, 10, 10, 10, 10, 10, 10],
            [-1, -1, -1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1, -1, -1],
            [0,  0,  0,  0,  0,  0,  0],
            [5,  3,  4,  8,  4,  3,  5]
        ],
        "8": defaultBoard(),
        "9": [
            [15,13,14,17,18,17,14,13,15],
            [10,10,10,10,10,10,10,10,10],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [0,0,0,0,0,0,0,0,2],
            [5,3,4,7,8,7,4,3,5],
        ],
        "10": [
            [15,13,14,13,17,18,13,14,13,15],
            [10,10,10,10,10,10,10,10,12,12],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [0,0,0,0,0,0,0,0,2,2],
            [5,3,4,3,7,8,3,4,3,5],
        ]
    };

    let size = 7;
    let allowKingDeletion = false;

    $: board = boardsBySize[`${size}`];

    let piecesPopupX: number;
    let piecesPopupY: number;
    let dataGate = new BoardDataGate();
    dataGate.onEmptyDragDropped = (x: number, y: number) => {
        if (allowKingDeletion || pieceKind(board[y][x]) != 5) {
            board[y][x] = -1;
            board = [...board];
        }
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
        if (allowKingDeletion || pieceKind(board[event.detail.y][event.detail.x]) != 5) {
            let piece = board[event.detail.fromY][event.detail.fromX];
            board[event.detail.fromY][event.detail.fromX] = -1;
            board[event.detail.y][event.detail.x] = piece;
            board = [...board];
        }
        
    }
</script>

<div class="wrapper" style={`--board-size: ${size};`}>
    <div class="board">
        {#each board as row, y}
            {#each row as piece, x}
                <div>
                    <BoardSpot bind:size={size} dataGate={dataGate} on:pieceRequested={(e) => showPieceOptions(e.detail.x, e.detail.y)} bind:editable value={piece} x={x} y={y} on:dragDropped={dragDropped}/>
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
    </div>
    <div class="settings">
        Board Size:
        <input type="range" min=3 max=10 bind:value={size}>
        Delete Kings:
        <input type="checkbox" bind:checked={allowKingDeletion} name="Delete kings" id="">
        Print Board:
        <button on:click={() => {
            let boardString = "";
            for (let row of board) {
                for (let item of row) {
                    boardString += `${item},`;
                }
                boardString += "\n";
            }
        }}>Print</button>
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

    .settings {
        margin: 10px;
        display: grid;
        grid-template-columns: 100px 100px;
        color: var(--text-main);
        font-family: monospace;
    }

    .settings button {
        padding: 0.1em;
    }

    .wrapper {
        height: 100vh;
        --grid-size: calc(min(90vw - 200px, 90vh) / var(--board-size));
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .overlay {
        position: absolute;
        background-color: var(--dark-2);
        top: calc(var(--y) * var(--grid-size) - var(--grid-size) * 0.5);
        left: calc(var(--x) * var(--grid-size) - var(--grid-size) * 2);
        filter: drop-shadow(0 0 10px var(--off-black));
        border-radius: 1em;
    }
    
    .board {
        display: grid;
        grid-template-columns: repeat(var(--board-size), var(--grid-size));
        grid-template-rows: repeat(var(--board-size), var(--grid-size));
        grid-auto-flow: row;
        filter: drop-shadow(0 0 10px var(--off-black));
        transition: opacity 0.5s;
        -webkit-user-drag: none;
        user-select: none;
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
    }
</style>