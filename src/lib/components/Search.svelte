<script lang="ts">
  import { goto } from "$app/navigation";
  import Fa from "svelte-fa";
  import { faSearch } from "@fortawesome/free-solid-svg-icons";

  export let address = "";
  export let chain = "eth";

  const search = () => {
    goto(`/${address}?chain=${chain}`);
  };
</script>

<form on:submit|preventDefault={search} class="w-full flex justify-center items-center gap-x-2 mb-4">
  <input
    class="text-xl font-mono w-3/4 md:w-1/2 lg:w-1/3 px-6 py-3 rounded-xl border-2 border-cyan-700/50 outline-none focus:border-cyan-700/75"
    placeholder="0x..."
    bind:value={address}
  />

  <select class="text-xl px-6 py-3 rounded-xl border-2 border-cyan-700/50 outline-none focus:border-cyan-700/75" bind:value={chain}>
    <option value="eth">Ethereum Mainnet</option>
    <option value="bsc">Binance Smart Chain</option>
    <option value="polygon">Polygon Network</option>
  </select>

  <button class="bg-cyan-700 p-4 rounded-xl"
    ><Fa icon={faSearch} class="text-white text-2xl" /></button
  >
</form>
