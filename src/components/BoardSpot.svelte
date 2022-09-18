<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte"; 
    import FaPlus from 'svelte-icons/fa/FaPlus.svelte';
    import type BoardDataGate from "./BoardDataGate";
    import { imageMap } from "./Chess";

    let eventDispatcher = createEventDispatcher();

    export let value: number = -1;
    export let editable: boolean = false;
    export let draggable: boolean = true;
    export let dataGate: BoardDataGate;
    export let x: number;
    export let y: number;
    export let possibleMoves: number[] = [];
    export let size = 8;
    export let show = true;

    const animationTime = 0.3;
    let animating = false;
    $: piece = animating ? piece : value;

    let elem: HTMLDivElement;

    onMount(() => {
        dataGate.spots.push({
            overlaps: function(x: number, y: number) {
                if (elem == null) return false;
                let rect = elem.getBoundingClientRect();
                return rect && x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height;
            },
            hovered: function() {

            },
            dragDropped: function(fromX: number, fromY: number) {
                if (draggable && !dataGate.animating) {
                    eventDispatcher("dragDropped", {
                        x, y, fromX, fromY
                    });
                }
            },
            animateTo: function(toX: number, toY: number) {                
                const deltX: number = toX - x;
                const deltY: number = toY - y;
                translateStyle = `transition: transform ${animationTime}s; transform: translate(calc(var(--grid-size) * ${deltX}), calc(var(--grid-size) * ${deltY}));`;
                animating = true;
                dataGate.animating = true;
                setTimeout(() => {
                    animating = false;
                    dataGate.animating = false;
                    translateStyle = ``;
                }, animationTime * 1000 * 1.4);
            },
            suspend: function() {
                animating = true;
                setTimeout(() => animating = false, animationTime * 1000);
            },
            elem
        });
    });

    $: flatValue = y * size + x;
    let dragging = false;
    let translateStyle = "";

    // $: {
    //     if (value == -1 && !animating) {
    //         translateStyle = "";
    //     }
    // }

    $: light = (y + x) % 2 == 0;
    $: showMove = possibleMoves.indexOf(flatValue) != -1;

    function pressed(): void {
        eventDispatcher("movesRequested", {
            x, y
        });
        if (draggable && !dataGate.animating && value != -1) {
            dragging = true;
            dataGate.dragging = true;
            dataGate.onDragLeft = (x, y) => {
                updateDragPos(x, y);
            }
        }
    }

    function released(event): void {
        eventDispatcher("movesRequested", {
            x, y
        });
        if (draggable && dragging) {
            dataGate.dragDropped(event.clientX, event.clientY, x, y);
        }
        dragging = false;
        dataGate.dragging = false;
        dataGate.onDragLeft = null;
        if (!animating) {
            translateStyle = "transition: transform 0.2s;";   
        }   
    }

    function pieceRequested(): void {
        eventDispatcher("pieceRequested", {
            x, y
        });
    }

    function mouseMoved(event) {
        if (dragging) {
            updateDragPos(event.clientX, event.clientY);
        } else if (dataGate.dragging && dataGate.onDragLeft != null) {
            dataGate.onDragLeft(event.clientX, event.clientY);
        }
    }

    function updateDragPos(x: number, y: number) {
        let rect = elem.getBoundingClientRect();
        translateStyle = `transform: translate(${x - rect.x - rect.width / 2}px, ${y - rect.y  - rect.height / 2}px);`;
    }
</script>

<div bind:this={elem} class={"board-spot" + (light ? " light" : " dark") + (showMove ? " is-move" : "") + (editable ? " editable" : "")} on:mousedown={pressed} on:mouseup={released} on:mousemove={mouseMoved} on:mouseenter={() => dataGate.lastHover = elem} style={show ? `transition: opacity 500ms; opacity: 1;` : `transition: opacity ${Math.random() * 500 + 250}ms ${Math.random() * 250}ms; opacity: 0;`}>
    {#if piece !== -1}
        <div style={translateStyle}>
            <img src={imageMap[piece]} alt="Chess piece">
        </div>
    {/if}
    <div class={`circle ` + (showMove ? `showing` : `hiding`)}></div>
    {#if editable && value == -1 && !dataGate.dragging}
        <div class="add-piece" on:click={pieceRequested}>
            <FaPlus/>
        </div>
    {/if}
</div>

<style>
    .move-marker {
        position: absolute;
    }

    .add-piece {
        width: calc(var(--grid-size) * 0.5);
        color: var(--dark-overlay);
        opacity: 0;
        transition: opacity 0.1s;
        cursor: pointer;
    }
    .add-piece:hover {
        opacity: 0.8;
    }

    .circle {
        transition: width 0.1s, height 0.1s, opacity 0.1s;
        border-radius: 50%;
        background-color: var(--dark-overlay);
    }
    .circle.hiding {
        transition: width 0.05s, height 0.05s, opacity 0.1s;
        opacity: 0;
        width: 0;
        height: 0;
    }
    .circle.showing {
        opacity: 1;
        width: calc(var(--grid-size) / 3.5);
        height: calc(var(--grid-size) / 3.5);
    }

    .board-spot {
        width: 100%;
        height: 100%;
        display: grid;
        align-items: center;
        justify-items: center;
    }

    .board-spot > * {
        grid-column: 1;
        grid-row: 1;
    }

    .light {
        background-color: var(--light-square);
    }
    .dark {
        background-color: var(--dark-square);
    }

    img {
        width: 100%;
        -webkit-user-drag: none;
        user-select: none;
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        pointer-events: none;
    }
</style>