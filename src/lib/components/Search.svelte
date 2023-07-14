<script lang="ts">
  import { goto } from "$app/navigation";
  import Fa from "svelte-fa";
  import { faSearch } from "@fortawesome/free-solid-svg-icons";

  let address = "";

  const search = () => {
    goto(`/${address}`);
  };
</script>

<form on:submit|preventDefault={search} class="w-full flex justify-center items-center gap-x-2">
  <input
    class="text-xl font-mono w-1/3 px-6 py-3 rounded-xl border-2 border-cyan-700/50 outline-none focus:border-cyan-700/75"
    placeholder="0x..."
    bind:value={address}
  />

  <button class="bg-cyan-700 p-4 rounded-xl"
    ><Fa icon={faSearch} class="text-white text-2xl" /></button
  >
</form>
