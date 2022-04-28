<script lang="ts">
    import { createEventDispatcher } from "svelte"; 

    import { imageMap } from "./Chess";

    let eventDispatcher = createEventDispatcher();

    export let value: number = -1;
    export let x: number;
    export let y: number;
    export let board: number[][];
    export let possibleMoves: number[];

    let flatValue = y * 8 + x;

    $: light = (y + x) % 2 == 0;
    $: showMove = possibleMoves.indexOf(flatValue) != -1;

    function pressed(): void {
        eventDispatcher("movesRequested", {
            x, y
        });
    }
</script>

<div class={"board-spot" + (light ? " light" : " dark") + (showMove ? " is-move" : "")} on:mousedown={pressed}>
    {#if value !== -1}
        <img src={imageMap[value]} alt="Chess piece">
    {/if}
    {#if showMove}
        <div class="circle" style={`--x: ${x}; --y: ${y};`}>

        </div>
    {/if}
</div>

<style>
    .move-marker {
        position: absolute;
    }

    .circle {
        /* position: absolute; */
        width: calc(var(--grid-size) / 3.5);
        padding-top: calc(var(--grid-size) / 3.5);
        border-radius: 50%;
        background-color: rgba(0, 0, 0, 0.4);

        left: calc(var(--x) * var(--grid-size) + (var(--grid-size) / 2 - (var(--grid-size) / 3.5 / 2)));
        top: calc(var(--y) * var(--grid-size) + (var(--grid-size) / 2 - (var(--grid-size) / 3.5 / 2)));
    }

    .board-spot {
        width: 100%;
        height: 100%;
    }

    .light {
        background-color: rgb(228, 209, 179);
    }
    .dark {
        background-color: rgb(71, 64, 51);
    }

    img {
        width: 100%;
    }
</style>