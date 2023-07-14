import type { PageServerLoad } from "./$types";
import { utils } from "web3";
import { error } from "@sveltejs/kit";
import { getAllTransactions, getStats, processTransactions } from "$lib/gas-fee";
import { ETHERSCAN_API_KEY } from "$env/static/private";

export const load: PageServerLoad = async ({ params }) => {
  const address = params.address;

  if (!utils.isAddress(address)) {
    throw error(400, "Invalid address");
  }

  const transactions = processTransactions(await getAllTransactions(address, ETHERSCAN_API_KEY));

  if (!transactions.length) {
    throw error(404, "No transactions found");
  }

  const stats = getStats(transactions);

  return {
    address,
    transactions,
    stats,
  };
};
