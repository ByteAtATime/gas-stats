<script lang="ts">
  import type { Stats, Transaction } from "$lib/gas-fee";
  import { transactionFee, weiToEther } from "$lib/util.js";
  import Search from "$lib/components/Search.svelte";
  import { DateTime } from "luxon";
  import { CHAIN_TO_EXPLORER, CHAIN_TO_NAME } from "$lib/chains";
  import { navigating, page } from "$app/stores";
  import { Circle2 } from "svelte-loading-spinners";

  export let data: { address: string; transactions: Transaction[]; stats: Stats; chain: string };

  let address: string;
  let transactions: Transaction[] = [];
  let stats: Stats;
  let chain: string;

  $: ({ address, transactions, stats, chain } = data);

  let sortedTransactions: Transaction[] = []
  let sorting = { f: (t: Transaction) => Number(transactionFee(t) / BigInt(1e6)), ascending: false };

  $: sortedTransactions = transactions
    .sort((a, b) => (sorting.f(a) - sorting.f(b)) * (sorting.ascending ? 1 : -1))
    .slice(0, 1000);

  const sortBy = (func: (t: Transaction) => number) => {
    return () => {
      if (sorting.f === func) {
        sorting.ascending = !sorting.ascending;
      } else {
        sorting.f = func;
        sorting.ascending = false;
      }
    }
  }
</script>

<div class="min-h-screen bg-cyan-100 px-10 py-4">
  <div class="max-w-screen-2xl mx-auto">
    <Search address={$page.params.address} chain={chain} />

    {#if $navigating}
      <div class="flex justify-center items-center h-96">
        <div class="scale-150">
          <Circle2 size="120" />
        </div>
      </div>
    {:else}

    <h1 class="text-2xl mb-4">
      Stats for <span class="font-mono font-bold"
        >0x{address.replace("0x", "").slice(0, 4)}...{address.slice(-6)}</span
      >
      on
      <img src="/chains/{chain}.svg" class="inline h-12 w-12" alt="" />
      <span class="font-mono font-bold">{CHAIN_TO_NAME[chain]}</span>
    </h1>

      <div
        class="flex flex-col md:flex-row gap-8 max-w-screen-lg mx-auto items-center justify-center"
      >
        <div class="bg-white rounded-2xl px-8 py-6 shadow-lg">
          Your top transaction took Ξ<span class="font-mono"
            >{(
              Number((stats.topEtherUsed.gasUsed * stats.topEtherUsed.gasPrice) / BigInt(1e6)) / 1e12
            ).toFixed(6)}</span
          >,
          {(
            (Number(stats.topEtherUsed.gasUsed * stats.topEtherUsed.gasPrice) /
              Number(stats.topEtherUsed.value)) *
            100
          ).toFixed(2)}% of the transaction value.
        </div>
        <div class="bg-white rounded-2xl px-10 py-8 shadow-lg text-lg">
          In total, you have spent Ξ<span class="font-mono">{stats.totalEtherUsed.toFixed(6)}</span>,
          at an average gas price of <span class="font-mono">{stats.averageGasPrice.toFixed(3)}</span>
          gwei.
        </div>
        <div class="bg-white rounded-2xl px-8 py-6 shadow-lg">
          Your top transaction accounts for <span class="font-mono"
            >{(stats.topGasPercentage * 100).toFixed(2)}%</span
          > of your total gas fees.
        </div>
      </div>

      <h1 class="font-bold text-2xl mt-8">Transactions</h1>

      {#if sortedTransactions.length === 1000}
        <p class="text-sm">List truncated to top 1,000.</p>
      {/if}

      <div class="shadow overflow-y-hidden rounded-xl border-b border-gray-200 mt-4">
        <table class="min-w-full bg-white">
          <thead class="bg-gray-800 text-white">
            <tr>
              <th class="text-left py-3 px-4 uppercase font-semibold text-sm" on:click={sortBy(t => t.timestamp.getTime())}>Timestamp</th>
              <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Transaction</th>
              <th class="text-left py-3 px-4 uppercase font-semibold text-sm">To</th>
              <th class="text-left py-3 px-4 uppercase font-semibold text-sm" on:click={sortBy(t => Number(t.value / BigInt(1e6)))}>Value</th>
              <th class="text-left py-3 px-4 uppercase font-semibold text-sm" on:click={sortBy(t => Number(t.gasUsed))}>Gas Used</th>
              <th class="text-left py-3 px-4 uppercase font-semibold text-sm" on:click={sortBy(t => Number(t.gasPrice))}>Gas Price (GWEI)</th>
              <th class="text-left py-3 px-4 uppercase font-semibold text-sm" on:click={sortBy(t => Number(transactionFee(t) / BigInt(1e6)))}>TX. Fee</th>
              <th class="text-left py-3 px-4 uppercase font-semibold text-sm" on:click={sortBy(t => Number(transactionFee(t)) / Number(t.value))}>Value Percentage</th>
              <th class="text-left py-3 px-4 uppercase font-semibold text-sm" on:click={sortBy(t => Number(transactionFee(t)) / 1e18 / Number(stats.totalEtherUsed))}>Total Fee Percentage</th
              >
            </tr>
          </thead>
          <tbody class="text-gray-700">
            {#each sortedTransactions as transaction, i}
              <tr class:bg-gray-100={i % 2 === 0}>
                <td class="text-left py-3 px-4 font-mono"
                  >{DateTime.fromJSDate(transaction.timestamp).toLocaleString(
                    DateTime.DATETIME_SHORT,
                  )}</td
                >
                <td class="text-left py-3 px-4"
                  ><a
                    href="{CHAIN_TO_EXPLORER[chain]}/tx/{transaction.hash}"
                    class="font-mono text-blue-700 hover:underline"
                    >{transaction.hash.slice(0, 16)}...</a
                  ></td
                >
                <td class="text-left py-3 px-4"
                  ><a
                    href="{CHAIN_TO_EXPLORER[chain]}/address/{transaction.to}"
                    class="font-mono text-blue-700 hover:underline">{transaction.to}</a
                  ></td
                >
                <td class="text-left py-3 px-4 font-mono"
                  >Ξ{weiToEther(transaction.value).toFixed(6)}</td
                >
                <td class="text-left py-3 px-4 font-mono">{transaction.gasUsed}</td>
                <td class="text-left py-3 px-4 font-mono"
                  >{(Number(transaction.gasPrice) / 1e9).toFixed(1)}</td
                >
                <td class="text-left py-3 px-4 font-mono"
                  >Ξ{weiToEther(transactionFee(transaction)).toFixed(6)}</td
                >
                <td class="text-left py-3 px-4 font-mono"
                  >{((Number(transactionFee(transaction)) / Number(transaction.value)) * 100).toFixed(
                    2,
                  )}%</td
                >
                <td class="text-left py-3 px-4 font-mono"
                  >{(
                    (Number(transactionFee(transaction)) / 1e18 / Number(stats.totalEtherUsed)) *
                    100
                  ).toFixed(2)}%</td
                >
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>
</div>
