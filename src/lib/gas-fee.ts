export type RawTransaction = {
  timestamp: Date;
  hash: string;
  nonce: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  isError: boolean;
  gasUsed: string;
};

export const getAllTransactions = async (
  address: string,
  apiKey: string,
): Promise<RawTransaction[]> => {
  const res = await fetch(
    `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`,
  );

  const { result } = await res.json();

  const sentTransactions = result.filter(
    (transaction: any) => transaction.from.toLowerCase() === address.toLowerCase(),
  );

  return sentTransactions.map((transaction: any) => ({
    timestamp: new Date(parseInt(transaction.timeStamp) * 1000),
    hash: transaction.hash,
    nonce: parseInt(transaction.nonce),
    from: transaction.from,
    to: transaction.to,
    value: transaction.value,
    gas: transaction.gas,
    gasPrice: transaction.gasPrice,
    isError: transaction.isError === "1",
    gasUsed: transaction.gasUsed,
  }));
};

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
