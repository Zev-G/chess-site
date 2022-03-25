<script lang="ts">
    import { createEventDispatcher } from "svelte"; 

    import { Game, imageMap } from "./Chess";

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

<div class={"board-spot" + (light ? " light" : " dark")} on:click={pressed}>
    {#if value !== -1}
        <img src={imageMap[value]} alt="Chess piece">
    {/if}
    {#if showMove}
        <div class="move-marker">
            asdf
        </div>
    {/if}
</div>

<style>
    .move-marker {
        position: absolute;
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