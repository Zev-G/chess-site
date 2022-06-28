<svelte:head>
    <title>Chess</title>
    <link rel="stylesheet" href="/global.css"/>
</svelte:head>

<slot></slot>

<style>
    :global(html, body) {
        margin: 0;
        padding: 0;
        background-color: var(--root-bg);
    }
</style>