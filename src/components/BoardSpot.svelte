<script lang="ts">
    import { imageMap } from "./Chess";

    export let value: number;
    export let x: number;
    export let y: number;

    $: light = (x + y) % 2 == 0;
</script>

<div class={"board-spot" + (light ? " light" : " dark")}>
    {#if value !== -1}
        <img src={imageMap[value]} alt="Chess piece">
    {/if}
</div>

<style>
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