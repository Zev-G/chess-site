<script>
    import { fly } from "svelte/transition";

    
</script>

<div transition:fly={{ y: -20, duration: 300 }}>
    <slot></slot>
</div>

<style>
    div {
        position: absolute;
        font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

        display: flex;
        flex-direction: column;
        align-items: center;
        padding: calc(var(--grid-size) * 8 * 0.03) calc(var(--grid-size));
        margin-bottom: calc(var(--grid-size) * 2);

        font-size: calc(var(--grid-size) * 8 * 0.04);
        color: white;
        background-color: rgb(36, 36, 40);
        filter: drop-shadow(8px 8px 20px black);
        border-radius: calc(var(--grid-size) * 8 * 0.05);

        /* width: calc(var(--grid-size) * 8 * 0.7); */
        max-height: calc(var(--grid-size) * 8 * 0.8);
    }
</style>