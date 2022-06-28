<script lang=ts>
    import type Game from "./Game";
    import Dropdown from "./Dropdown.svelte";

    export let game: Game;

    let showingWhiteDropdown = false;
    let showingBlackDropdown = false;

    export let whiteController = "player";
    export let blackController = "player";
    const controllers = [
        "player", "random", "easy", "medium", "tough"
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
        column-gap: calc(var(--grid-size) * 0.3);
        row-gap: calc(var(--grid-size) * 0.1);
        grid-template-columns: repeat(2, 1fr);
        margin-bottom: calc(var(--grid-size) * 0.1);
        align-items: center;
    }

    button {
        font-size: max(calc(var(--grid-size) * 0.17), 12px);
    }

    span, li > button {
        font-family: var(--default-font);
        text-transform: capitalize;
    }

    .selected {
        background-color: var(--dark-5);
    }

    span {
        font-size: max(calc(var(--grid-size) * 0.17), 12px);
    }

    .player-controller {
        font-size: max(calc(var(--grid-size) * 0.4), 16px);
        text-align: right;
    }

    ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
    }
</style>