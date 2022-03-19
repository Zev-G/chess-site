<script lang="ts">
    export let value: number;
    export let x: number;
    export let y: number;

    $: light = (x + y) % 2 == 0;
</script>

<div class={"board-spot" + (light ? " light" : " dark")}>
    {value}
</div>