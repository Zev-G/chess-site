<script>
    import { fly } from "svelte/transition";
    import { outclick } from "./outclick";
    
</script>

<div transition:fly={{ y: -20, duration: 300 }} use:outclick on:outclick>
    <slot></slot>
</div>

<style>
    div {
        position: absolute;
        font-family: var(--default-font);

        display: flex;
        flex-direction: column;
        align-items: center;
        padding: calc(var(--grid-size) * 8 * 0.03) calc(var(--grid-size));
        margin-bottom: calc(var(--grid-size) * 2);

        font-size: calc(var(--grid-size) * 8 * 0.04);
        color: var(--main-text);
        background-color: var(--bg);
        filter: drop-shadow(8px 8px 20px var(--off-black));
        border-radius: calc(var(--grid-size) * 8 * 0.05);

        /* width: calc(var(--grid-size) * 8 * 0.7); */
        max-height: calc(var(--grid-size) * 8 * 0.8);
    }
</style>