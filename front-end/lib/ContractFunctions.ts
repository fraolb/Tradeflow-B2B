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

export const getNameFromContract = async (
  address: string,
  smartContract: string
): Promise<string> => {
  const result = await readContract(config, {
    address: smartContract as `0x${string}`,
    abi: TradeflowB2B,
    functionName: "getUserName",
    args: [address],
  });

  return result as string;
};

export const getTxsFromContract = async (
  address: string,
  smartContract: string
): Promise<TxData[]> => {
  const result = await readContract(config, {
    address: smartContract as `0x${string}`,
    abi: TradeflowB2B,
    functionName: "getUserTransactions",
    args: [address],
  });

  // Ensure the contract returns an array of structs
  return (result as TxData[]).map(
    (tx: TxData): TxData => ({
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

export const payUser = async (
  smartContract: string,
  stablecoin: string,
  receiver: string,
  amount: string,
  reason: string
) => {
  const amountInWei = BigInt(Math.floor(parseFloat(amount) * 1e18)); // cUSD has 18 decimals

  console.log("the amount in wei is ", amountInWei);

  // Step 1: Approve Tradeflow contract
  const approveHash = await writeContract(config, {
    address: stablecoin as `0x${string}`,
    abi: cUSDABI,
    functionName: "approve",
    args: [smartContract, amountInWei],
  });

  await waitForTransactionReceipt(config, { hash: approveHash });

  // Step 2: Execute payment on Tradeflow
  const hash = await writeContract(config, {
    address: smartContract as `0x${string}`,
    abi: TradeflowB2B,
    functionName: "pay",
    args: [stablecoin, receiver, amountInWei, reason],
  });

  await waitForTransactionReceipt(config, { hash });

  return hash;
};

export const getTokenAmount = async (
  address: string,
  token: string
): Promise<string> => {
  const result = await readContract(config, {
    address: token as `0x${string}`,
    abi: cUSDABI,
    functionName: "balanceOf",
    args: [address],
  });

  const formatted = result ? formatUnits(result as bigint, 18) : "0";

  return formatted;
};

export const updateUsername = async (
  username: string,
  smartContract: string
) => {
  const tx = await writeContract(config, {
    address: smartContract as `0x${string}`,
    abi: TradeflowB2B,
    functionName: "addName",
    args: [username],
  });

  const receipt = await waitForTransactionReceipt(config, {
    hash: tx,
  });

  return receipt;
};
