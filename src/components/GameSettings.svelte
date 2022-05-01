<script lang=ts>
    import type Game from "./Game";
    import Dropdown from "./Dropdown.svelte";

    export let game: Game;

    let showingWhiteDropdown = false;
    let showingBlackDropdown = false;

    export let whiteController = "player";
    export let blackController = "player";
    const controllers = [
        "player", "random"
    ];
    
</script>

<div>
    <span class="player-controller">White:</span>

    <Dropdown bind:showing={showingWhiteDropdown}>
        <span slot="button">{whiteController} ></span>
        <ul slot="content">
            {#each controllers as controller}
                <li>
                    <button class={controller === whiteController ? "selected" : ""} on:click={() => {
                        whiteController = controller;
                        showingWhiteDropdown = false;
                    }}>{controller}</button>
                </li>
            {/each}
        </ul>
    </Dropdown>

    <span class="player-controller">Black:</span>

    <Dropdown bind:showing={showingBlackDropdown}>
        <span slot="button">{blackController} ></span>
        <ul slot="content">
            {#each controllers as controller}
                <li>
                    <button class={controller === blackController ? "selected" : ""} on:click={() => {
                        blackController = controller;
                        showingBlackDropdown = false;
                    }}>{controller}</button>
                </li>
            {/each}
        </ul>
    </Dropdown>
</div>
<button on:click>Close</button>

<style>
    div {
        display: grid;
        column-gap: calc(var(--grid-size) * 0.25);
        grid-template-columns: repeat(2, 50%);
        margin-bottom: calc(var(--grid-size) * 0.1);
    }

    button {
        font-size: calc(var(--grid-size) * 0.17);
    }

    span, li > button {
        font-family: var(--default-font);
        text-transform: capitalize;
    }

    .selected {
        background-color: rgb(17, 17, 19);;
    }

    span {
        font-size: 1.2em;
    }

    .player-controller {
        font-size: 1em;
    }

    ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
    }
</style>