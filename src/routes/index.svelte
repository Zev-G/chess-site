<script lang="ts">
    import ChessBoard from "../components/ChessBoard.svelte";
    import Game from "../components/Game";
</script>

<svelte:head>
    <title>Chess</title>
</svelte:head>

<ChessBoard game={new Game()}/>

<style>
    
</style>