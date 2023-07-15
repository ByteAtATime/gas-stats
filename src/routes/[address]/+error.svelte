<script lang="ts">
    import { page } from "$app/stores";
    import { CHAIN_TO_NAME } from "$lib/chains";
    import Search from "$lib/components/Search.svelte";
</script>

{#if $page.status === 404 && $page.error.message === "No transactions found"}
    <div class="min-h-screen bg-cyan-100 flex justify-center items-center">
        <div class="w-3/4 md:w-1/2">
            <h1 class="text-4xl font-bold">No Transactions Found</h1>
            <p>Uh-oh! We couldn't find any transactions for <span class="font-bold font-mono">{$page.params.address}</span> on
                <span class="font-mono font-bold">{CHAIN_TO_NAME[$page.url.searchParams.get("chain") ?? "eth"]}</span>.</p>
            <p class="mb-4">Try searching for a different address or chain.</p>

            <Search />
        </div>
    </div>
{/if}
