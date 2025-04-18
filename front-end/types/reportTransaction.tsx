export interface ReportTxData {
  counterparty: string;
  stablecoin: string;
  amount: number;
  timestamp: number;
  blockNumber: number;
  reason: string;
  txType: number;
  hash: string | undefined;
}
