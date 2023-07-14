<script lang="ts">
  import type { Stats, Transaction } from "$lib/gas-fee";
  import { transactionFee, weiToEther } from "$lib/util.js";
  import Search from "$lib/components/Search.svelte";

  export let data: { address: string; transactions: Transaction[]; stats: Stats };

  const { address, transactions, stats } = data;

  const transactionsByFee = transactions.sort((a, b) => Number(b.gasUsed * b.gasPrice - a.gasUsed * a.gasPrice));
</script>

<div class="min-h-screen bg-cyan-100 px-10 py-4">
  <div class="max-w-screen-2xl mx-auto">
  <Search />

  <h1 class="text-2xl mb-4">
    Stats for <span class="font-mono font-bold"
      >0x{address.replace("0x", "").slice(0, 4)}...{address.slice(-6)}</span
    >
  </h1>

  <div class="flex flex-col md:flex-row gap-8 max-w-screen-lg mx-auto items-center justify-center">
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
      In total, you have spent Ξ<span class="font-mono">{stats.totalEtherUsed.toFixed(6)}</span>, at
      an average gas price of <span class="font-mono">{stats.averageGasPrice.toFixed(3)}</span> gwei.
    </div>
    <div class="bg-white rounded-2xl px-8 py-6 shadow-lg">
      Your top transaction accounts for <span class="font-mono"
    >{(stats.topGasPercentage * 100).toFixed(2)}%</span
    > of your total gas fees.
    </div>
  </div>

  <h1 class="font-bold text-2xl mb-4 mt-8">Transactions by gas fee</h1>

  <div class="shadow overflow-y-hidden rounded-xl border-b border-gray-200">
    <table class="min-w-full bg-white">
      <thead class="bg-gray-800 text-white">
        <tr>
          <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Transaction</th>
          <th class="text-left py-3 px-4 uppercase font-semibold text-sm">To</th>
            <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Value</th>
          <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Gas Used</th>
          <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Gas Price (GWEI)</th>
          <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Transaction Fee</th>
          <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Value Percentage</th>
          <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Total Fee Percentage</th>
        </tr>
      </thead>
      <tbody class="text-gray-700">
      {#each transactionsByFee as transaction, i}
        <tr class:bg-gray-100={i % 2 === 0}>
          <td class="text-left py-3 px-4"><a href="https://etherscan.io/tx/{transaction.hash}" class="font-mono text-blue-700 hover:underline">{transaction.hash.slice(0, 16)}...</a></td>
          <td class="text-left py-3 px-4"><a href="https://etherscan.io/address/{transaction.to}" class="font-mono text-blue-700 hover:underline">{transaction.to}</a></td>
            <td class="text-left py-3 px-4 font-mono">Ξ{weiToEther(transaction.value).toFixed(6)}</td>
            <td class="text-left py-3 px-4 font-mono">{transaction.gasUsed}</td>
            <td class="text-left py-3 px-4 font-mono">{(Number(transaction.gasPrice) / 1e9).toFixed(1)}</td>
            <td class="text-left py-3 px-4 font-mono">Ξ{weiToEther(transactionFee(transaction)).toFixed(6)}</td>
            <td class="text-left py-3 px-4 font-mono">{((Number(transactionFee(transaction)) / Number(transaction.value)) * 100).toFixed(2)}%</td>
            <td class="text-left py-3 px-4 font-mono">{((Number(transactionFee(transaction)) / 1e18 / Number(stats.totalEtherUsed)) * 100).toFixed(2)}%</td>
        </tr>
        {/each}
      </tbody>
    </table>
  </div>
  </div>
</div>
