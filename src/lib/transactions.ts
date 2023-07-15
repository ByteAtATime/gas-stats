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

export interface RawTransactionProvider {
  getAllTransactions: (address: string) => Promise<RawTransaction[]>;
}

export class EtherscanProvider implements RawTransactionProvider {
  public constructor(private rootUrl: string, private apiKey: string) {}

  async getAllTransactions(address: string): Promise<RawTransaction[]> {
    const res = await fetch(
      `https://${this.rootUrl}/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${this.apiKey}`,
    );

    const { result } = await res.json();

    const sentTransactions = result.filter(
      (transaction: any) => transaction.from.toLowerCase() === address.toLowerCase(),
    );

    return sentTransactions.map((transaction: any) => ({
      timestamp: new Date(parseInt(transaction.timeStamp) * 1000),
      hash: transaction.hash,
      nonce: transaction.nonce,
      from: transaction.from,
      to: transaction.to,
      value: transaction.value,
      gas: transaction.gas,
      gasPrice: transaction.gasPrice,
      isError: transaction.isError === "1",
      gasUsed: transaction.gasUsed,
    }));
  }
}
