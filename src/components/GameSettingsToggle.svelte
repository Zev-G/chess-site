<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    import IoIosSettings from 'svelte-icons/io/IoIosSettings.svelte';
    
    const dispatch = createEventDispatcher();

    export let open = false;
</script>

<div class={"icon" + (open ? " open" : "")} on:click={() => {
    open = !open;
    dispatch(open ? "open" : "close")
}}>
    <IoIosSettings />
</div>

<style>
    .icon {
        width: clamp(15px, 3vw, 30px);
        color: lightgray;
        margin: 0 clamp(5px, 1.5vw, 15px);
        transition: transform 0.2s, color 0.2s;
        cursor: pointer;
    }

    .icon:hover {
        transform: rotate(45deg) scale(1.1);
        color: rgb(236, 236, 236);
    }

    .icon.open {
        transform: rotate(90deg) scale(1.2);
        color: white;
    }
</style>