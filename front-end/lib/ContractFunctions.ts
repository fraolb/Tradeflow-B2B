// lib/contractFunctions.ts
"use client";

import { TxData } from "@/types/transaction";
import { config } from "@/app/Provider";
import {
  readContract,
  writeContract,
  waitForTransactionReceipt,
} from "@wagmi/core";
import { formatUnits } from "viem";
import TradeflowB2B from "@/ABI/TradeflowB2B.json";
import cUSDABI from "@/ABI/cUSD.json";

const CONTRACT_ADDRESS = "0x92c7d8B28b2c487c7f455733470B27ABE2FefF13";

export const getNameFromContract = async (address: string): Promise<string> => {
  const result = await readContract(config, {
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: TradeflowB2B,
    functionName: "getUserName",
    args: [address],
  });

  return result as string;
};

export const getTxsFromContract = async (
  address: string
): Promise<TxData[]> => {
  const result = await readContract(config, {
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: TradeflowB2B,
    functionName: "getUserTransactions",
    args: [address],
  });

  // Ensure the contract returns an array of structs
  return (result as any[]).map(
    (tx: any): TxData => ({
      counterparty: tx.counterparty,
      stablecoin: tx.stablecoin,
      amount: Number(tx.amount),
      timestamp: Number(tx.timestamp),
      blockNumber: Number(tx.blockNumber),
      reason: tx.reason,
      txType: Number(tx.txType),
    })
  );
};

export const payUser = async ({
  stablecoin,
  receiver,
  amount,
  reason,
}: {
  stablecoin: `0x${string}`;
  receiver: `0x${string}`;
  amount: bigint;
  reason: string;
}) => {
  const tx = await writeContract(config, {
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: TradeflowB2B,
    functionName: "pay",
    args: [stablecoin, receiver, amount, reason],
  });

  const receipt = await waitForTransactionReceipt(config, {
    hash: tx,
  });

  return receipt;
};

export const getTokenAmount = async (
  address: string,
  token: string
): Promise<string> => {
  const result = await readContract(config, {
    address: token as `0x${string}`,
    abi: cUSDABI,
    functionName: "balanceOf",
    args: [address!],
  });

  const formatted = result ? formatUnits(result as bigint, 18) : "0";

  return formatted;
};
