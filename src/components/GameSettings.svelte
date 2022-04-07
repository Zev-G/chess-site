<script lang="ts">
    import IoIosSettings from 'svelte-icons/io/IoIosSettings.svelte';

    let open = false;
</script>

<div class={"icon" + (open ? " open" : "")} on:click={() => open = !open}>
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

    .icon:hover, .icon.open {
        transform: rotate(45deg) scale(1.1);
        color: white;
    }
</style>