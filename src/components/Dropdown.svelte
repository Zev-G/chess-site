<script>
    import { outclick } from "./outclick";
    import { fade } from 'svelte/transition';

    export let showing = false;
</script>

<div use:outclick on:outclick={() => showing = false}>
    <button on:click={() => showing = !showing}>
        <slot name="button"></slot>
    </button>
    
    {#if showing}
        <div class="dropdown-content" transition:fade={{ duration: 70 }}>
            <slot name="content"></slot>
        </div>
    {/if}
</div>

<style>
    .dropdown-content {
        display: block;
        position: absolute;
        z-index: 1;
        font-size: 18px;
        margin-top: 0.25em;
        border-radius: 10px;
        padding: 0.2em;

        filter: drop-shadow(0 0 8px var(--off-black));
        background-color: var(--dark-2);
    }
</style>