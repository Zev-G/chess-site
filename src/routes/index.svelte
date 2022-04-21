<script lang="ts">
    import ChessBoard from "../components/ChessBoard.svelte";
    import Game from "../components/Game";
</script>

<svelte:head>
    <title>Chess</title>
    <link rel="stylesheet" href="/global.css"/>
</svelte:head>

<ChessBoard game={new Game()}/>

<style>
    
</style>