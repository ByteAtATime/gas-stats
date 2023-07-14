import type { Transaction } from "./gas-fee";

export const weiToEther = (wei: bigint): number => {
  return Number(wei / BigInt(1e6)) / 1e12;
}

export const transactionFee = (transaction: Transaction): bigint => {
  return transaction.gasPrice * transaction.gasUsed;
}
