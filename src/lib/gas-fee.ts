import type { RawTransaction } from "$lib/transactions";

export type Transaction = {
  timestamp: Date;
  hash: string;
  nonce: string;
  from: string;
  to: string;
  value: bigint;
  gas: number;
  gasPrice: bigint;
  isError: boolean;
  gasUsed: bigint;
};

export const processTransactions = (transactions: RawTransaction[]): Transaction[] => {
  return transactions.map((transaction) => ({
    ...transaction,
    value: BigInt(transaction.value),
    gas: parseInt(transaction.gas),
    gasPrice: BigInt(transaction.gasPrice),
    gasUsed: BigInt(transaction.gasUsed),
  }));
};

export type Stats = {
  totalEtherUsed: number;
  topGasPercentage: number;
  topEtherUsed: Transaction;
  averageGasPrice: number;
};

export const getStats = (transactions: Transaction[]): Stats => {
  const totalEtherUsed = transactions.reduce(
    (acc, transaction) => acc + BigInt(BigInt(transaction.gasUsed) * transaction.gasPrice),
    BigInt(0),
  );

  const topEtherUsed = transactions.reduce(
    (acc, transaction) =>
      transaction.gasUsed * transaction.gasPrice > acc.gasUsed * acc.gasPrice ? transaction : acc,
    transactions[0],
  );

  const topGasPercentage =
    Number(topEtherUsed.gasPrice * topEtherUsed.gasUsed) / Number(totalEtherUsed);

  const averageGasPrice =
    transactions.reduce((acc, transaction) => acc + transaction.gasPrice, BigInt(0)) /
    BigInt(transactions.length);

  return {
    totalEtherUsed: Number(totalEtherUsed / BigInt(1e6)) / 1e12, // precision of 1e-12, probably accurate enough
    topGasPercentage: Number(topGasPercentage),
    topEtherUsed: topEtherUsed,
    averageGasPrice: Number(averageGasPrice) / 1e9,
  };
};
