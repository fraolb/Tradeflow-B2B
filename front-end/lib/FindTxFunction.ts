"use client";

import { PublicClient } from "viem";

export const FindTx = async (
  blockNumber: number,
  publicClient: PublicClient,
  smartContract: string
) => {
  if (!publicClient) return null;

  const block = await publicClient.getBlock({
    blockNumber: BigInt(blockNumber),
    includeTransactions: true,
  });

  const match = block.transactions.find(
    (tx) => tx.to?.toLowerCase() === smartContract.toLowerCase()
  );

  return match?.hash || null;
};
