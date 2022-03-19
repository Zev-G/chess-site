<script lang="ts">
    export let value: number;
    export let x: number;
    export let y: number;

    $: light = (x + y) % 2 == 0;
</script>

<div class={"board-spot" + (light ? " light" : " dark")}>
    
</div>

<style>
    .light {
        background-color: rgb(228, 209, 179);
    }
    .dark {
        background-color: rgb(71, 64, 51);
    }
</style>