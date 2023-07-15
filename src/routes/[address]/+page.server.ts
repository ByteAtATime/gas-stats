import type { PageServerLoad } from "./$types";
import { utils } from "web3";
import { error } from "@sveltejs/kit";
import { getStats, processTransactions } from "$lib/gas-fee";
import { ETHERSCAN_API_KEY, BSCSCAN_API_KEY, POLYGONSCAN_API_KEY } from "$env/static/private";
import { EtherscanProvider } from "$lib/transactions";

const CHAIN_TO_ETHERSCAN: Record<string, [string, string]> = {
  eth: ["api.etherscan.io", ETHERSCAN_API_KEY],
  bsc: ["api.bscscan.com", BSCSCAN_API_KEY],
  polygon: ["api.polygonscan.com", POLYGONSCAN_API_KEY],
};

export const load: PageServerLoad = async ({ params, url }) => {
  const address = params.address;
  const chain = url.searchParams.get("chain") || "eth";

  if (!(chain in CHAIN_TO_ETHERSCAN)) {
    throw error(400, "Invalid chain");
  }

  if (!utils.isAddress(address)) {
    throw error(400, "Invalid address");
  }

  const etherscanData = CHAIN_TO_ETHERSCAN[chain];

  const etherscanProvider = new EtherscanProvider(etherscanData[0], etherscanData[1]);

  const transactions = processTransactions(await etherscanProvider.getAllTransactions(address));

  if (!transactions.length) {
    throw error(404, "No transactions found");
  }

  const stats = getStats(transactions);

  return {
    address,
    transactions,
    stats,
    chain,
  };
};
