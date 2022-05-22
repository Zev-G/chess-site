<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte"; 
    import FaPlus from 'svelte-icons/fa/FaPlus.svelte'
import { dataset_dev, element } from "svelte/internal";
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
                if (draggable) {
                    eventDispatcher("dragDropped", {
                        x, y, fromX, fromY
                    });
                }
            },
            elem
        });
    });

    $: flatValue = y * size + x;
    let dragging = false;
    let translateStyle = "";

    $: light = (y + x) % 2 == 0;
    $: showMove = possibleMoves.indexOf(flatValue) != -1;

    function pressed(): void {
        eventDispatcher("movesRequested", {
            x, y
        });
        if (draggable && value != -1) {
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
        translateStyle = "";
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

<div bind:this={elem} class={"board-spot" + (light ? " light" : " dark") + (showMove ? " is-move" : "") + (editable ? " editable" : "")} on:mousedown={pressed} on:mouseup={released} on:mousemove={mouseMoved} on:mouseenter={() => dataGate.lastHover = elem}>
    {#if value !== -1}
        <img src={imageMap[value]} alt="Chess piece" style={translateStyle}>
    {/if}
    {#if showMove}
        <div class="circle"></div>
    {/if}
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
        color:rgba(0, 0, 0, 0.4);
        opacity: 0;
        transition: opacity 0.1s;
        cursor: pointer;
    }
    .add-piece:hover {
        opacity: 0.8;
    }

    .circle {
        width: calc(var(--grid-size) / 3.5);
        height: calc(var(--grid-size) / 3.5);
        border-radius: 50%;
        background-color: rgba(0, 0, 0, 0.4);
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
        background-color: hsl(60deg 45% 88%);
    }
    .dark {
        background-color: hsl(90deg 27% 46%);
    }

    img {
        width: 100%;
        -webkit-user-drag: none;
        user-select: none;
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
    }
</style>