export interface TxData {
  counterparty: string;
  stablecoin: string;
  amount: number;
  timestamp: number;
  blockNumber: number;
  reason: string;
  txType: number;
}
